import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, Clock, BookOpen, Target, TrendingUp } from 'lucide-react';
import Calendar from 'react-calendar';
import { format, startOfDay, isSameDay } from 'date-fns';
import axios from 'axios';
import toast from 'react-hot-toast';
import 'react-calendar/dist/Calendar.css';

const API_BASE_URL = 'https://personal-productivity-tracker-backend.onrender.com/api';

const DailyLog = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [logs, setLogs] = useState([]);
  const [todayLog, setTodayLog] = useState(null);
  const [topics, setTopics] = useState([]);
  const [showLogModal, setShowLogModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [streakInfo, setStreakInfo] = useState({ currentStreak: 0, longestStreak: 0 });

  useEffect(() => {
    fetchLogs();
    fetchTopics();
    fetchStreakInfo();
  }, []);

  useEffect(() => {
    const log = logs.find(log => isSameDay(new Date(log.date), selectedDate));
    setTodayLog(log || null);
  }, [selectedDate, logs]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/logs?limit=100`);
      setLogs(response.data);
    } catch (error) {
      toast.error('Error fetching logs');
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

  const fetchStreakInfo = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/logs/streak`);
      setStreakInfo(response.data);
    } catch (error) {
      console.error('Error fetching streak info:', error);
    }
  };

  const getTileContent = ({ date, view }) => {
    if (view === 'month') {
      const log = logs.find(log => isSameDay(new Date(log.date), date));
      if (log && log.questionsSolved > 0) {
        return (
          <div className="flex items-center justify-center">
            <div className={`w-2 h-2 rounded-full ${
              log.questionsSolved >= 5 ? 'bg-green-500' : 
              log.questionsSolved >= 3 ? 'bg-yellow-500' : 
              'bg-blue-500'
            }`}></div>
          </div>
        );
      }
    }
    return null;
  };

  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      if (isSameDay(date, selectedDate)) {
        return 'bg-blue-500 text-white';
      }
      const log = logs.find(log => isSameDay(new Date(log.date), date));
      if (log && log.questionsSolved > 0) {
        return 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      }
    }
    return '';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Daily Log</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your daily learning progress</p>
        </div>
        <button
          onClick={() => setShowLogModal(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <Plus className="w-5 h-5" />
          <span>Log Today</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={Target}
          title="Current Streak"
          value={`${streakInfo.currentStreak} days`}
          color="green"
        />
        <StatCard
          icon={TrendingUp}
          title="Longest Streak"
          value={`${streakInfo.longestStreak} days`}
          color="blue"
        />
        <StatCard
          icon={BookOpen}
          title="Questions Today"
          value={todayLog?.questionsSolved || 0}
          color="purple"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2" />
              Learning Calendar
            </h3>
            
            <div className="calendar-container">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileContent={getTileContent}
                tileClassName={getTileClassName}
                className="mx-auto"
              />
            </div>

            <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">1-2 questions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">3-4 questions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">5+ questions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Day Details */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            
            {todayLog ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="font-medium text-green-800 dark:text-green-300">
                      Questions Solved
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {todayLog.questionsSolved}
                  </span>
                </div>

                {todayLog.timeStudied && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="font-medium text-blue-800 dark:text-blue-300">
                        Time Studied
                      </span>
                    </div>
                    <span className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                      {todayLog.timeStudied}m
                    </span>
                  </div>
                )}

                {todayLog.mood && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Mood</p>
                    <p className="font-medium text-gray-900 dark:text-white">{todayLog.mood}</p>
                  </div>
                )}

                {todayLog.notes && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Notes</p>
                    <p className="text-gray-900 dark:text-white">{todayLog.notes}</p>
                  </div>
                )}

                {todayLog.linkedTopics && todayLog.linkedTopics.length > 0 && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Topics Studied</p>
                    <div className="space-y-1">
                      {todayLog.linkedTopics.map((link, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-900 dark:text-white">
                            {link.topicId?.name || 'Unknown Topic'}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {link.questionsCount} questions
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">
                  No activity recorded for this day
                </p>
                {isSameDay(selectedDate, new Date()) && (
                  <button
                    onClick={() => setShowLogModal(true)}
                    className="mt-3 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Log today's progress
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Log Modal */}
      {showLogModal && (
        <LogModal
          selectedDate={selectedDate}
          existingLog={todayLog}
          topics={topics}
          onClose={() => setShowLogModal(false)}
          onSave={() => {
            fetchLogs();
            fetchStreakInfo();
            setShowLogModal(false);
          }}
        />
      )}

      <style jsx>{`
        .calendar-container .react-calendar {
          width: 100%;
          background: transparent;
          border: none;
          font-family: inherit;
        }
        
        .calendar-container .react-calendar__tile {
          max-width: 100%;
          padding: 1rem 0.5rem;
          background: none;
          text-align: center;
          line-height: 16px;
          font-size: 0.875rem;
          position: relative;
        }
        
        .calendar-container .react-calendar__tile:enabled:hover,
        .calendar-container .react-calendar__tile:enabled:focus {
          background-color: rgba(59, 130, 246, 0.1);
        }
        
        .calendar-container .react-calendar__tile--now {
          background: rgba(239, 68, 68, 0.1);
          color: rgb(239, 68, 68);
        }
        
        .calendar-container .react-calendar__tile--now:enabled:hover,
        .calendar-container .react-calendar__tile--now:enabled:focus {
          background: rgba(239, 68, 68, 0.2);
        }
        
        .calendar-container .react-calendar__tile--active {
          background: rgb(59, 130, 246) !important;
          color: white !important;
        }
        
        .dark .calendar-container .react-calendar {
          color: white;
        }
        
        .dark .calendar-container .react-calendar__tile:enabled:hover,
        .dark .calendar-container .react-calendar__tile:enabled:focus {
          background-color: rgba(59, 130, 246, 0.2);
        }
      `}</style>
    </div>
  );
};

// Log Modal Component
const LogModal = ({ selectedDate, existingLog, topics, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    date: selectedDate,
    questionsSolved: 0,
    timeStudied: 0,
    notes: '',
    mood: '',
    linkedTopics: []
  });
  const [loading, setLoading] = useState(false);

  const moods = ['Excellent', 'Good', 'Average', 'Below Average', 'Poor'];

  useEffect(() => {
    if (existingLog) {
      setFormData({
        date: new Date(existingLog.date),
        questionsSolved: existingLog.questionsSolved || 0,
        timeStudied: existingLog.timeStudied || 0,
        notes: existingLog.notes || '',
        mood: existingLog.mood || '',
        linkedTopics: existingLog.linkedTopics || []
      });
    }
  }, [existingLog]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const logData = {
        ...formData,
        date: startOfDay(selectedDate)
      };

      await axios.post(`${API_BASE_URL}/logs`, logData);
      toast.success('Daily log saved successfully');
      onSave();
    } catch (error) {
      toast.error('Error saving daily log');
    } finally {
      setLoading(false);
    }
  };

  const addLinkedTopic = () => {
    setFormData({
      ...formData,
      linkedTopics: [...formData.linkedTopics, { topicId: '', subtopicName: '', questionsCount: 0 }]
    });
  };

  const updateLinkedTopic = (index, field, value) => {
    const updatedTopics = [...formData.linkedTopics];
    updatedTopics[index][field] = value;
    setFormData({ ...formData, linkedTopics: updatedTopics });
  };

  const removeLinkedTopic = (index) => {
    const updatedTopics = formData.linkedTopics.filter((_, i) => i !== index);
    setFormData({ ...formData, linkedTopics: updatedTopics });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Daily Log - {format(selectedDate, 'MMMM d, yyyy')}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Questions Solved
              </label>
              <input
                type="number"
                min="0"
                value={formData.questionsSolved}
                onChange={(e) => setFormData({ ...formData, questionsSolved: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Studied (minutes)
              </label>
              <input
                type="number"
                min="0"
                value={formData.timeStudied}
                onChange={(e) => setFormData({ ...formData, timeStudied: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mood
            </label>
            <select
              value={formData.mood}
              onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select your mood</option>
              {moods.map(mood => (
                <option key={mood} value={mood}>{mood}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Any notes about today's learning..."
            />
          </div>

          {/* Linked Topics */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Topics Studied
              </label>
              <button
                type="button"
                onClick={addLinkedTopic}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                + Add Topic
              </button>
            </div>

            {formData.linkedTopics.map((linkedTopic, index) => (
              <div key={index} className="grid grid-cols-2 gap-2 mb-2 p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                <select
                  value={linkedTopic.topicId}
                  onChange={(e) => updateLinkedTopic(index, 'topicId', e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select topic</option>
                  {topics.map(topic => (
                    <option key={topic._id} value={topic._id}>{topic.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min="0"
                  placeholder="Questions count"
                  value={linkedTopic.questionsCount}
                  onChange={(e) => updateLinkedTopic(index, 'questionsCount', parseInt(e.target.value) || 0)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => removeLinkedTopic(index)}
                  className="col-span-2 text-red-600 dark:text-red-400 hover:underline text-sm"
                >
                  Remove Topic
                </button>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <span>Save Log</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DailyLog;