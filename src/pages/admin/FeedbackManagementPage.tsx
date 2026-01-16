import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  Star,
  BookOpen,
  User,
  Calendar,
  AlertCircle,
  BarChart3,
} from 'lucide-react';
import DashboardLayout from '../../components/common/Layout/DashboardLayout';
import axiosInstance from '../../services/api/axios.config';
import toast from 'react-hot-toast';

interface Feedback {
  id: string;
  rating: number;
  comment: string;
  sentiment: string | null;
  feedbackDate: string;
  student: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
  module: {
    moduleCode: string;
    moduleName: string;
  };
}

const FeedbackManagementPage: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modules, setModules] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    moduleId: '',
    rating: '',
  });

  useEffect(() => {
    fetchFeedbacks();
  }, [currentPage, filters]);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(filters.moduleId && { moduleId: filters.moduleId }),
        ...(filters.rating && { rating: filters.rating }),
      });

      const response = await axiosInstance.get(`/feedback?${params}`);
      setFeedbacks(response.data.data.feedbacks);
      setTotalPages(response.data.data.pagination.pages);
    } catch (error) {
      toast.error('Failed to fetch feedbacks');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async () => {
    try {
      const response = await axiosInstance.get('/modules/dropdown');
      setModules(response.data.data.modules);
    } catch (error) {
      console.error('Failed to fetch modules:', error);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
    setCurrentPage(1);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredFeedbacks = feedbacks.filter(
    (f) =>
      f.student.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.student.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.module.moduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.module.moduleCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Feedback Management</h1>
          <p className="text-gray-600 mt-1">Review student feedback across all modules.</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search feedback..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              value={filters.moduleId}
              onChange={(e) => handleFilterChange('moduleId', e.target.value)}
            >
              <option value="">All Modules</option>
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.moduleCode} - {m.moduleName}
                </option>
              ))}
            </select>

            <select
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              value={filters.rating}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        {/* Feedback List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredFeedbacks.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No feedback found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Module</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Feedback</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredFeedbacks.map((f) => (
                      <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs mr-3">
                              {f.student.user.firstName.charAt(0)}{f.student.user.lastName.charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {f.student.user.firstName} {f.student.user.lastName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{f.module.moduleCode}</div>
                          <div className="text-xs text-gray-500">{f.module.moduleName}</div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-700 line-clamp-2 max-w-md italic">"{f.comment}"</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded text-yellow-700 w-fit">
                            <Star className="w-3 h-3 fill-yellow-400 mr-1" />
                            <span className="text-xs font-bold">{f.rating}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(f.feedbackDate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded hover:bg-white disabled:opacity-50 text-sm font-medium transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-300 rounded hover:bg-white disabled:opacity-50 text-sm font-medium transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FeedbackManagementPage;
