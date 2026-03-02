import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Eye, RotateCcw, ShieldCheck, ShieldAlert, RefreshCw } from 'lucide-react';
import axiosInstance from '../../../services/api/axios.config';

interface LivenessChallengeProps {
  onPassed: () => void;
  onFailed: () => void;
  studentId: string;
}

type ChallengeConfig = {
  type: 'BLINK' | 'HEAD_TURN';
  param: string;
  instruction: string;
  icon: React.ReactNode;
};

const CHALLENGES: ChallengeConfig[] = [
  { type: 'BLINK', param: '3', instruction: 'Blink 3 times', icon: <Eye className="h-8 w-8" /> },
  { type: 'HEAD_TURN', param: 'LEFT', instruction: 'Turn your head to the left', icon: <RotateCcw className="h-8 w-8" /> },
  { type: 'HEAD_TURN', param: 'RIGHT', instruction: 'Turn your head to the right', icon: <RotateCcw className="h-8 w-8 scale-x-[-1]" /> },
];

const MAX_RETRIES = 3;
const CAPTURE_DURATION_MS = 5000;
const CAPTURE_INTERVAL_MS = 250; // ~4fps

const LivenessChallenge: React.FC<LivenessChallengeProps> = ({ onPassed, onFailed, studentId }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [challenge, setChallenge] = useState<ChallengeConfig>(() =>
    CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)]
  );
  const [phase, setPhase] = useState<'ready' | 'capturing' | 'analyzing' | 'result'>('ready');
  const [result, setResult] = useState<{ passed: boolean; message: string } | null>(null);
  const [retries, setRetries] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [captureProgress, setCaptureProgress] = useState(0);
  const captureRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      if (captureRef.current) clearInterval(captureRef.current);
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraReady(true);
      }
    } catch {
      setError('Camera access denied.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraReady(false);
  };

  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current) return null;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
    return dataUrl.split(',')[1];
  }, []);

  const startCapture = () => {
    setPhase('capturing');
    setCaptureProgress(0);
    setError(null);
    setResult(null);

    const frames: { image: string; timestamp: number }[] = [];
    const startTime = Date.now();

    captureRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setCaptureProgress(Math.min(100, (elapsed / CAPTURE_DURATION_MS) * 100));

      if (elapsed >= CAPTURE_DURATION_MS) {
        if (captureRef.current) clearInterval(captureRef.current);
        setCaptureProgress(100);
        analyzeFrames(frames);
        return;
      }

      const image = captureFrame();
      if (image) {
        frames.push({ image, timestamp: elapsed });
      }
    }, CAPTURE_INTERVAL_MS);
  };

  const analyzeFrames = async (frames: { image: string; timestamp: number }[]) => {
    setPhase('analyzing');

    try {
      const response = await axiosInstance.post('/face/liveness-check', {
        challenge_type: challenge.type,
        challenge_param: challenge.param,
        frames,
      });

      const data = response.data.data;
      setResult({ passed: data.passed, message: data.message });
      setPhase('result');

      if (data.passed) {
        setTimeout(() => {
          stopCamera();
          onPassed();
        }, 1500);
      } else {
        setRetries((prev) => prev + 1);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Liveness check failed';
      setError(msg);
      setPhase('result');
      setRetries((prev) => prev + 1);
    }
  };

  const handleRetry = () => {
    // Pick a different random challenge for each retry
    const remaining = CHALLENGES.filter((c) => c.param !== challenge.param || c.type !== challenge.type);
    const next = remaining.length > 0 ? remaining[Math.floor(Math.random() * remaining.length)] : challenge;
    setChallenge(next);
    setResult(null);
    setError(null);
    setPhase('ready');
  };

  const canRetry = retries < MAX_RETRIES;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="bg-indigo-600 text-white px-6 py-4">
          <h2 className="text-lg font-bold flex items-center">
            <ShieldCheck className="h-6 w-6 mr-2" />
            Liveness Check
          </h2>
          <p className="text-indigo-200 text-sm mt-1">Confirm you are a real person</p>
        </div>

        <div className="p-6">
          {/* Camera view */}
          <div className="relative w-full aspect-[4/3] bg-gray-900 rounded-xl overflow-hidden mb-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />

            {phase === 'capturing' && (
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/30">
                <div
                  className="h-full bg-indigo-400 transition-all duration-200"
                  style={{ width: `${captureProgress}%` }}
                />
              </div>
            )}

            {phase === 'analyzing' && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <RefreshCw className="h-10 w-10 animate-spin mx-auto mb-2" />
                  <p className="font-medium">Analyzing...</p>
                </div>
              </div>
            )}
          </div>

          {/* Challenge instruction */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-4 text-center">
            <div className="text-indigo-600 mb-2 flex justify-center">{challenge.icon}</div>
            <p className="text-indigo-800 font-bold text-lg">{challenge.instruction}</p>
            {phase === 'ready' && (
              <p className="text-indigo-600 text-sm mt-1">
                Press "Start" and perform the action within 5 seconds
              </p>
            )}
            {phase === 'capturing' && (
              <p className="text-indigo-600 text-sm mt-1 animate-pulse">Recording... perform the action now!</p>
            )}
          </div>

          {/* Result display */}
          {result && (
            <div
              className={`flex items-center p-3 rounded-lg mb-4 ${
                result.passed
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}
            >
              {result.passed ? (
                <ShieldCheck className="h-5 w-5 mr-2 flex-shrink-0" />
              ) : (
                <ShieldAlert className="h-5 w-5 mr-2 flex-shrink-0" />
              )}
              <p className="font-medium text-sm">{result.message}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {!canRetry && !result?.passed && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg mb-4 text-sm">
              Maximum attempts reached. Please contact your lecturer.
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            {result?.passed ? (
              <div className="w-full text-center py-3 bg-green-100 text-green-700 rounded-xl font-bold">
                Liveness confirmed — proceeding...
              </div>
            ) : phase === 'ready' && canRetry ? (
              <button
                onClick={startCapture}
                disabled={!cameraReady}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {retries > 0 ? `Retry (${MAX_RETRIES - retries} left)` : 'Start Challenge'}
              </button>
            ) : phase === 'result' && canRetry ? (
              <button
                onClick={handleRetry}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
              >
                Try Different Challenge ({MAX_RETRIES - retries} left)
              </button>
            ) : !canRetry ? (
              <button
                onClick={() => {
                  stopCamera();
                  onFailed();
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition"
              >
                Contact Lecturer
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivenessChallenge;
