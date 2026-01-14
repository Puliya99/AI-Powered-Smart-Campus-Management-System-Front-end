import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, BarChart2, ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import axiosInstance from '../../services/api/axios.config';
import DashboardLayout from '../../components/common/Layout/DashboardLayout';

interface Attempt {
  id: string;
  student: {
    user: {
      firstName: string;
      lastName: string;
      registrationNumber: string;
    };
  };
  score: number;
  submittedTime: string;
  status: string;
  reason?: string;
}

const QuizResultsSummaryPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [quizId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const quizRes = await axiosInstance.get(`/quizzes/${quizId}`);
      setQuiz(quizRes.data.data.quiz);

      const attemptsRes = await axiosInstance.get(`/quizzes/${quizId}/attempts`);
      setAttempts(attemptsRes.data.data.attempts);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!quiz) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link to={`/lecturer/modules/${quiz.module.id}/quizzes`} className="flex items-center text-gray-500 hover:text-primary-600">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Quizzes
          </Link>
          <h1 className="text-2xl font-bold">Quiz Performance</h1>
          <div className="w-10"></div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm font-medium">Total Attempts</span>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{attempts.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm font-medium">Average Score</span>
              <BarChart2 className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {attempts.length > 0 
                ? (attempts.reduce((acc, curr) => acc + Number(curr.score), 0) / attempts.length).toFixed(1)
                : '0'}
              <span className="text-sm text-gray-400 font-normal"> / {quiz.totalMarks}</span>
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm font-medium">Quiz Title</span>
              <CheckCircle className="h-5 w-5 text-primary-500" />
            </div>
            <p className="text-lg font-bold text-gray-900 truncate">{quiz.title}</p>
          </div>
        </div>

        {/* Attempts Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-900">Student Results</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-3">Student</th>
                  <th className="px-6 py-3">Reg. Number</th>
                  <th className="px-6 py-3">Score</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Submitted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {attempts.map((attempt) => {
                  const percentage = (attempt.score / quiz.totalMarks) * 100;
                  return (
                    <tr key={attempt.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {attempt.student.user.firstName} {attempt.student.user.lastName}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {attempt.student.user.registrationNumber}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-primary-600">{attempt.score}</span> / {quiz.totalMarks}
                      </td>
                      <td className="px-6 py-4">
                        {attempt.status === 'CANCELLED' ? (
                          <div className="flex flex-col">
                            <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700 w-fit">
                              CANCELLED
                            </span>
                            <span className="text-[10px] text-red-500 mt-1 max-w-[150px] truncate" title={attempt.reason}>
                              {attempt.reason}
                            </span>
                          </div>
                        ) : (
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${percentage >= 50 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {percentage.toFixed(1)}%
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(attempt.submittedTime).toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {attempts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No attempts recorded for this quiz yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default QuizResultsSummaryPage;
