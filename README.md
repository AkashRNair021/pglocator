# PG Locator 🏠

**PG Locator** is a premium, fully responsive, frontend-only web application designed to bridge the gap between people seeking paying guest (PG) accommodations and property owners. 

This project was built from scratch without any backend frameworks to demonstrate advanced vanilla JavaScript DOM manipulation, state management via LocalStorage, and modern UI/UX design principles.

---

## 🚀 Tech Stack

- **HTML5**: Semantic and accessible markup.
- **CSS3**: Custom variables, glassmorphism, flexbox/grid layouts, micro-animations, and skeleton loaders.
- **Bootstrap 5**: Responsive grid system, modals, accordions, and utility classes.
- **Vanilla JavaScript (ES6)**: Modular architecture, dynamic rendering, and client-side logic.
- **Chart.js**: Data visualization for the Admin dashboard.
- **LocalStorage**: Simulates a persistent database across sessions.

---

## ✨ Key Features & Roles

The application supports three distinct user flows, seamlessly integrated into a single frontend architecture.

### 1. Guest / Seeker Flow
- **Modern Landing Page**: Features a stunning hero section, quick search bar, and featured properties.
- **Advanced Search & Filtering**: Users can filter listings by Rent, City, Gender, Room Type, and specific Amenities in real-time.
- **Property Details**: Comprehensive view of a property including interactive image galleries, pricing, owner contact info, and reviews.
- **Favorites System**: Users can click the heart icon to save properties. The state is globally synced and viewable on a dedicated Favorites page.
- **Side-by-side Compare**: Select up to 3 properties and view them in a dynamic comparison table to evaluate amenities and pricing.

### 2. Property Owner Flow
- **Owner Dashboard**: A clean interface displaying estimated revenue, occupied/vacant rooms, and a table of owned properties.
- **CRUD Operations**: Owners can Add, Edit, and Delete properties via sleek Bootstrap modals.
- **Live Preview**: When adding a property, owners can generate a live preview of how their card will look to seekers before publishing.

### 3. Admin Flow
- **Admin Dashboard**: A specialized dark-sidebar layout featuring Chart.js visualizations tracking platform growth and user categories.
- **Listings Management**: Admins can review all platform listings, utilizing 1-click Approve, Reject, or Delete actions. Features client-side pagination and status filtering.
- **User Management**: Tabbed interface to manage Regular Users and Owners. Admins can permanently delete accounts or temporarily suspend them.

### 4. Informational Pages
- **About Us**: Beautifully styled company history timeline, mission/vision cards, and team profiles.
- **FAQ**: Bootstrap accordion-based knowledge base featuring a **Live Search** that instantly expands matching questions as you type.
- **Contact Us**: Comprehensive form with HTML5 validation and a simulated network request loading state.

---

## 🏗️ Architecture & Code Organization

```text
pg-locator/
│
├── index.html                 # Landing Page
├── 404.html                   # Error Page
├── README.md                  # Project Documentation
│
├── pages/                     # All application views
│   ├── listings.html
│   ├── property-details.html
│   ├── compare.html
│   ├── favorites.html
│   ├── owner-dashboard.html
│   ├── owner-add-pg.html
│   ├── admin-dashboard.html
│   ├── admin-listings.html
│   ├── admin-users.html
│   ├── about.html
│   ├── faq.html
│   └── contact.html
│
├── css/                       # Modular Stylesheets
│   ├── style.css              # Global variables, loaders, animations
│   ├── navbar.css             # Sticky navigation styles
│   ├── dashboard.css          # Shared admin/owner panel styles
│   ├── admin.css              # Admin-specific sidebar layout
│   └── about.css              # Premium about page specific styles
│
└── js/                        # Modular JavaScript Logic
    ├── data.js                # Core LocalStorage Mock DB & Seeding
    ├── app.js                 # Global utilities, Navbar/Footer injection
    ├── search.js              # Filtering, sorting, and skeleton loaders
    ├── compare.js             # Side-by-side table generation
    ├── favorites.js           # Favorites state rendering
    ├── property-details.js    # Single property dynamic view mapping
    ├── owner.js               # Owner CRUD modal logic
    ├── owner-add-pg.js        # New listing validation and preview
    ├── admin.js               # Chart.js initialization and stats
    ├── admin-listings.js      # Moderation tools and pagination
    ├── admin-users.js         # User suspension and role tabs
    ├── faq.js                 # Live search accordion logic
    └── contact.js             # Form validation simulation
```

---

## 🧠 State Management (LocalStorage)

To achieve a full application feel without a backend, the project relies heavily on `window.localStorage`.
- **`pgListings`**: An array of complex JSON objects representing every property. Edited instantly during Owner/Admin actions.
- **`pgFavorites` / `pgCompareList`**: Arrays storing Property IDs saved by the user.
- **`adminMockUsers`**: Mock database for the Admin User Management panel.

---

## 🏃 How to Run

Because this is a completely vanilla frontend project with no build tools or servers required:
1. Clone or download the repository.
2. Open `index.html` directly in any modern web browser (Chrome, Firefox, Safari, Edge).
3. Navigate the site entirely through the UI! 

*(Note: Ensure JavaScript is enabled in your browser).*
