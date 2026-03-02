import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, CheckCircle, RefreshCw, User } from 'lucide-react';
import axiosInstance from '../../../services/api/axios.config';

interface FaceEnrollmentProps {
  onEnrolled?: () => void;
}

const FaceEnrollment: React.FC<FaceEnrollmentProps> = ({ onEnrolled }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraReady(true);
      }
    } catch {
      setError('Camera access denied. Please allow camera access.');
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
    return canvas.toDataURL('image/jpeg', 0.8);
  }, []);

  const handleCapture = () => {
    const dataUrl = captureFrame();
    if (dataUrl) {
      setPreview(dataUrl);
    }
  };

  const handleEnroll = async () => {
    if (!preview) return;

    setEnrolling(true);
    setError(null);

    try {
      const base64 = preview.split(',')[1];
      await axiosInstance.post('/face/enroll', { image: base64 });

      setEnrolled(true);
      stopCamera();
      onEnrolled?.();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Face enrollment failed. Please try again.';
      setError(msg);
      setPreview(null);
    } finally {
      setEnrolling(false);
    }
  };

  const handleRetake = () => {
    setPreview(null);
    setError(null);
  };

  if (enrolled) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-green-800">Face Enrolled Successfully</h3>
        <p className="text-green-600 text-sm mt-1">
          Your face has been registered for identity verification during exams.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <User className="h-5 w-5 mr-2 text-primary-600" />
          Face Enrollment
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Register your face for identity verification during proctored exams.
        </p>
      </div>

      <div className="p-6">
        {!cameraReady && !preview ? (
          <div className="text-center py-8">
            <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              Click below to open the camera and capture your face photo.
            </p>
            <button
              onClick={startCamera}
              className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition"
            >
              Open Camera
            </button>
          </div>
        ) : preview ? (
          <div>
            <div className="w-full aspect-[4/3] bg-gray-900 rounded-xl overflow-hidden mb-4">
              <img
                src={preview}
                alt="Captured face"
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleRetake}
                disabled={enrolling}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition disabled:opacity-50"
              >
                Retake
              </button>
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="flex-1 bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition disabled:opacity-50 flex items-center justify-center"
              >
                {enrolling ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Enrolling...
                  </>
                ) : (
                  'Confirm & Enroll'
                )}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="relative w-full aspect-[4/3] bg-gray-900 rounded-xl overflow-hidden mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  stopCamera();
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCapture}
                className="flex-1 bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition flex items-center justify-center"
              >
                <Camera className="h-5 w-5 mr-2" />
                Capture Photo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceEnrollment;
