# Employee Management System

A full-stack **Employee Management System** built with **React**, **FastAPI**, **SQLAlchemy**, and **MySQL**.

This project is designed as a portfolio-level business application that demonstrates authentication, role-based permissions, employee operations, user management, dashboard analytics, and modern React/Python full-stack architecture.

---

## Project Overview

The application allows authenticated users to manage employee records through a clean dashboard interface. It includes role-based access control, employee search/filter/sort/pagination, CSV export, dashboard analytics, and an admin-seeded user management system.

The main goal of this project is to demonstrate practical employability skills in a React + Python stack:

- Building a REST API with FastAPI
- Designing protected backend routes
- Managing authentication with JWT
- Handling role-based authorization
- Connecting React to a backend API
- Managing server state with Redux Toolkit
- Working with SQLAlchemy models and repositories
- Creating dashboard analytics from backend data
- Running the app with Docker-based development setup

---

## Tech Stack

### Frontend

- React
- React Router
- Redux Toolkit
- Axios
- Recharts
- Tailwind CSS
- React Toastify

### Backend

- FastAPI
- SQLAlchemy
- Pydantic
- JWT authentication
- Argon2 password hashing
- Repository-style data access

### Database / DevOps

- MySQL
- Docker Compose
- Environment-based configuration
- Admin account seeding

---

## Features

### Authentication

- Public user registration
- Secure password hashing
- JWT login
- Access token-based route protection
- Seeded admin account for first deployment

### Authorization

- Role-based access control
- User, Manager, and Admin roles
- Managers/Admins can view users
- Admins can edit roles and delete users
- Managers/Admins can delete employees

### Employee Management

- Create employees
- View employees
- Update employees
- Delete employees with role restrictions
- Search employees by name
- Filter employees by type
- Sort employees
- Backend pagination
- CSV export

### User Management

- View registered users
- Search users
- Filter users by role
- Admin role editing
- Admin user deletion

### Dashboard

- Dashboard summary endpoint
- Total employee count
- Employee type distribution
- Average salary
- Charts using Recharts
- Backend-calculated analytics instead of frontend-only paginated calculations

---

## Project Structure

```txt
employee-management-system/
│
├── backend/
│   ├── database/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── schemas/
│   ├── security/
│   ├── main.py
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   └── App.js
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── .gitignore
└── README.md
```
