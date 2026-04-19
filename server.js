const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// Load initial data
const items = require('./data.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// In-memory storage for demo (in production, use a database)
let users = [];
let userItems = [...items];
let nextItemId = Math.max(...items.map(item => item.id)) + 1;

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// JWT Secret
const JWT_SECRET = 'campus-exchange-secret-key';

// Helper Functions
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// API Routes

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: uuidv4(),
      fullName,
      email,
      phone,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Generate token
    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Item Routes
app.get('/api/items', (req, res) => {
  try {
    const { category, search } = req.query;
    let filteredItems = userItems;

    // Filter by category
    if (category) {
      filteredItems = filteredItems.filter(item => item.category === category);
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filteredItems = filteredItems.filter(item =>
        item.name.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower)
      );
    }

    res.json(filteredItems);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/items/:id', (req, res) => {
  try {
    const item = userItems.find(item => item.id === parseInt(req.params.id));
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/items', authenticateToken, upload.single('image'), (req, res) => {
  try {
    const {
      name,
      category,
      sellingPrice,
      originalPrice,
      condition,
      yearsUsed,
      yearBought,
      description,
      sellerName,
      contact,
      location
    } = req.body;

    // Create new item
    const newItem = {
      id: nextItemId++,
      name,
      category,
      price: Number(sellingPrice),
      sellingPrice: Number(sellingPrice),
      originalPrice: Number(originalPrice),
      condition,
      yearsUsed: Number(yearsUsed),
      yearBought: Number(yearBought),
      description,
      specs: {},
      sellerName,
      contact,
      location,
      dateAdded: new Date().toISOString().split('T')[0],
      available: true,
      image: req.file ? `/uploads/${req.file.filename}` : 'images/default.jpg',
      userId: req.user.id
    };

    userItems.push(newItem);

    res.status(201).json({
      message: 'Item added successfully',
      item: newItem
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/items/:id', authenticateToken, upload.single('image'), (req, res) => {
  try {
    const itemIndex = userItems.findIndex(item => 
      item.id === parseInt(req.params.id) && item.userId === req.user.id
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found or unauthorized' });
    }

    const updatedItem = {
      ...userItems[itemIndex],
      ...req.body,
      image: req.file ? `/uploads/${req.file.filename}` : userItems[itemIndex].image
    };

    userItems[itemIndex] = updatedItem;

    res.json({
      message: 'Item updated successfully',
      item: updatedItem
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/items/:id', authenticateToken, (req, res) => {
  try {
    const itemIndex = userItems.findIndex(item => 
      item.id === parseInt(req.params.id) && item.userId === req.user.id
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found or unauthorized' });
    }

    userItems.splice(itemIndex, 1);

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// User Routes
app.get('/api/user/items', authenticateToken, (req, res) => {
  try {
    const userItemsList = userItems.filter(item => item.userId === req.user.id);
    res.json(userItemsList);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Categories Route
app.get('/api/categories', (req, res) => {
  try {
    const categories = [
      { id: 'electronics', name: 'Electronics', description: 'Phones, laptops, accessories' },
      { id: 'books', name: 'Books', description: 'Textbooks, novels, study materials' },
      { id: 'furniture', name: 'Furniture', description: 'Chairs, desks, storage' },
      { id: 'accessories', name: 'Accessories', description: 'Watches, bags, jewelry' },
      { id: 'daily', name: 'Daily Essentials', description: 'Kitchen, bathroom, daily use' },
      { id: 'others', name: 'Others', description: 'Everything else' }
    ];

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve static files (for production)
app.use(express.static('.'));

// Catch-all handler for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large' });
    }
  }
  if (err.message === 'Only image files are allowed!') {
    return res.status(400).json({ error: err.message });
  }
  
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Campus Exchange server running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});
