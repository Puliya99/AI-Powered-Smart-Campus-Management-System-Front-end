import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, ShieldCheck, ShieldAlert, RefreshCw, X } from 'lucide-react';
import axiosInstance from '../../../services/api/axios.config';

interface FaceVerificationModalProps {
  onVerified: () => void;
  onSkip?: () => void;
  studentId: string;
}

const MAX_RETRIES = 3;

const FaceVerificationModal: React.FC<FaceVerificationModalProps> = ({
  onVerified,
  onSkip,
  studentId,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<{
    verified: boolean;
    confidence: number;
    message: string;
  } | null>(null);
  const [retries, setRetries] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
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
      setError('Camera access denied. Please allow camera access and try again.');
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
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    return dataUrl.split(',')[1];
  }, []);

  const handleVerify = async () => {
    const image = captureFrame();
    if (!image) return;

    setVerifying(true);
    setResult(null);
    setError(null);

    try {
      const response = await axiosInstance.post('/face/verify', { image });
      const data = response.data.data;

      setResult({
        verified: data.verified,
        confidence: data.confidence,
        message: data.message,
      });

      if (data.verified) {
        setTimeout(() => {
          stopCamera();
          onVerified();
        }, 1500);
      } else {
        setRetries((prev) => prev + 1);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Verification failed. Please try again.';
      setError(msg);
      setRetries((prev) => prev + 1);
    } finally {
      setVerifying(false);
    }
  };

  const canRetry = retries < MAX_RETRIES;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="bg-primary-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <ShieldCheck className="h-6 w-6 mr-2" />
            <h2 className="text-lg font-bold">Identity Verification</h2>
          </div>
          {onSkip && (
            <button onClick={onSkip} className="text-white/70 hover:text-white transition">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="p-6">
          <p className="text-gray-600 text-sm mb-4">
            Please look directly at the camera and click "Verify" to confirm your identity before
            starting the quiz.
          </p>

          <div className="relative w-full aspect-[4/3] bg-gray-900 rounded-xl overflow-hidden mb-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover mirror"
              style={{ transform: 'scaleX(-1)' }}
            />
            {!cameraReady && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="h-12 w-12 text-gray-400 animate-pulse" />
              </div>
            )}
          </div>

          {result && (
            <div
              className={`flex items-center p-3 rounded-lg mb-4 ${
                result.verified
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}
            >
              {result.verified ? (
                <ShieldCheck className="h-5 w-5 mr-2 flex-shrink-0" />
              ) : (
                <ShieldAlert className="h-5 w-5 mr-2 flex-shrink-0" />
              )}
              <div>
                <p className="font-medium text-sm">{result.message}</p>
                <p className="text-xs mt-0.5">
                  Confidence: {(result.confidence * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {!result?.verified && !canRetry && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg mb-4 text-sm">
              Maximum verification attempts reached. Please contact your lecturer for assistance.
            </div>
          )}

          <div className="flex gap-3">
            {result?.verified ? (
              <div className="w-full text-center py-3 bg-green-100 text-green-700 rounded-xl font-bold">
                Verified — Starting quiz...
              </div>
            ) : canRetry ? (
              <button
                onClick={handleVerify}
                disabled={verifying || !cameraReady}
                className="flex-1 bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {verifying ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : retries > 0 ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Retry ({MAX_RETRIES - retries} left)
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-5 w-5 mr-2" />
                    Verify My Identity
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => {
                  stopCamera();
                  if (onSkip) onSkip();
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition"
              >
                Contact Lecturer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceVerificationModal;
