import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Send, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, Camera, CameraOff, ShieldCheck, Eye, EyeOff, Smartphone, MonitorOff, Users, BookOpen, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import axiosInstance from '../../services/api/axios.config';
import FaceDetectionCamera from '../../components/student/Quiz/FaceDetectionCamera';
import FaceVerificationModal from '../../components/student/Quiz/FaceVerificationModal';
import LivenessChallenge from '../../components/student/Quiz/LivenessChallenge';

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
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [violationScore, setViolationScore] = useState(0);
  const [faceVerified, setFaceVerified] = useState(false);
  const [livenessPassed, setLivenessPassed] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);
  const [hasEnrolledFace, setHasEnrolledFace] = useState(false);
  const [preExamReady, setPreExamReady] = useState(false);
  const [cameraGranted, setCameraGranted] = useState(false);
  const [cameraCheckError, setCameraCheckError] = useState<string | null>(null);
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const preExamVideoRef = useRef<HTMLVideoElement>(null);
  const preExamStreamRef = useRef<MediaStream | null>(null);

  const timerRef = useRef<NodeJS.Timeout>();
  const warningTimerRef = useRef<NodeJS.Timeout>();

  // Check if the student has an enrolled face
  useEffect(() => {
    const checkFaceEnrollment = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const studentId = user.userId || user.id;
        if (!studentId) {
          setCheckingEnrollment(false);
          return;
        }
        const response = await axiosInstance.get(`/face/check/${studentId}`);
        const enrolled = response.data?.data?.enrolled === true;
        setHasEnrolledFace(enrolled);
        if (!enrolled) {
          setFaceVerified(true); // Skip verification if not enrolled
          setLivenessPassed(true);
        }
      } catch {
        // If check fails, skip verification
        setFaceVerified(true);
        setLivenessPassed(true);
      } finally {
        setCheckingEnrollment(false);
      }
    };
    checkFaceEnrollment();
  }, []);

  useEffect(() => {
    if (!faceVerified || !livenessPassed || !preExamReady) return; // Don't start quiz until all gates pass
    startQuiz();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (warningTimerRef.current) clearInterval(warningTimerRef.current);
    };
  }, [quizId, faceVerified, livenessPassed, preExamReady]);

  // Pre-exam camera check
  const requestCameraAccess = useCallback(async () => {
    setCameraCheckError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      });
      preExamStreamRef.current = stream;
      if (preExamVideoRef.current) {
        preExamVideoRef.current.srcObject = stream;
      }
      setCameraGranted(true);
    } catch {
      setCameraCheckError('Camera access was denied. You must allow camera access to take this exam. Please check your browser settings and try again.');
      setCameraGranted(false);
    }
  }, []);

  const stopPreExamCamera = useCallback(() => {
    if (preExamStreamRef.current) {
      preExamStreamRef.current.getTracks().forEach(t => t.stop());
      preExamStreamRef.current = null;
    }
    if (preExamVideoRef.current) {
      preExamVideoRef.current.srcObject = null;
    }
  }, []);

  const handleStartExam = useCallback(() => {
    stopPreExamCamera();
    setPreExamReady(true);
  }, [stopPreExamCamera]);

  // Cleanup pre-exam camera on unmount
  useEffect(() => {
    return () => stopPreExamCamera();
  }, [stopPreExamCamera]);

  // Tab Switch / Window Blur Detection
  useEffect(() => {
    if (submitting || isCancelled || isFinished || !attempt) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => {
          const newCount = prev + 1;
          // Auto-cancel after 3 tab switches
          const shouldCancel = newCount >= 3;
          handleViolation('TAB_SWITCH', `Tab switched (${newCount} time${newCount > 1 ? 's' : ''})`, shouldCancel);
          return newCount;
        });
      }
    };

    const handleWindowBlur = () => {
      if (!document.hidden) {
        // Window lost focus but tab didn't switch (e.g., clicked outside browser)
        setTabSwitchCount(prev => {
          const newCount = prev + 1;
          const shouldCancel = newCount >= 3;
          handleViolation('TAB_SWITCH', `Window lost focus (${newCount} time${newCount > 1 ? 's' : ''})`, shouldCancel);
          return newCount;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [submitting, isCancelled, isFinished, attempt]);

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

      // Set timer: account for time already spent in previous sessions (restarts)
      // plus time elapsed in the current session
      const previousTimeSpent = attemptData.timeSpentSeconds || 0;
      const sessionStart = new Date(attemptData.startTime).getTime();
      const now = Date.now();
      const currentSessionSeconds = Math.floor((now - sessionStart) / 1000);
      const totalElapsedSeconds = previousTimeSpent + currentSessionSeconds;
      const totalDurationSeconds = quizData.durationMinutes * 60;
      const remainingSeconds = Math.max(0, totalDurationSeconds - totalElapsedSeconds);

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
      else if (type === 'TAB_SWITCH') message = "Tab switch detected!";
      else if (type === 'CHEATING_OBJECT') message = "Suspicious object detected!";
      else if (type === 'LOOKING_AWAY') message = "Looking away from screen!";
      else if (type === 'HEAD_POSE') message = "Suspicious head movement!";

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

      const { cancelled, warning, message, totalScore } = response.data.data;

      if (totalScore !== undefined) {
        setViolationScore(totalScore);
      }

      if (cancelled) {
        setIsCancelled(true);
        if (timerRef.current) clearInterval(timerRef.current);
        toast.error(`Exam Auto-Submitted: ${message || details || type}`, { duration: 10000 });
      } else if (warning) {
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

  if (checkingEnrollment) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Checking identity requirements...</p>
        </div>
      </div>
    );
  }

  if (hasEnrolledFace && !faceVerified) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return (
      <FaceVerificationModal
        studentId={user.userId || user.id}
        onVerified={() => setFaceVerified(true)}
        onSkip={() => navigate(-1)}
      />
    );
  }

  if (hasEnrolledFace && faceVerified && !livenessPassed) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return (
      <LivenessChallenge
        studentId={user.userId || user.id}
        onPassed={() => setLivenessPassed(true)}
        onFailed={() => navigate(-1)}
      />
    );
  }

  if (!preExamReady) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-primary-600 text-white px-6 py-5">
            <h1 className="text-xl font-bold flex items-center">
              <ShieldCheck className="h-6 w-6 mr-2" />
              Exam Rules & Camera Check
            </h1>
            <p className="text-primary-100 text-sm mt-1">Please read carefully before starting</p>
          </div>

          <div className="p-6">
            {/* Camera Check Section */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                <Camera className="h-5 w-5 mr-2 text-primary-600" />
                Camera Access Required
              </h2>

              {!cameraGranted ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                  <CameraOff className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                  <p className="text-yellow-800 font-medium mb-1">Camera is not active</p>
                  <p className="text-yellow-600 text-sm mb-4">
                    You must turn on your camera before you can start the exam. Your camera will be used to monitor the exam session.
                  </p>
                  {cameraCheckError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm text-left">
                      <div className="flex items-start">
                        <XCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        {cameraCheckError}
                      </div>
                    </div>
                  )}
                  <button
                    onClick={requestCameraAccess}
                    className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-700 transition inline-flex items-center"
                  >
                    <Camera className="h-5 w-5 mr-2" />
                    Turn On Camera
                  </button>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-green-700">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="font-bold">Camera is active</span>
                    </div>
                  </div>
                  <div className="w-full aspect-[16/9] max-h-48 bg-gray-900 rounded-lg overflow-hidden">
                    <video
                      ref={preExamVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Exam Rules Section */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-primary-600" />
                Exam Rules
              </h2>
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  This exam is AI-proctored. The following actions are <strong>strictly prohibited</strong> and will be recorded as violations:
                </p>
                <div className="space-y-2.5">
                  <div className="flex items-start text-sm">
                    <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <CameraOff className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">Do not turn off your camera</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">Your camera must remain on throughout the entire exam.</p>
                    </div>
                  </div>
                  <div className="flex items-start text-sm">
                    <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <EyeOff className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">Do not look away from the screen</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">Keep your eyes focused on the exam at all times.</p>
                    </div>
                  </div>
                  <div className="flex items-start text-sm">
                    <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <MonitorOff className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">Do not switch tabs or leave this window</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">Switching tabs or minimizing the browser will be recorded.</p>
                    </div>
                  </div>
                  <div className="flex items-start text-sm">
                    <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <Smartphone className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">Do not use phones, notes, or other devices</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">Any suspicious objects detected by the camera will be flagged.</p>
                    </div>
                  </div>
                  <div className="flex items-start text-sm">
                    <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <Users className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">Do not allow other people near you</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">Only your face should be visible in the camera.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-yellow-800 text-xs font-medium">
                    <AlertTriangle className="h-3.5 w-3.5 inline mr-1 -mt-0.5" />
                    Violations are scored automatically. If your violation score reaches <strong>5/5</strong>, your exam will be <strong>auto-submitted</strong> and your lecturer will be notified.
                  </p>
                </div>
              </div>
            </div>

            {/* Accept & Start */}
            <div className="space-y-3">
              <label className="flex items-start cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rulesAccepted}
                  onChange={(e) => setRulesAccepted(e.target.checked)}
                  className="mt-1 mr-3 h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                  I have read and understood the exam rules. I agree to be monitored by the AI proctoring system during this exam.
                </span>
              </label>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    stopPreExamCamera();
                    navigate(-1);
                  }}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  Go Back
                </button>
                <button
                  onClick={handleStartExam}
                  disabled={!cameraGranted || !rulesAccepted}
                  className="flex-1 bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <ShieldCheck className="h-5 w-5 mr-2" />
                  Start Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Preparing your quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) return null;

  if (isCancelled) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-red-100 dark:border-red-900 p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Exam Auto-Submitted</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your quiz attempt has been automatically submitted due to security violations exceeding the allowed threshold (Score: {violationScore}/5).
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            This incident has been logged and reported to your lecturer. Contact your lecturer if you believe this was an error.
          </p>
          <button
            onClick={() => navigate('/student/quizzes')}
            className="w-full bg-gray-900 dark:bg-gray-700 text-white py-3 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-600 transition"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">{quiz.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
        </div>

        <div className={`flex items-center px-4 py-2 rounded-lg font-mono text-lg font-bold ${timeLeft < 60 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-primary-50 text-primary-700'}`}>
          <Clock className="h-5 w-5 mr-2" />
          {formatTime(timeLeft)}
        </div>

        <div className="flex items-center space-x-3">
          {/* Violation Score Badge */}
          {violationScore > 0 && (
            <div className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-bold ${
              violationScore >= 4 ? 'bg-red-100 text-red-700 animate-pulse' :
              violationScore >= 2 ? 'bg-yellow-100 text-yellow-700' :
              'bg-orange-50 text-orange-600'
            }`}>
              <AlertTriangle className="h-4 w-4 mr-1" />
              {violationScore}/5
            </div>
          )}

          <button
            onClick={() => setIsCameraOff(!isCameraOff)}
            className={`p-2 rounded-lg transition-colors ${
              isCameraOff
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
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
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Progress Bar */}
          <div className="h-1.5 bg-gray-100 dark:bg-gray-700 w-full">
            <div
              className="h-full bg-primary-600 transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>

          <div className="p-8">
            <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-8">
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
                        : 'border-gray-100 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-4 font-bold ${
                      isSelected ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                    }`}>
                      {opt}
                    </div>
                    <span className="font-medium">{optionText as string}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 px-8 py-4 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              disabled={currentQuestionIndex === 0}
              className="flex items-center text-gray-600 dark:text-gray-400 font-bold disabled:opacity-30"
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
                    : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700'
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
            <p className="mt-4 text-lg font-bold opacity-90">
              Violation Score: {violationScore}/5
            </p>
            <p className="mt-4 text-xl font-medium opacity-80">
              The exam will be auto-submitted if violations continue.
            </p>
          </div>
        </div>
      )}

      {/* Face Detection Camera */}
      <FaceDetectionCamera
        isActive={!submitting && !isCancelled && !isFinished && !!attempt}
        onViolation={handleViolation}
        isCameraOff={isCameraOff}
        attemptId={attempt?.id}
      />
    </div>
  );
};

export default QuizAttemptPage;
