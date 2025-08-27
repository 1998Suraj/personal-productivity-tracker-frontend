import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Calendar, Target, Award, Clock } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    totalQuestions: 0,
    totalTime: 0,
    averageQuestions: 0,
    studyDays: 0,
    dailyData: []
  });
  const [period, setPeriod] = useState('30');
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    fetchAnalytics();
    fetchTopics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/logs/analytics?period=${period}`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/topics`);
      setTopics(response.data);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const getTopicStats = () => {
    const categoryStats = {};
    topics.forEach(topic => {
      if (!categoryStats[topic.category]) {
        categoryStats[topic.category] = {
          total: 0,
          completed: 0,
          inProgress: 0,
          notStarted: 0
        };
      }
      categoryStats[topic.category].total++;
      if (topic.status === 'Completed') {
        categoryStats[topic.category].completed++;
      } else if (topic.status === 'In Progress') {
        categoryStats[topic.category].inProgress++;
      } else {
        categoryStats[topic.category].notStarted++;
      }
    });
    return categoryStats;
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600 dark:text-${color}-400`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 bg-${color}-100 dark:bg-${color}-900/30 rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
        </div>
      </div>
    </div>
  );

  const topicStats = getTopicStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Analyze your learning progress and patterns</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Target}
          title="Questions Solved"
          value={analytics.totalQuestions}
          subtitle={`${period} days period`}
          color="blue"
        />
        <StatCard
          icon={Clock}
          title="Study Time"
          value={`${Math.floor(analytics.totalTime / 60)}h ${analytics.totalTime % 60}m`}
          subtitle="Total time invested"
          color="green"
        />
        <StatCard
          icon={BarChart3}
          title="Daily Average"
          value={Math.round(analytics.averageQuestions * 10) / 10}
          subtitle="Questions per day"
          color="purple"
        />
        <StatCard
          icon={Calendar}
          title="Active Days"
          value={analytics.studyDays}
          subtitle={`Out of ${period} days`}
          color="yellow"
        />
      </div>

      {/* Topic Progress by Category */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Progress by Category
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(topicStats).map(([category, stats]) => {
            const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
            
            return (
              <div key={category} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{category}</h4>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Completed</span>
                    <span className="text-green-600 dark:text-green-400 font-medium">{stats.completed}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">In Progress</span>
                    <span className="text-yellow-600 dark:text-yellow-400 font-medium">{stats.inProgress}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Not Started</span>
                    <span className="text-gray-500 dark:text-gray-500 font-medium">{stats.notStarted}</span>
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>Overall Progress</span>
                    <span>{completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Activity Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Daily Activity Pattern
        </h3>
        
        {analytics.dailyData.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-600 dark:text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="overflow-x-auto">
              <div className="flex space-x-1 min-w-max">
                {analytics.dailyData.slice(-49).map((day, index) => {
                  const date = new Date(day.date);
                  const questions = day.questions || 0;
                  const intensity = Math.min(questions / 5, 1); // Normalize to 0-1
                  
                  return (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-sm ${
                        questions === 0
                          ? 'bg-gray-200 dark:bg-gray-700'
                          : questions <= 2
                          ? 'bg-blue-300 dark:bg-blue-800'
                          : questions <= 4
                          ? 'bg-blue-500 dark:bg-blue-600'
                          : 'bg-blue-700 dark:bg-blue-400'
                      }`}
                      title={`${date.toLocaleDateString()}: ${questions} questions`}
                    ></div>
                  );
                })}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>Less</span>
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-sm"></div>
                <div className="w-3 h-3 bg-blue-300 dark:bg-blue-800 rounded-sm"></div>
                <div className="w-3 h-3 bg-blue-500 dark:bg-blue-600 rounded-sm"></div>
                <div className="w-3 h-3 bg-blue-700 dark:bg-blue-400 rounded-sm"></div>
              </div>
              <span>More</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">
              No activity data available for the selected period
            </p>
          </div>
        )}
      </div>

      {/* Insights and Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2" />
          Insights & Recommendations
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Study Patterns</h4>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>
                • You've been active for {analytics.studyDays} out of {period} days 
                ({Math.round((analytics.studyDays / parseInt(period)) * 100)}% consistency)
              </p>
              <p>
                • Your daily average is {Math.round(analytics.averageQuestions * 10) / 10} questions
              </p>
              <p>
                • Total learning time: {Math.floor(analytics.totalTime / 60)} hours and {analytics.totalTime % 60} minutes
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recommendations</h4>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              {analytics.averageQuestions < 2 && (
                <p>• Try to solve at least 2-3 questions daily to maintain momentum</p>
              )}
              {analytics.studyDays / parseInt(period) < 0.5 && (
                <p>• Aim for more consistent daily practice to improve retention</p>
              )}
              {Object.values(topicStats).some(stat => stat.notStarted > stat.completed) && (
                <p>• Consider focusing on completing started topics before adding new ones</p>
              )}
              <p>• Keep up the great work! Consistency is key to mastering Gen AI development</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;