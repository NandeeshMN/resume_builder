# ResuMetric - Premium SaaS Resume Builder

ResuMetric is a full-stack Django and MySQL application for building ATS-optimized, visually stunning resumes. It features multiple design templates (Professional, Modern, Student, Minimal), interactive customizers (margins, colors, fonts, photo toggles), a live rendering page, real-time completion status checking, an ATS analysis simulator, and instant PDF vector downloads.

## Features

- **Django Backend & URL Routing**: Implements fully functional views for editing, viewing, and deleting resumes.
- **Relational MySQL Schema & Django ORM**: Saves resume data structure securely across relational MySQL database tables.
- **Live Preview Sync**: Form details and styles synchronize in real-time with the A4 layout.
- **AJAX Database Saving**: Clicking "Save Resume" in the header collects the form state and updates the MySQL database atomically with CSRF validation.
- **Interactive Listings View**: Dashboard panel to view, edit, and delete saved resumes.
- **Django Admin Panel**: Ready-to-use admin workspace with nested inline structures to inspect all resume parts in one view.
- **ATS Analyzer Widget**: Simulated keyword scan scoring and suggestions list.

---

## Technical Stack

- **Backend**: Python, Django 5.2+
- **Database**: MySQL 8.0+
- **Frontend**: HTML5, Vanilla CSS3, JavaScript (ES6)
- **PDF Generation**: html2pdf.js

---

## Prerequisites

1. **Python 3.12+**

---

## Setup & Running Instructions

### 1. Database Configuration
Ensure a MySQL database named `resumetric_db` exists on `localhost:3306`. (Settings default: user: `root`, password: `cbs123`).

### 2. Install Dependencies
Run the command below in the repository root directory to install required packages:
```bash
pip install -r requirements.txt
```

### 3. Run Migrations
Run the migrations to create all database tables in MySQL:
```bash
python manage.py migrate
```

### 4. Run the Development Server
Start the server:
```bash
python manage.py runserver
```
Open your browser and navigate to:
- App Dashboard: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- Saved Resumes List: [http://127.0.0.1:8000/resumes/](http://127.0.0.1:8000/resumes/)
- Django Admin Workspace: [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)
  - **Username**: `admin`
  - **Password**: `admin123`

---

## Running Tests
Run the unit test suite verifying the database save endpoint and views:
```bash
python manage.py test
```
