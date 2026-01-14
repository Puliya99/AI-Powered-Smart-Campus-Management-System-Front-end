import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Send, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../services/api/axios.config';
import FaceDetectionCamera from '../../components/student/Quiz/FaceDetectionCamera';

interface Question {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  marks: number;
}

interface Quiz {
  id: string;
  title: string;
  durationMinutes: number;
  questions: Question[];
}

const QuizAttemptPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempt, setAttempt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    startQuiz();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizId]);

  const startQuiz = async () => {
    try {
      setLoading(true);
      // First get quiz details
      const quizResponse = await axiosInstance.get(`/quizzes/${quizId}`);
      setQuiz(quizResponse.data.data.quiz);

      // Then start attempt
      const attemptResponse = await axiosInstance.post(`/quizzes/${quizId}/start`);
      setAttempt(attemptResponse.data.data.attempt);

      // Set timer
      const duration = quizResponse.data.data.quiz.durationMinutes * 60;
      setTimeLeft(duration);
      
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            autoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to start quiz');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionId: string, option: string) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleViolation = async (type: string, details?: string) => {
    if (submitting || isCancelled) return;

    const shouldCancel = type === 'CAMERA_DISABLED' || (type === 'NO_FACE' && details?.includes('10 seconds')) || type === 'MULTIPLE_FACES';

    try {
      const response = await axiosInstance.post(`/quizzes/attempts/${attempt.id}/violations`, {
        violationType: type,
        details,
        shouldCancel
      });

      if (response.data.data.cancelled) {
        setIsCancelled(true);
        if (timerRef.current) clearInterval(timerRef.current);
        toast.error(`Exam Cancelled: ${details || type}`, { duration: 5000 });
      }
    } catch (error) {
      console.error('Failed to report violation:', error);
    }
  };

  const autoSubmit = () => {
    toast.error('Time is up! Auto-submitting your answers...');
    submitQuiz();
  };

  const submitQuiz = async () => {
    if (submitting) return;
    setSubmitting(true);
    
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
      }));

      const response = await axiosInstance.post(`/quizzes/attempts/${attempt.id}/submit`, {
        answers: formattedAnswers,
      });

      toast.success('Quiz submitted successfully!');
      navigate(`/student/quizzes/attempts/${attempt.id}/result`);
    } catch (error) {
      toast.error('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Preparing your quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) return null;

  if (isCancelled) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-red-100 p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Attempt Cancelled</h1>
          <p className="text-gray-600 mb-8">
            Your quiz attempt has been automatically cancelled due to a security violation. This incident has been logged and reported to your lecturer.
          </p>
          <button
            onClick={() => navigate('/student/quizzes')}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-lg font-bold text-gray-900">{quiz.title}</h1>
          <p className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
        </div>
        
        <div className={`flex items-center px-4 py-2 rounded-lg font-mono text-lg font-bold ${timeLeft < 60 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-primary-50 text-primary-700'}`}>
          <Clock className="h-5 w-5 mr-2" />
          {formatTime(timeLeft)}
        </div>

        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to submit?')) submitQuiz();
          }}
          disabled={submitting}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-700 transition flex items-center"
        >
          <Send className="h-4 w-4 mr-2" />
          {submitting ? 'Submitting...' : 'Finish'}
        </button>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Progress Bar */}
          <div className="h-1.5 bg-gray-100 w-full">
            <div 
              className="h-full bg-primary-600 transition-all duration-300" 
              style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>

          <div className="p-8">
            <h2 className="text-xl font-medium text-gray-900 mb-8">
              {currentQuestion.questionText}
            </h2>

            <div className="space-y-4">
              {['A', 'B', 'C', 'D'].map((opt) => {
                const optionKey = `option${opt}` as keyof Question;
                const optionText = currentQuestion[optionKey];
                if (!optionText) return null;

                const isSelected = answers[currentQuestion.id] === opt;

                return (
                  <button
                    key={opt}
                    onClick={() => handleOptionSelect(currentQuestion.id, opt)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center group ${
                      isSelected 
                        ? 'border-primary-600 bg-primary-50 text-primary-900' 
                        : 'border-gray-100 hover:border-gray-300 bg-white text-gray-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-4 font-bold ${
                      isSelected ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                    }`}>
                      {opt}
                    </div>
                    <span className="font-medium">{optionText as string}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-50 px-8 py-4 flex justify-between items-center border-t">
            <button
              onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              disabled={currentQuestionIndex === 0}
              className="flex items-center text-gray-600 font-bold disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Previous
            </button>
            <button
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
              disabled={currentQuestionIndex === quiz.questions.length - 1}
              className="flex items-center text-primary-600 font-bold disabled:opacity-30"
            >
              Next
              <ChevronRight className="h-5 w-5 ml-1" />
            </button>
          </div>
        </div>

        {/* Question Navigator */}
        <div className="mt-8 grid grid-cols-10 gap-2">
          {quiz.questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(idx)}
              className={`h-10 rounded-lg flex items-center justify-center font-bold text-sm transition ${
                currentQuestionIndex === idx 
                  ? 'bg-primary-600 text-white shadow-md transform scale-110' 
                  : answers[q.id] 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-white text-gray-400 border border-gray-200'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </main>

      {/* Face Detection Camera */}
      <FaceDetectionCamera 
        isActive={!submitting && !isCancelled && !!attempt} 
        onViolation={handleViolation} 
      />
    </div>
  );
};

export default QuizAttemptPage;
