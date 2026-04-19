# Campus Exchange

A student-to-student marketplace platform for buying, selling, exchanging, or giving away items safely within your campus community.

## Features

- **Campus Verified**: Only verified students can participate
- **Safe Exchange**: Secure platform for campus transactions
- **Multiple Categories**: Electronics, Books, Furniture, Daily Essentials, and more
- **Buy/Sell/Give Away**: Flexible exchange options
- **Search & Filter**: Find items quickly by category or search terms
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with modern design principles
- **Storage**: LocalStorage for data persistence
- **Fonts**: Google Fonts (Inter)
- **Images**: Unsplash for category placeholder images

## Project Structure

```
field project/
|-- css/
|   |-- style.css              # Main stylesheet
|-- images/                    # Product images
|-- index.html                 # Homepage
|-- categories.html            # Browse categories
|-- items.html                 # Item listings
|-- item_details.html          # Individual item details
|-- sell.html                  # Sell an item form
|-- login.html                 # User login
|-- signup.html                # User registration
|-- data.js                    # Sample product data
|-- README.md                  # Project documentation
```

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, but recommended)

### Installation

1. Clone or download the repository
2. Navigate to the project directory
3. Open `index.html` in your web browser

For development with a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## Usage

### For Buyers
1. Browse categories or search for specific items
2. View item details and seller information
3. Contact sellers directly through provided contact information

### For Sellers
1. Sign up for an account
2. Fill out the sell form with item details
3. Upload item images
4. Set pricing and availability
5. Manage listings through the platform

### Features Breakdown

#### Categories
- **Electronics**: Phones, laptops, accessories, gadgets
- **Books**: Textbooks, novels, study materials
- **Furniture**: Chairs, desks, storage units
- **Daily Essentials**: Kitchen items, bathroom necessities
- **Accessories**: Watches, bags, jewelry
- **Others**: Everything else

#### Search Functionality
- Real-time search across item names, categories, and descriptions
- Category-based filtering
- URL parameter support for direct category access

#### Data Management
- LocalStorage integration for persistent data
- Sample dataset with 40+ pre-populated items
- Dynamic item addition through the sell form

## Customization

### Adding New Categories
1. Update the category options in `sell.html`
2. Add corresponding CSS classes in `style.css`
3. Update category data in `data.js`

### Modifying Styles
- All styles are in `css/style.css`
- Uses CSS custom properties for easy theming
- Responsive breakpoints at 768px

### Extending Functionality
- Add new JavaScript modules in the `<script>` sections
- Extend the data model in `data.js`
- Implement backend API integration as needed

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Unsplash for beautiful category placeholder images
- Google Fonts for the Inter font family
- Campus community for inspiring this project

## Contact

For questions, suggestions, or support, please open an issue in the GitHub repository.

---

**Campus Exchange** - Connecting Students, Simplifying Exchange
