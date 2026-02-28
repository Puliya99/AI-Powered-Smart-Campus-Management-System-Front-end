import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Star,
  Send,
  CheckCircle,
  AlertCircle,
  Filter,
  Calendar,
  BookOpen,
} from 'lucide-react';
import DashboardLayout from '../../components/common/Layout/DashboardLayout';
import axiosInstance from '../../services/api/axios.config';
import toast from 'react-hot-toast';

interface Feedback {
  id: string;
  rating: number;
  comment: string;
  feedbackDate: string;
  module: {
    id: string;
    moduleCode: string;
    moduleName: string;
  };
}

interface Course {
  id: string;
  moduleCode: string;
  moduleName: string;
}

const StudentFeedbackPage: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    moduleId: '',
    rating: 0,
    comment: '',
  });
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    fetchFeedbacks();
    fetchCourses();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/feedback/my-feedbacks');
      setFeedbacks(response.data.data.feedbacks);
    } catch (error) {
      toast.error('Failed to fetch your feedbacks');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.get('/students/my-courses');
      setCourses(response.data.data.courses);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedback.moduleId || newFeedback.rating === 0 || !newFeedback.comment.trim()) {
      toast.error('Please fill in all fields and provide a rating');
      return;
    }

    try {
      setSubmitting(true);
      await axiosInstance.post('/feedback', newFeedback);
      toast.success('Feedback submitted successfully');
      setNewFeedback({ moduleId: '', rating: 0, comment: '' });
      fetchFeedbacks();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Module Feedback</h1>
          <p className="text-gray-600 mt-1">Share your thoughts on the modules you've completed.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Submit Feedback Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Send className="w-5 h-5 mr-2 text-primary-600" />
                Give New Feedback
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Module</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    value={newFeedback.moduleId}
                    onChange={(e) => setNewFeedback({ ...newFeedback, moduleId: e.target.value })}
                    required
                  >
                    <option value="">Choose a module...</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.moduleCode} - {course.moduleName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="p-1 focus:outline-none transition-transform hover:scale-110"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setNewFeedback({ ...newFeedback, rating: star })}
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= (hoverRating || newFeedback.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Comments</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                    rows={4}
                    placeholder="How was the module? What did you like or dislike?"
                    value={newFeedback.comment}
                    onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 font-medium shadow-sm"
                >
                  {submitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            </div>
          </div>

          {/* Feedback History */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-primary-600" />
              Your Feedback History
            </h2>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-12 text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">You haven't provided any feedback yet.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {feedbacks.map((feedback) => (
                  <div key={feedback.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-primary-100 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <BookOpen className="w-4 h-4 text-primary-500" />
                          <h3 className="font-semibold text-gray-900">
                            {feedback.module.moduleCode}: {feedback.module.moduleName}
                          </h3>
                        </div>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(feedback.feedbackDate)}
                        </div>
                      </div>
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded text-yellow-700">
                        <Star className="w-4 h-4 fill-yellow-400 mr-1" />
                        <span className="font-bold">{feedback.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed italic border-l-4 border-gray-100 pl-4">
                      "{feedback.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentFeedbackPage;
