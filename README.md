# BigBrain - Interactive Quiz Game Platform 🧠

BigBrain is a modern online quiz game platform, similar to Kahoot, that supports real-time multiplayer interactive quiz experiences. Teachers or administrators can create quiz games, and students or players can participate in real-time using session IDs.

## ✨ Key Features

### 🎮 Administrator Features
- **User Authentication**: Registration, login, and logout system
- **Game Management**: Create, edit, and delete quiz games
- **Question Editing**: Support for multiple question types (single choice, multiple choice, true/false)
- **Session Control**: Start/stop game sessions with real-time game progress control
- **Data Analytics**: View game results, statistics, and chart analysis
- **History Records**: Access to previous game session records

### 👥 Player Features
- **Quick Join**: Join games quickly using session ID or direct link
- **Real-time Interaction**: Participate in quizzes in real-time with countdown timers
- **Multimedia Support**: Support for images and YouTube videos in questions
- **Instant Feedback**: View answer results and scoring
- **Game Results**: Personal performance summary and leaderboards

### 🎯 Question Types Supported
- **Single Choice**: Select one correct answer from multiple options
- **Multiple Choice**: Select all correct answers from multiple options
- **True/False**: Judge whether statements are correct or incorrect

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **UI Components**: Custom components + Tailwind CSS
- **Charts**: Chart.js
- **Icons**: Lucide React
- **Testing**: Vitest + Testing Library

### Backend
- **Framework**: Express.js + Node.js
- **Data Storage**: JSON file storage
- **Authentication**: JWT Token
- **API Documentation**: Swagger UI
- **Testing**: Jest + Supertest

### Development Tools
- **Code Standards**: ESLint
- **Deployment**: Vercel
- **Version Control**: Git

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation and Setup

1. **Clone the repository**
```bash
git clone https://github.com/jiangzegege123/bigbrain-public.git
cd bigbrain-public
```

2. **Start the backend service**
```bash
cd backend
npm install
npm run dev
```
Backend service will start at http://localhost:5005

3. **Start the frontend application**
```bash
cd frontend
npm install
npm run dev
```
Frontend application will start at http://localhost:5173

### Usage Instructions

1. **Administrator Operations**:
   - Visit http://localhost:5173/register to create an account
   - Login and create games in the dashboard
   - Add questions and set answers, time limits, points, etc.
   - Click "Start Game" to get session ID

2. **Player Participation**:
   - Visit http://localhost:5173/join
   - Enter session ID and nickname to join the game
   - Wait for administrator to start the game and participate in real-time

## 📁 Project Structure

```
bigbrain/
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/          # Page components
│   │   ├── api/            # API interfaces
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   └── types/          # TypeScript type definitions
│   └── public/             # Static assets
├── backend/                 # Express backend API
│   ├── src/
│   │   ├── server.js       # Server entry point
│   │   ├── service.js      # Business logic
│   │   └── storage.js      # Data storage
│   └── test/               # Backend tests
└── util/                   # Utility scripts
```

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run test        # Run component tests
npm run lint        # Code standard checks
```

### Backend Testing
```bash
cd backend
npm run test        # Run API tests
npm run lint        # Code standard checks
```

## 🚀 Deployment

The project supports deployment to Vercel platform:

1. Fork this repository to your GitHub
2. Import the project in Vercel
3. Deploy frontend and backend separately:
   - Frontend: Set Root Directory to `frontend`
   - Backend: Set Root Directory to `backend`

For detailed deployment instructions, refer to `deployment.md`

## 📋 Features

- ✅ Fully responsive design with mobile support
- ✅ Real-time gaming experience without page refresh
- ✅ Multimedia question content support
- ✅ Real-time data statistics and visualization
- ✅ User-friendly interface design
- ✅ Comprehensive test coverage
- ✅ Accessibility support

## 🤝 Contributing

Welcome to submit Issues and Pull Requests to improve the project!

## 📄 License

This project is for learning and demonstration purposes only.

## 📞 Contact

For questions or suggestions, please contact through GitHub Issues.

---

**Enjoy your BigBrain quiz game experience!** 🎉
