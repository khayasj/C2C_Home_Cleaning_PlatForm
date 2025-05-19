# C2C Home Cleaning Platform

A role-based customer-to-customer (C2C) platform that connects freelance home cleaners with homeowners. The system supports booking management, cleaner recommendations, admin controls, and real-time dashboards using a full-stack JavaScript implementation with BCE structure.

## User Roles & Features

### User Admin
• Login, logout, create/update/delete/search user accounts and profiles.  
• Manage all platform users.

### Cleaner
• Manage cleaning services (create, view, update, delete, search)  
• View service views and shortlist counts  
• View/search confirmed match history

### Homeowner
• Search and view available services  
• Save services to shortlist and compare options  
• View history of previously matched cleaners

### Platform Admin
• Manage service categories  
• Generate daily, weekly, and monthly category reports

## Tech Stack

• React.js + Vite, HTML, CSS, Bootstrap (Frontend)  
• Node.js + Express.js (Backend)  
• MySQL (Database)  
• BCE (Boundary, Controller, Entity) structure  
• GitHub Actions (CI/CD)  
• Draw.io, JSON, Taiga (Documentation & Planning)

## Project Structure
```📦 project-root
├── client/
│   └── src/
│       ├── boundary/         # Frontend role-specific views
│       └── components/       # Reusable React components
├── server/
│   ├── controllers/          # Business logic (Node.js)
│   ├── entities/             # Database interaction logic
│   ├── server.js             # Express backend entry point
│   └── database.sql          # MySQL schema
```
## 🚀 How to Run

### Backend (port 5000)
```bash
cd server
npm install
node server.js
```
### Frontend (port 5173)
```bash
cd client  
npm install  
npm run dev
```

## Author  
**Shin Than Thar Aung**
