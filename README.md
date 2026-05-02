🚀 Getting Started Locally
1. Prerequisites
    -Node.js (v18+)
    -MongoDB Atlas Account

2. Installation
    Bash

# Clone the repository
git clone https://github.com/25nitya/team-task-manager

# Install Backend dependencies
cd backend
npm install

# Install Frontend dependencies
cd ../client
npm install
3. Environment Variables
Create a .env file in the backend folder and add:

Plaintext

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

🎓 Academic Context
Institution: Pranveer Singh Institute of Technology (PSIT), Kanpur

Degree: Bachelor of Technology in Computer Science & Engineering

Project Phase: Phase 5 (Final Deployment)

Developer: Nitya Gupta

💡 How to update this on GitHub:
Open your project folder.

Open the README.md file.

Delete everything inside and paste the code above.

Important: Replace [Paste your Railway Link here] with your actual live URL.

Save, then run:

Bash

git add README.md
git commit -m "Update README with live link and project details"
git push origin main

.📁 Project Structure
├── backend/            # Express.js Server & API Routes
│   ├── models/         # Mongoose Schemas (User, Task, Project)
│   ├── routes/         # Auth & CRUD Endpoints
│   └── server.js       # Entry point
├── client/             # React.js Frontend
│   ├── src/
│   │   ├── components/ # Dashboard, Register, Login
│   │   └── App.js      # Frontend Routing
└── package.json        # Root configuration for Railway deployment
