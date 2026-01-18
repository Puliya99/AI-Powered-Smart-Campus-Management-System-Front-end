import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Play,
  CheckCircle,
  Clock,
  ArrowLeft,
  Layout,
  BarChart2,
  ChevronDown,
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
  attemptStatus: 'IN_PROGRESS' | 'SUBMITTED' | 'TIMED_OUT' | 'CANCELLED' | null;
  attemptId: string | null;
}

interface Module {
  id: string;
  moduleCode: string;
  moduleName: string;
}

const StudentQuizzesPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
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
      const response = await axiosInstance.get('/dashboard/student');
      setAvailableModules(response.data.data.enrolledModules || []);
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

  const handleModuleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    if (newId) navigate(`/student/modules/${newId}/quizzes`);
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
              <Link to="/student/courses" className="text-sm text-gray-500 hover:text-primary-600 flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Link>
              <span className="text-gray-300">|</span>
              <span className="text-sm font-medium text-primary-600">{module?.moduleCode}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Available Quizzes</h1>
            <p className="text-gray-600">Complete your assessments to earn marks.</p>
          </div>
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
                
                <div className="bg-gray-50 px-5 py-3 border-t">
                  <div className="flex gap-2">
                    {(quiz.attemptStatus === 'SUBMITTED' || quiz.attemptStatus === 'TIMED_OUT' || quiz.attemptStatus === 'CANCELLED') && quiz.attemptId && (
                      <Link
                        to={`/student/quizzes/attempts/${quiz.attemptId}/result`}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {quiz.attemptStatus === 'CANCELLED' ? 'Violation Info' : 'Results'}
                      </Link>
                    )}
                    {quiz.attemptStatus !== 'SUBMITTED' && quiz.attemptStatus !== 'TIMED_OUT' && quiz.attemptStatus !== 'CANCELLED' && (
                      <Link
                        to={`/student/quizzes/${quiz.id}/attempt`}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-primary-600 text-white text-sm font-bold rounded-lg hover:bg-primary-700 transition"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {quiz.attemptStatus === 'IN_PROGRESS' ? 'Resume' : 'Start Quiz'}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
            <p className="text-gray-500 mt-1">No quizzes available for this module at the moment.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentQuizzesPage;
