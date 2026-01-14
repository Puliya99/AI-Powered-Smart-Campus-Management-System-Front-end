import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Plus,
  Trash2,
  Play,
  CheckCircle,
  Clock,
  ArrowLeft,
  ChevronDown,
  Layout,
  BarChart2,
  Edit,
  MoreVertical,
} from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../services/api/axios.config';
import DashboardLayout from '../../components/common/Layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

interface Quiz {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  totalMarks: number;
  isPublished: boolean;
  createdAt: string;
}

interface Module {
  id: string;
  moduleCode: string;
  moduleName: string;
}

const LecturerQuizzesPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [module, setModule] = useState<Module | null>(null);
  const [availableModules, setAvailableModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailableModules();
  }, []);

  useEffect(() => {
    if (moduleId) {
      fetchModule();
      fetchQuizzes();
    } else {
      setLoading(false);
    }
  }, [moduleId]);

  const fetchAvailableModules = async () => {
    try {
      const response = await axiosInstance.get('/lecturers/profile/me');
      setAvailableModules(response.data.data.lecturer.modules || []);
    } catch (error) {
      console.error('Failed to fetch modules:', error);
    }
  };

  const fetchModule = async () => {
    try {
      const response = await axiosInstance.get(`/modules/${moduleId}`);
      setModule(response.data.data.module);
    } catch (error) {
      console.error('Failed to fetch module details:', error);
    }
  };

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/quizzes/module/${moduleId}`);
      setQuizzes(response.data.data.quizzes);
    } catch (error) {
      toast.error('Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await axiosInstance.put(`/quizzes/${id}/publish`);
      toast.success('Quiz published!');
      fetchQuizzes();
    } catch (error) {
      toast.error('Failed to publish quiz');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this quiz? All attempts and results will be permanently removed.')) return;

    try {
      await axiosInstance.delete(`/quizzes/${id}`);
      toast.success('Quiz deleted successfully');
      setQuizzes(prev => prev.filter(q => q.id !== id));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete quiz');
    }
  };

  const handleModuleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    if (newId) navigate(`/lecturer/modules/${newId}/quizzes`);
  };

  if (!moduleId) {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
          <Layout className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-4">Select a Module</h2>
          <select
            onChange={handleModuleChange}
            className="block w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            defaultValue=""
          >
            <option value="" disabled>Choose a module...</option>
            {availableModules.map(m => (
              <option key={m.id} value={m.id}>{m.moduleCode} - {m.moduleName}</option>
            ))}
          </select>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Link to="/lecturer/classes" className="text-sm text-gray-500 hover:text-primary-600 flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Link>
              <span className="text-gray-300">|</span>
              <span className="text-sm font-medium text-primary-600">{module?.moduleCode}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Module Quizzes</h1>
            <p className="text-gray-600">Create and manage assessments for your students.</p>
          </div>
          <Link
            to={`/lecturer/modules/${moduleId}/quizzes/create`}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Quiz
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : quizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-primary-50 rounded-lg">
                      <FileText className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="flex items-center space-x-2">
                      {quiz.isPublished ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">PUBLISHED</span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">DRAFT</span>
                      )}
                      <div className="relative group/menu">
                        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10 overflow-hidden">
                          <button
                            onClick={() => navigate(`/lecturer/quizzes/${quiz.id}/edit`)}
                            className="w-full px-4 py-2 text-left text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center"
                          >
                            <Edit className="h-3.5 w-3.5 mr-2" />
                            Edit Quiz
                          </button>
                          <button
                            onClick={() => handleDelete(quiz.id)}
                            className="w-full px-4 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 flex items-center border-t border-gray-100"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-2" />
                            Delete Quiz
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{quiz.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{quiz.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      {quiz.durationMinutes} mins
                    </div>
                    <div className="flex items-center">
                      <BarChart2 className="h-4 w-4 mr-2 text-gray-400" />
                      {quiz.totalMarks} marks
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-5 py-3 border-t flex justify-between items-center">
                  {!quiz.isPublished && (
                    <button
                      onClick={() => handlePublish(quiz.id)}
                      className="text-sm font-bold text-green-600 hover:text-green-700"
                    >
                      Publish Now
                    </button>
                  )}
                  <Link
                    to={`/lecturer/quizzes/${quiz.id}/results`}
                    className="text-sm font-bold text-primary-600 hover:text-primary-700 ml-auto"
                  >
                    View Results
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <Layout className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No quizzes yet</h3>
            <p className="text-gray-500 mt-1">Start by creating your first assessment for this module.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LecturerQuizzesPage;
