# Gen AI Developer Productivity Tracker

A comprehensive full-stack web application for tracking your journey to becoming a Generative AI developer. Built with React, Node.js, Express, and MongoDB.

## Features

### 🎯 Core Features
- **Dashboard**: Visual progress tracking with charts and analytics
- **Topic Management**: Organize learning topics across DSA, System Design, Design Patterns, Gen AI, and Agentic AI
- **Daily Logging**: Track questions solved, study time, and maintain streaks
- **Goal Setting**: Set and monitor learning milestones with progress tracking
- **PDF Integration**: Upload and extract learning topics from PDF documents
- **Analytics**: Comprehensive insights into learning patterns and progress

### 🎨 Design Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Mode**: Toggle between light and dark themes
- **Modern UI**: Glassmorphism effects, smooth animations, and premium aesthetics
- **Interactive Charts**: Progress visualization with Chart.js integration
- **Intuitive Navigation**: Clean, organized interface with easy access to all features

### 🔐 Technical Features
- **JWT Authentication**: Secure user login and session management
- **Real-time Updates**: Live progress tracking and notifications
- **Data Persistence**: MongoDB database for reliable data storage
- **PDF Processing**: Automatic topic extraction from uploaded documents
- **Email Notifications**: Customizable reminders and progress reports

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Chart.js & React-Chart.js-2** for data visualization
- **React Router** for navigation
- **React Calendar** for date picking
- **React PDF** for PDF viewing
- **React Hot Toast** for notifications
- **Axios** for API communication

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **PDF-Parse** for PDF text extraction
- **Nodemailer** for email notifications

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd gen-ai-productivity-tracker
```

### 2. Install Dependencies

**Frontend Dependencies:**
```bash
npm install
```

**Backend Dependencies:**
```bash
cd server
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `server` directory:
```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/productivity-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 4. Database Setup

Ensure MongoDB is running:
- **Local MongoDB**: Start your local MongoDB service
- **MongoDB Atlas**: Use your connection string in `MONGODB_URI`

### 5. Run the Application

**Development Mode (runs both frontend and backend):**
```bash
npm run dev
```

**Or run separately:**

Frontend:
```bash
npm run dev
```

Backend:
```bash
cd server
npm start
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `https://personal-productivity-tracker-backend.onrender.com`   

## Database Schema

### User Collection
```javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  startDate: Date,
  settings: {
    darkMode: Boolean,
    notifications: Boolean,
    dailyGoal: Number
  },
  stats: {
    totalQuestions: Number,
    currentStreak: Number,
    longestStreak: Number,
    totalPoints: Number,
    badges: [String]
  }
}
```

### Topics Collection
```javascript
{
  userId: ObjectId,
  category: String, // 'DSA', 'System Design', etc.
  name: String,
  description: String,
  subtopics: [{
    name: String,
    status: String,
    startDate: Date,
    endDate: Date,
    timeSpent: Number,
    notes: String
  }],
  status: String, // 'Not Started', 'In Progress', 'Completed'
  associatedTags: [String],
  priority: String, // 'Low', 'Medium', 'High'
  resources: [{
    title: String,
    url: String,
    type: String
  }],
  progress: Number // 0-100
}
```

### Daily Logs Collection
```javascript
{
  userId: ObjectId,
  date: Date,
  questionsSolved: Number,
  timeStudied: Number, // in minutes
  notes: String,
  linkedTopics: [{
    topicId: ObjectId,
    subtopicName: String,
    questionsCount: Number
  }],
  mood: String,
  achievements: [String]
}
```

### Goals Collection
```javascript
{
  userId: ObjectId,
  title: String,
  description: String,
  category: String,
  targetDate: Date,
  progress: Number, // 0-100
  status: String, // 'Active', 'Completed', 'Paused', 'Cancelled'
  milestones: [{
    title: String,
    targetDate: Date,
    completed: Boolean,
    completedDate: Date
  }]
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/settings` - Update user settings

### Topics
- `GET /api/topics` - Get all topics for user
- `POST /api/topics` - Create new topic
- `PUT /api/topics/:id` - Update topic
- `DELETE /api/topics/:id` - Delete topic
- `PUT /api/topics/:id/subtopics/:subtopicId` - Update subtopic

### Daily Logs
- `GET /api/logs` - Get daily logs
- `POST /api/logs` - Create/update daily log
- `GET /api/logs/streak` - Get streak information
- `GET /api/logs/analytics` - Get analytics data

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### PDF Processing
- `POST /api/pdf/upload` - Upload and process PDF

### Notifications
- `POST /api/notifications/reminder` - Send reminder email

## Usage Guide

### 1. Getting Started
1. Register for a new account or login with existing credentials
2. Complete your profile setup in Settings
3. Set your daily question-solving goal

### 2. Managing Topics
1. Navigate to Topics page
2. Click "Add Topic" to create new learning topics
3. Organize topics by category (DSA, System Design, etc.)
4. Add subtopics, tags, and resources for detailed tracking
5. Update progress and status as you learn

### 3. Daily Logging
1. Visit the Daily Log page
2. Click "Log Today" to record your daily progress
3. Enter questions solved, study time, and notes
4. Link your progress to specific topics
5. View your streak and consistency on the calendar

### 4. Setting Goals
1. Go to Goals section
2. Create learning milestones with target dates
3. Track progress towards each goal
4. Add milestones for complex goals
5. Monitor completion rates and adjust timelines

### 5. PDF Integration
1. Upload your DSA study materials in PDF format
2. Review auto-extracted topics
3. Select relevant topics to add to your learning plan
4. Customize and organize the imported topics

### 6. Analytics & Progress
1. Check the Dashboard for overall progress overview
2. Visit Analytics for detailed insights
3. Review learning patterns and consistency
4. Identify areas needing more focus

## Customization

### Themes
- Toggle dark/light mode in Settings
- Consistent color scheme across all components
- Responsive design adapts to all screen sizes

### Notifications
- Configure email reminders in Settings
- Set daily/weekly notification preferences
- Test notification system with sample emails

### Goals & Milestones
- Create custom learning goals
- Set realistic timelines
- Track progress with visual indicators

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: Restricted file types and sizes
- **CORS Protection**: Configured for secure cross-origin requests

## Performance Optimizations

- **Lazy Loading**: Components loaded on demand
- **Optimized Queries**: Efficient database queries with proper indexing
- **Caching**: Browser caching for static assets
- **Responsive Images**: Optimized loading for different screen sizes
- **Bundle Optimization**: Vite build optimization

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue on GitHub or contact the development team.

## Future Enhancements

- AI-powered learning recommendations
- Social features for study groups
- Integration with coding platforms (LeetCode, HackerRank)
- Mobile app companion
- Advanced analytics with ML insights
- Spaced repetition algorithm for topic review
- Gamification with achievements and leaderboards