import React, { useState, useEffect } from 'react';
import { Calendar, Target, TrendingUp, Award, Clock, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import ProgressChart from './charts/ProgressChart';
import StreakChart from './charts/StreakChart';
import axios from 'axios';

const API_BASE_URL = 'https://personal-productivity-tracker-backend.onrender.com/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTopics: 0,
    completedTopics: 0,
    inProgressTopics: 0,
    totalQuestions: 0,
    currentStreak: 0,
    longestStreak: 0,
    daysElapsed: 0,
    estimatedCompletion: '',
    recentActivity: []
  });
  const [chartData, setChartData] = useState({
    progress: { labels: [], datasets: [] },
    streak: { labels: [], datasets: [] }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch multiple data sources
      const [topicsRes, logsRes, streakRes, analyticsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/topics`),
        axios.get(`${API_BASE_URL}/logs?limit=7`),
        axios.get(`${API_BASE_URL}/logs/streak`),
        axios.get(`${API_BASE_URL}/logs/analytics?period=30`)
      ]);

      const topics = topicsRes.data;
      const logs = logsRes.data;
      const streakData = streakRes.data;
      const analytics = analyticsRes.data;

      // Calculate statistics
      const totalTopics = topics.length;
      const completedTopics = topics.filter(t => t.status === 'Completed').length;
      const inProgressTopics = topics.filter(t => t.status === 'In Progress').length;
      
      const startDate = new Date(user?.startDate || Date.now());
      const daysElapsed = Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Estimate completion based on current progress
      const progressRate = completedTopics / Math.max(daysElapsed, 1);
      const remainingTopics = totalTopics - completedTopics;
      const estimatedDays = progressRate > 0 ? Math.ceil(remainingTopics / progressRate) : 365;
      const estimatedCompletion = new Date(Date.now() + estimatedDays * 24 * 60 * 60 * 1000).toLocaleDateString();

      setStats({
        totalTopics,
        completedTopics,
        inProgressTopics,
        totalQuestions: analytics.totalQuestions,
        currentStreak: streakData.currentStreak,
        longestStreak: streakData.longestStreak,
        daysElapsed,
        estimatedCompletion,
        recentActivity: logs.slice(0, 5)
      });

      // Prepare chart data
      const progressChartData = {
        labels: ['DSA', 'System Design', 'Design Patterns', 'Generative AI', 'Agentic AI'],
        datasets: [{
          label: 'Completion %',
          data: ['DSA', 'System Design', 'Design Patterns', 'Generative AI', 'Agentic AI'].map(category => {
            const categoryTopics = topics.filter(t => t.category === category);
            const completed = categoryTopics.filter(t => t.status === 'Completed').length;
            return categoryTopics.length > 0 ? Math.round((completed / categoryTopics.length) * 100) : 0;
          }),
          backgroundColor: [
            'rgba(59, 130, 246, 0.6)',
            'rgba(139, 92, 246, 0.6)',
            'rgba(16, 185, 129, 0.6)',
            'rgba(245, 158, 11, 0.6)',
            'rgba(239, 68, 68, 0.6)'
          ],
          borderColor: [
            'rgb(59, 130, 246)',
            'rgb(139, 92, 246)',
            'rgb(16, 185, 129)',
            'rgb(245, 158, 11)',
            'rgb(239, 68, 68)'
          ],
          borderWidth: 2
        }]
      };

      const streakChartData = {
        labels: analytics.dailyData.map(d => new Date(d.date).toLocaleDateString()),
        datasets: [{
          label: 'Questions Solved',
          data: analytics.dailyData.map(d => d.questions),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        }]
      };

      setChartData({
        progress: progressChartData,
        streak: streakChartData
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className={`text-3xl font-bold text-${color}-600 dark:text-${color}-400`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 bg-${color}-100 dark:bg-${color}-900/30 rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
        <p className="text-blue-100 mb-4">
          You've been on your Gen AI journey for {stats.daysElapsed} days. Keep up the great work!
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
            <p className="text-sm opacity-90">Current Streak</p>
            <p className="text-2xl font-bold">{stats.currentStreak} days</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
            <p className="text-sm opacity-90">Questions Solved</p>
            <p className="text-2xl font-bold">{stats.totalQuestions}</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
            <p className="text-sm opacity-90">Estimated Completion</p>
            <p className="text-lg font-semibold">{stats.estimatedCompletion}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={BookOpen}
          title="Total Topics"
          value={stats.totalTopics}
          color="blue"
        />
        <StatCard
          icon={Target}
          title="Completed"
          value={stats.completedTopics}
          subtitle={`${stats.totalTopics > 0 ? Math.round((stats.completedTopics / stats.totalTopics) * 100) : 0}% of total`}
          color="green"
        />
        <StatCard
          icon={Clock}
          title="In Progress"
          value={stats.inProgressTopics}
          color="yellow"
        />
        <StatCard
          icon={Award}
          title="Longest Streak"
          value={`${stats.longestStreak} days`}
          color="purple"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Topic Progress by Category
          </h3>
          <ProgressChart data={chartData.progress} />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Daily Progress (Last 30 Days)
          </h3>
          <StreakChart data={chartData.streak} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Recent Activity
        </h3>
        
        {stats.recentActivity.length > 0 ? (
          <div className="space-y-3">
            {stats.recentActivity.map((log, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {log.questionsSolved} questions solved
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(log.date), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {log.timeStudied ? `${log.timeStudied}m` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">
              No recent activity. Start logging your daily progress!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;