import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, BookOpen, Clock, CheckCircle2, Circle, Play } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'https://personal-productivity-tracker-backend.onrender.com/api';

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);

  const categories = ['DSA', 'System Design', 'Design Patterns', 'Generative AI', 'Agentic AI'];
  const statuses = ['Not Started', 'In Progress', 'Completed'];
  const priorities = ['Low', 'Medium', 'High'];

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    filterTopics();
  }, [topics, searchTerm, filterCategory, filterStatus]);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/topics`);
      setTopics(response.data);
    } catch (error) {
      toast.error('Error fetching topics');
    } finally {
      setLoading(false);
    }
  };

  const filterTopics = () => {
    let filtered = topics;

    if (searchTerm) {
      filtered = filtered.filter(topic =>
        topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.associatedTags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterCategory) {
      filtered = filtered.filter(topic => topic.category === filterCategory);
    }

    if (filterStatus) {
      filtered = filtered.filter(topic => topic.status === filterStatus);
    }

    setFilteredTopics(filtered);
  };

  const handleAddTopic = () => {
    setEditingTopic(null);
    setShowAddModal(true);
  };

  const handleEditTopic = (topic) => {
    setEditingTopic(topic);
    setShowAddModal(true);
  };

  const handleDeleteTopic = async (topicId) => {
    if (window.confirm('Are you sure you want to delete this topic?')) {
      try {
        await axios.delete(`${API_BASE_URL}/topics/${topicId}`);
        toast.success('Topic deleted successfully');
        fetchTopics();
      } catch (error) {
        toast.error('Error deleting topic');
      }
    }
  };

  const StatusIcon = ({ status }) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'In Progress':
        return <Play className="w-5 h-5 text-yellow-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'DSA': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      'System Design': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      'Design Patterns': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      'Generative AI': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      'Agentic AI': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Topics</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your learning topics and track progress</p>
        </div>
        <button
          onClick={handleAddTopic}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <Plus className="w-5 h-5" />
          <span>Add Topic</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Topics
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Search by name, description, or tags..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      {filteredTopics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map(topic => (
            <div
              key={topic._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer border border-gray-100 dark:border-gray-700"
              onClick={() => handleEditTopic(topic)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <StatusIcon status={topic.status} />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {topic.name}
                  </h3>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(topic.priority)}`}>
                  {topic.priority}
                </span>
              </div>

              {/* Category & Status */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(topic.category)}`}>
                  {topic.category}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  topic.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                  topic.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {topic.status}
                </span>
              </div>

              {/* Description */}
              {topic.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                  {topic.description}
                </p>
              )}

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{topic.progress || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${topic.progress || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Subtopics count */}
              {topic.subtopics && topic.subtopics.length > 0 && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <BookOpen className="w-4 h-4 mr-1" />
                  <span>{topic.subtopics.length} subtopics</span>
                </div>
              )}

              {/* Tags */}
              {topic.associatedTags && topic.associatedTags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {topic.associatedTags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {topic.associatedTags.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                      +{topic.associatedTags.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">
            No topics found
          </h3>
          <p className="text-gray-500 dark:text-gray-500 mb-6">
            {searchTerm || filterCategory || filterStatus
              ? 'Try adjusting your search or filters'
              : 'Start by adding your first learning topic'}
          </p>
          <button
            onClick={handleAddTopic}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Add Your First Topic</span>
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <TopicModal
          topic={editingTopic}
          onClose={() => setShowAddModal(false)}
          onSave={fetchTopics}
        />
      )}
    </div>
  );
};

// Topic Modal Component
const TopicModal = ({ topic, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'DSA',
    priority: 'Medium',
    status: 'Not Started',
    associatedTags: [],
    subtopics: [],
    resources: []
  });
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const categories = ['DSA', 'System Design', 'Design Patterns', 'Generative AI', 'Agentic AI'];
  const priorities = ['Low', 'Medium', 'High'];
  const statuses = ['Not Started', 'In Progress', 'Completed'];

  useEffect(() => {
    if (topic) {
      setFormData({
        name: topic.name || '',
        description: topic.description || '',
        category: topic.category || 'DSA',
        priority: topic.priority || 'Medium',
        status: topic.status || 'Not Started',
        associatedTags: topic.associatedTags || [],
        subtopics: topic.subtopics || [],
        resources: topic.resources || []
      });
    }
  }, [topic]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = topic
        ? `${API_BASE_URL}/topics/${topic._id}`
        : `${API_BASE_URL}/topics`;
      const method = topic ? 'put' : 'post';

      await axios[method](url, formData);
      toast.success(`Topic ${topic ? 'updated' : 'created'} successfully`);
      onSave();
      onClose();
    } catch (error) {
      toast.error(`Error ${topic ? 'updating' : 'creating'} topic`);
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.associatedTags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        associatedTags: [...formData.associatedTags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      associatedTags: formData.associatedTags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {topic ? 'Edit Topic' : 'Add New Topic'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Topic Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter topic name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Describe what this topic covers..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {priorities.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.associatedTags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm flex items-center space-x-1"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Add a tag..."
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add
              </button>
            </div>
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
                <span>{topic ? 'Update' : 'Create'} Topic</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Topics;