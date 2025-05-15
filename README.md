# Social Media App (MEAN Stack)

A comprehensive social media platform built using the MEAN Stack (MongoDB, Express.js, Angular, Node.js). This project demonstrates modern web development practices and includes essential features commonly found in social platforms.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Project Structure](#project-structure)
  - [Available Scripts](#available-scripts)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features
- Authentication: Secure login and registration using JWT
- User Profiles: Update personal info and profile pictures
- Posts: Create, edit, delete, and view posts
- Real-Time Updates: Using WebSockets for instant interactions
- Responsive Design: Fully optimized for mobile and desktop
- Dynamic Feed: Auto-updating post feed from followed users

## Tech Stack
- Frontend: Angular (TypeScript, SCSS, HTML)
- Backend: Node.js with Express.js
- Database: MongoDB
- Authentication: JSON Web Tokens (JWT)
- Styling: SCSS

## Getting Started

### Prerequisites
- Node.js (v16+): https://nodejs.org/
- MongoDB (local or remote)
- Angular CLI: Install globally with  
  `npm install -g @angular/cli`

### Installation

Clone the Repository:
```
git clone https://github.com/OmarAboelnaga121/Social-Media-App.git
cd Social-Media-App
```

Install Dependencies:

**Backend**
```
cd backend
npm install
```

**Frontend**
```
cd ../frontend
npm install
```

Set Environment Variables:

Create a `.env` file inside the `backend` directory and configure:

```
PORT=5000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
```

### Run the Application

Start the backend:
```
cd backend
npm start
```

Start the frontend:
```
cd ../frontend
ng serve
```

Access the app at: http://localhost:4200

## Project Structure
```
Social-Media-App/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   └── src/
│       ├── app/
│       ├── assets/
│       └── environments/
└── README.md
```

## Available Scripts

**Backend**
- `npm start` – Start the server
- `npm run dev` – Run server with nodemon

**Frontend**
- `ng serve` – Run Angular dev server
- `ng build --prod` – Build frontend for production

## Usage
- Register or log in
- Create and manage posts
- View other users' posts in the feed
- Update profile with picture and bio
- Receive real-time notifications

## Contributing
1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m "Add feature"`
4. Push to branch: `git push origin feature-name`
5. Open a Pull Request

## License
This project is licensed under the MIT License.

---

Built by [Omar Aboelnaga](https://github.com/OmarAboelnaga121)
