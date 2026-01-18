import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Send, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, Camera, CameraOff } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
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
  module?: { id: string };
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
  const [isFinished, setIsFinished] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [violationWarning, setViolationWarning] = useState<{ message: string; countdown: number } | null>(null);

  const timerRef = useRef<NodeJS.Timeout>();
  const warningTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    startQuiz();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (warningTimerRef.current) clearInterval(warningTimerRef.current);
    };
  }, [quizId]);

  const startQuiz = async () => {
    try {
      setLoading(true);
      // First get quiz details
      const quizResponse = await axiosInstance.get(`/quizzes/${quizId}`);
      const quizData = quizResponse.data.data.quiz;
      setQuiz(quizData);

      // Then start attempt
      const attemptResponse = await axiosInstance.post(`/quizzes/${quizId}/start`);
      const attemptData = attemptResponse.data.data.attempt;
      setAttempt(attemptData);

      // Restore existing answers if any
      if (attemptData.answers && attemptData.answers.length > 0) {
        const existingAnswers: Record<string, string> = {};
        attemptData.answers.forEach((ans: any) => {
          if (ans.question && ans.selectedOption) {
            existingAnswers[ans.question.id] = ans.selectedOption;
          }
        });
        setAnswers(existingAnswers);
      }

      // Set timer based on start time and duration
      const startTime = new Date(attemptData.startTime).getTime();
      const now = new Date().getTime();
      const elapsedSeconds = Math.floor((now - startTime) / 1000);
      const totalDurationSeconds = quizData.durationMinutes * 60;
      const remainingSeconds = Math.max(0, totalDurationSeconds - elapsedSeconds);

      setTimeLeft(remainingSeconds);
      
      if (remainingSeconds <= 0) {
        autoSubmit();
        return;
      }
      
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

  const handleViolation = async (type: string, details?: string, shouldCancel = false) => {
    if (submitting || isCancelled || isFinished || !attempt) return;

    if (type === 'NONE') {
      setViolationWarning(null);
      if (warningTimerRef.current) clearInterval(warningTimerRef.current);
      return;
    }

    // If it's just a warning (shouldCancel is false), show local countdown
    if (!shouldCancel) {
      if (warningTimerRef.current) clearInterval(warningTimerRef.current);
      
      let message = "Security violation detected!";
      if (type === 'NO_FACE') message = "Face not detected!";
      else if (type === 'MULTIPLE_FACES') message = "Multiple faces detected!";
      else if (type === 'CAMERA_DISABLED') message = "Camera is OFF!";

      setViolationWarning({ message, countdown: 10 });
      
      warningTimerRef.current = setInterval(() => {
        setViolationWarning(prev => {
          if (!prev || prev.countdown <= 1) {
            clearInterval(warningTimerRef.current);
            return null;
          }
          return { ...prev, countdown: prev.countdown - 1 };
        });
      }, 1000);
    } else {
      // Clear warning if we are cancelling
      setViolationWarning(null);
      if (warningTimerRef.current) clearInterval(warningTimerRef.current);
    }

    try {
      const response = await axiosInstance.post(`/quizzes/attempts/${attempt.id}/violations`, {
        violationType: type,
        details,
        shouldCancel
      });

      const { cancelled, warning, message } = response.data.data;

      if (cancelled) {
        setIsCancelled(true);
        if (timerRef.current) clearInterval(timerRef.current);
        toast.error(`Exam Cancelled: ${message || details || type}`, { duration: 10000 });
      } else if (warning) {
        // We already show our custom overlay, but toast is good too
        toast.error(message, { duration: 4000 });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        if (message === 'Attempt is already finished') {
          setIsFinished(true);
          setViolationWarning(null);
          if (warningTimerRef.current) clearInterval(warningTimerRef.current);
          return;
        }
      }
      console.error('Failed to report violation:', error);
    }
  };

  // Clear warning when correction is detected (FaceDetectionCamera resets count)
  // Actually FaceDetectionCamera doesn't tell us when it's corrected, 
  // but it stops calling handleViolation. 
  // We can add a "CLEAR_VIOLATION" or just detect it in FaceDetectionCamera.
  // Let's refine FaceDetectionCamera to call onViolation with type 'NONE' when corrected.

  const autoSubmit = () => {
    toast.error('Time is up! Auto-submitting your answers...');
    submitQuiz(true);
  };

  const submitQuiz = async (isFinal = false) => {
    if (submitting) return;
    setSubmitting(true);
    
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
      }));

      await axiosInstance.post(`/quizzes/attempts/${attempt.id}/submit`, {
        answers: formattedAnswers,
      });

      setIsFinished(true);

      if (isFinal) {
        toast.success('Quiz submitted successfully!');
        
        // If time is still remaining, don't show results yet, just go back to list
        if (timeLeft > 10) {
          toast('Results will be available once the quiz time is up.', { icon: 'ℹ️' });
          navigate(quiz?.module ? `/student/modules/${(quiz as any).module.id}/quizzes` : '/student/quizzes');
        } else {
          navigate(`/student/quizzes/attempts/${attempt.id}/result`);
        }
      } else {
        toast.success('Quiz progress saved!');
        navigate('/student/quizzes');
      }
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

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCameraOff(!isCameraOff)}
            className={`p-2 rounded-lg transition-colors ${
              isCameraOff 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
          >
            {isCameraOff ? <CameraOff className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
          </button>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to save and exit?')) submitQuiz();
            }}
            disabled={submitting}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-700 transition flex items-center"
          >
            <Send className="h-4 w-4 mr-2" />
            {submitting ? 'Saving...' : 'Save & Exit'}
          </button>
        </div>
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

      {/* Violation Overlay */}
      {violationWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-red-600 bg-opacity-90 animate-pulse">
          <div className="text-center text-white p-8">
            <AlertTriangle className="w-24 h-24 mx-auto mb-6 animate-bounce" />
            <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">
              {violationWarning.message}
            </h2>
            <p className="text-2xl font-bold mb-8">
              Correction required immediately!
            </p>
            <div className="text-6xl font-black bg-white text-red-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              {violationWarning.countdown}
            </div>
            <p className="mt-8 text-xl font-medium opacity-80">
              The quiz will be cancelled in {violationWarning.countdown} seconds.
            </p>
          </div>
        </div>
      )}

      {/* Face Detection Camera */}
      <FaceDetectionCamera 
        isActive={!submitting && !isCancelled && !isFinished && !!attempt} 
        onViolation={handleViolation} 
        isCameraOff={isCameraOff}
      />
    </div>
  );
};

export default QuizAttemptPage;
