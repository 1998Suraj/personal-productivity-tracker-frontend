import React, { useState } from 'react';
import { Upload, FileText, Download, BookOpen, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'https://personal-productivity-tracker-backend.onrender.com/api';

const PDFUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedTopics, setExtractedTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);

  const handleFileUpload = async (file) => {
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file only');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await axios.post(`${API_BASE_URL}/pdf/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setUploadedFile(response.data);
      setExtractedTopics(response.data.potentialTopics || []);
      toast.success('PDF uploaded and processed successfully');
    } catch (error) {
      toast.error('Error uploading PDF. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const toggleTopicSelection = (index) => {
    if (selectedTopics.includes(index)) {
      setSelectedTopics(selectedTopics.filter(i => i !== index));
    } else {
      setSelectedTopics([...selectedTopics, index]);
    }
  };

  const createTopicsFromPDF = async () => {
    if (selectedTopics.length === 0) {
      toast.error('Please select at least one topic to create');
      return;
    }

    try {
      const topicsToCreate = selectedTopics.map(index => ({
        name: extractedTopics[index],
        category: 'DSA', // Default to DSA, user can edit later
        description: `Extracted from PDF: ${uploadedFile.originalName}`,
        status: 'Not Started',
        associatedTags: ['PDF', 'DSA']
      }));

      for (const topic of topicsToCreate) {
        await axios.post(`${API_BASE_URL}/topics`, topic);
      }

      toast.success(`Created ${topicsToCreate.length} topics successfully`);
      setSelectedTopics([]);
    } catch (error) {
      toast.error('Error creating topics');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">PDF Upload</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Upload your DSA learning materials and extract topics automatically
        </p>
      </div>

      {/* Upload Area */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center transition-colors hover:border-blue-500 dark:hover:border-blue-400"
        >
          {uploading ? (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-400">Processing your PDF...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Drop your PDF file here or click to browse
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Maximum file size: 10MB. Only PDF files are supported.
                </p>
              </div>
              <label className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Choose File
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {/* File Info */}
      {uploadedFile && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Uploaded File
          </h2>
          
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <h3 className="font-medium text-green-900 dark:text-green-300">
                  {uploadedFile.originalName}
                </h3>
                <p className="text-sm text-green-700 dark:text-green-400">
                  Size: {Math.round(uploadedFile.size / 1024)} KB
                </p>
              </div>
            </div>
          </div>

          {/* PDF Preview */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Content Preview</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {uploadedFile.extractedText}
              {uploadedFile.extractedText.length >= 1000 && (
                <span className="text-blue-600 dark:text-blue-400"> ...and more</span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Extracted Topics */}
      {extractedTopics.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Extracted Topics ({extractedTopics.length})
          </h2>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Select topics you want to add to your learning plan:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {extractedTopics.map((topic, index) => (
              <div
                key={index}
                onClick={() => toggleTopicSelection(index)}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedTopics.includes(index)
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {topic}
                  </span>
                  {selectedTopics.includes(index) && (
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {selectedTopics.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                  {selectedTopics.length} topics selected
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  These will be added as DSA topics that you can edit later
                </p>
              </div>
              <button
                onClick={createTopicsFromPDF}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Create Topics</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          How PDF Processing Works
        </h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>• <strong>Upload:</strong> Drop your DSA learning PDF (study guides, problem lists, etc.)</p>
          <p>• <strong>Processing:</strong> Our system extracts potential topics and subtopics from the content</p>
          <p>• <strong>Review:</strong> Select which extracted topics you want to add to your learning plan</p>
          <p>• <strong>Create:</strong> Topics are added as DSA items that you can customize and track</p>
        </div>
        
        <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <strong>Tip:</strong> For best results, use PDFs with clear headings and structured content. 
            The system looks for numbered lists, bullet points, and capitalized headers to identify topics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PDFUploader;