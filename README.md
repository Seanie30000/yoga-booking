
# Yoga & Mindfulness Studio Booking System

A web-based booking system for a Yoga & Mindfulness Studio, built with Node.js, 
Express, NeDB and Mustache templates.

## Technologies Used

- Node.js & Express — backend framework
- NeDB-promises — lightweight database
- Mustache — templating engine
- bcrypt — password hashing
- express-session — user session management

## How to Run the Site

### Prerequisites
Make sure you have the following installed:
- Node.js (v18 or above)
- npm

### Installation

1. Clone the repository:
git clone <https://github.com/Seanie30000/yoga-booking.git>
cd WAD2_posscw_2526---Start

2. Install dependencies:
npm install

3. Seed the database with sample data:
npm run seed

4. Start the development server:
npm run dev

5. Open your browser and visit:
http://localhost:3000

### Test Accounts

After seeding the database the following accounts are available:

| Role | Email | Password |
|---|---|---|
| Organiser | organiser@yoga.local | admin123 |
| Student | fiona@student.local | student123 |

## Features Implemented

### Public Features (no login required)
- Information/about page with overview of the studio
- Browse all upcoming courses and workshops
- View course details including sessions, location and price
- Filter courses by level and type
- Search courses by keyword

### Registered User Features
- User registration and login
- Book a full course
- Book a single drop-in session
- Booking confirmation page

### Organiser Features
- Add new courses with full details
- Edit existing courses
- Delete courses and their sessions
- Add and delete individual sessions
- View class list with participant names for any session
- Manage all users — change roles and delete users

### Authentication & Security
- Secure password hashing with bcrypt
- Session based authentication with express-session
- Role based access control — organiser routes protected
- Login and register pages
- Logout functionality

## Deployment

A live version of the site is available at:
<your-deployment-url>
