# PG Locator 🏠

**PG Locator** is a premium, fully responsive web application designed to bridge the gap between people seeking paying guest (PG) accommodations and property owners. 

Originally built as a frontend-only prototype, the application has now been **fully migrated to a robust Django backend** powered by a MariaDB/MySQL database.

---

## 🚀 Tech Stack

- **Backend**: Python 3, Django 4.2+ (LTS)
- **Database**: MariaDB / MySQL (via XAMPP)
- **Frontend**: HTML5, CSS3, Bootstrap 5, Vanilla JavaScript (ES6)
- **Data Visualization**: Chart.js (for Admin Dashboards)
- **Authentication**: Django's built-in auth system with custom Role-Based Access Control (Users, Owners, Admins).

---

## ✨ Key Features & Roles

The application supports three distinct user flows, seamlessly integrated into a single architecture.

### 1. Guest / Seeker Flow
- **Modern Landing Page**: Features a stunning hero section, dynamic recent/featured properties loaded from the DB.
- **Advanced Search & Filtering**: *(Coming Soon)* Users will be able to filter listings by Rent, City, Gender, Room Type, and Amenities.
- **Property Details**: Comprehensive view of a property including a responsive image gallery, pricing, and owner details.
- **Favorites & Compare**: *(Coming Soon)* Save properties and compare them side-by-side.

### 2. Property Owner Flow
- **Owner Dashboard**: A clean interface displaying total properties, active vs. pending properties.
- **Advanced CRUD Operations**: Owners can Add, Edit, and Delete properties. Forms handle complex multi-model saving (PG Listing + Rooms + Amenities + Images).
- **Image Management**: Advanced image uploads featuring backend validation, size limits, and interactive AJAX-powered UI to delete or set primary images.

### 3. Admin Flow
- **Listings Management**: Admins can review all platform listings, utilizing 1-click Approve or Revoke actions directly from the dashboard.
- **Content Moderation**: Pending properties remain hidden from public views until an admin approves them.
- **User Management**: *(In Progress)* Interface to manage Regular Users and Owners.

---

## 🏗️ Architecture & Code Organization

The project is structured into modular Django Apps:

```text
pg-locator/
│
├── pg_locator_project/      # Main Django configuration (settings, root urls)
├── core/                    # Static pages (Home, About, FAQ, Contact)
├── accounts/                # Custom User Model & Authentication (Login/Register)
├── pgs/                     # Core Property Models, Amenities, Public Views
├── owners/                  # Owner Dashboard, CRUD forms, and Image APIs
├── dashboard/               # Admin Panel and Moderation Views
├── reviews/                 # (Pending) Ratings and feedback
├── favorites/               # (Pending) Wishlist features
├── compare/                 # (Pending) Side-by-side comparison
│
├── templates/               # Global HTML Templates (using Django Template Language)
├── static/                  # CSS, JS, and UI Assets
└── media/                   # User-uploaded property images
```

---

## 🏃 How to Run Locally

### Prerequisites
- Python 3.10+
- XAMPP (for MySQL/MariaDB)

### Setup Instructions

1. **Start Database Server**:
   Open XAMPP and start the **MySQL** module.
   Create a database named `pg_locator_db`.

2. **Setup Virtual Environment**:
   ```bash
   python -m venv venv
   # Activate it (Windows):
   venv\Scripts\activate
   # Activate it (Mac/Linux):
   source venv/bin/activate
   ```

3. **Install Dependencies**:
   ```bash
   cd pg_locator_project
   pip install django mysqlclient pillow python-dotenv
   ```

4. **Environment Variables**:
   Create a `.env` file in the root directory (next to `manage.py`) with:
   ```env
   SECRET_KEY=your-secret-key
   DEBUG=True
   DB_ENGINE=django.db.backends.mysql
   DB_NAME=pg_locator_db
   DB_USER=root
   DB_PASSWORD=
   DB_HOST=127.0.0.1
   DB_PORT=3306
   ```

5. **Run Migrations**:
   ```bash
   python manage.py migrate
   ```

6. **Start the Server**:
   ```bash
   python manage.py runserver
   ```
   Navigate to `http://127.0.0.1:8000/` in your browser.
