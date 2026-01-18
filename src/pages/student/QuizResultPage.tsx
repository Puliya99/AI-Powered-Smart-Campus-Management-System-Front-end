import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, BarChart2, ArrowLeft, Layout, Clock } from 'lucide-react';
import axiosInstance from '../../services/api/axios.config';
import DashboardLayout from '../../components/common/Layout/DashboardLayout';

const QuizResultPage: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const [attempt, setAttempt] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResult();
  }, [attemptId]);

  const fetchResult = async () => {
    try {
      const response = await axiosInstance.get(`/quizzes/attempts/${attemptId}`);
      setAttempt(response.data.data.attempt);
    } catch (error) {
      console.error('Failed to fetch results:', error);
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

  if (!attempt || !attempt.quiz) return null;

  if (attempt.isResultsPending) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Link 
              to={attempt.quiz.module ? `/student/modules/${attempt.quiz.module.id}/quizzes` : '/student/quizzes'} 
              className="flex items-center text-gray-500 hover:text-primary-600"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Quizzes
            </Link>
            <h1 className="text-2xl font-bold">Results Pending</h1>
            <div className="w-10"></div>
          </div>

          <div className="bg-white p-12 rounded-2xl border border-gray-200 shadow-sm text-center space-y-6">
            <div className="inline-flex items-center justify-center p-6 bg-blue-50 rounded-full mb-2">
              <Clock className="h-16 w-16 text-primary-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{attempt.quiz.title}</h2>
              <p className="text-xl text-gray-600 font-medium">Your submission has been received!</p>
            </div>
            
            <div className="max-w-md mx-auto p-6 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-gray-700">
                To maintain academic integrity, results are only released once the allocated time for this quiz has expired for all students.
              </p>
            </div>

            <p className="text-gray-500">
              Please check back later to view your score and feedback.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (attempt.status === 'CANCELLED') {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Link 
              to={attempt.quiz.module ? `/student/modules/${attempt.quiz.module.id}/quizzes` : '/student/quizzes'} 
              className="flex items-center text-gray-500 hover:text-primary-600"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Quizzes
            </Link>
            <h1 className="text-2xl font-bold">Attempt Cancelled</h1>
            <div className="w-10"></div>
          </div>

          <div className="bg-white p-12 rounded-2xl border-2 border-red-100 shadow-sm text-center space-y-6">
            <div className="inline-flex items-center justify-center p-6 bg-red-50 rounded-full mb-2">
              <XCircle className="h-16 w-16 text-red-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{attempt.quiz.title}</h2>
              <p className="text-xl text-red-600 font-bold uppercase tracking-wide">Security Violation Detected</p>
            </div>
            
            <div className="max-w-md mx-auto p-6 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-gray-700 font-medium mb-2">Reason for cancellation:</p>
              <p className="text-red-700 italic">"{attempt.reason || 'Multiple security violations reported by AI monitoring system.'}"</p>
            </div>

            <p className="text-gray-500 max-w-lg mx-auto">
              If you believe this was an error, please contact your module lecturer to discuss a possible restart of your attempt.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const scorePercentage = attempt.quiz.totalMarks > 0 
    ? (attempt.score / attempt.quiz.totalMarks) * 100 
    : 0;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link 
            to={attempt.quiz.module ? `/student/modules/${attempt.quiz.module.id}/quizzes` : '/student/quizzes'} 
            className="flex items-center text-gray-500 hover:text-primary-600"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Quizzes
          </Link>
          <h1 className="text-2xl font-bold">Quiz Results</h1>
          <div className="w-10"></div>
        </div>

        {/* Score Card */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-primary-50 rounded-full mb-2">
            <BarChart2 className="h-10 w-10 text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{attempt.quiz.title}</h2>
          <div className="flex justify-center items-baseline space-x-2">
            <span className="text-5xl font-extrabold text-primary-600">{attempt.score}</span>
            <span className="text-2xl text-gray-400">/ {attempt.quiz.totalMarks}</span>
          </div>
          <p className="text-lg font-medium text-gray-600">
            Your Score: <span className={scorePercentage >= 50 ? 'text-green-600' : 'text-red-600'}>{scorePercentage.toFixed(1)}%</span>
          </p>
        </div>

        {/* Question Review */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Review Your Answers</h3>
          {attempt.answers.map((answer: any, index: number) => (
            <div key={answer.id} className={`p-6 rounded-xl border-2 bg-white ${answer.isCorrect ? 'border-green-100' : 'border-red-100'}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-bold text-gray-900 mb-4">{index + 1}. {answer.question.questionText}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {['A', 'B', 'C', 'D'].map((opt) => {
                      const optionKey = `option${opt}` as any;
                      const optionText = answer.question[optionKey];
                      if (!optionText) return null;

                      const isSelected = answer.selectedOption === opt;
                      const isCorrect = answer.question.correctOption === opt;

                      return (
                        <div 
                          key={opt}
                          className={`p-3 rounded-lg border flex items-center ${
                            isCorrect 
                              ? 'bg-green-50 border-green-200 text-green-800' 
                              : isSelected 
                                ? 'bg-red-50 border-red-200 text-red-800' 
                                : 'bg-gray-50 border-gray-100 text-gray-500'
                          }`}
                        >
                          <span className="font-bold mr-3">{opt}.</span>
                          <span className="flex-1">{optionText}</span>
                          {isCorrect && <CheckCircle className="h-4 w-4 ml-2" />}
                          {isSelected && !isCorrect && <XCircle className="h-4 w-4 ml-2" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className={`ml-4 p-2 rounded-lg ${answer.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  <span className="text-sm font-bold">{answer.isCorrect ? `+${answer.question.marks}` : '0'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default QuizResultPage;
