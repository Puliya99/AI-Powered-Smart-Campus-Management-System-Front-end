import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { Camera, CameraOff, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

interface FaceDetectionCameraProps {
  onViolation: (type: 'NO_FACE' | 'MULTIPLE_FACES' | 'CAMERA_DISABLED', details?: string) => void;
  isActive: boolean;
}

const FaceDetectionCamera: React.FC<FaceDetectionCameraProps> = ({ onViolation, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [detectionRunning, setDetectionRunning] = useState(false);
  
  const noFaceTimer = useRef<NodeJS.Timeout | null>(null);
  const noFaceCount = useRef(0);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
      } catch (error) {
        console.error('Error loading face detection models:', error);
        toast.error('Failed to load security models');
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (modelsLoaded && isActive && !cameraError) {
      startVideo();
    } else {
      stopVideo();
    }
    return () => stopVideo();
  }, [modelsLoaded, isActive, cameraError]);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setDetectionRunning(true);
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setCameraError(true);
      onViolation('CAMERA_DISABLED', 'Could not access webcam');
      toast.error('Webcam access is required for this quiz');
    }
  };

  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setDetectionRunning(false);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (detectionRunning && isActive) {
      interval = setInterval(async () => {
        if (videoRef.current) {
          const detections = await faceapi.detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          );

          if (detections.length === 0) {
            noFaceCount.current += 1;
            if (noFaceCount.current === 5) { // ~5 seconds (interval is 1s)
              toast.error('Face not detected! Please stay in front of the camera.', { duration: 3000 });
              onViolation('NO_FACE', 'No face detected for 5 seconds');
            }
            if (noFaceCount.current >= 10) {
               onViolation('NO_FACE', 'No face detected for 10 seconds');
            }
          } else if (detections.length > 1) {
            noFaceCount.current = 0;
            onViolation('MULTIPLE_FACES', `${detections.length} faces detected`);
            toast.error('Multiple faces detected!', { duration: 3000 });
          } else {
            noFaceCount.current = 0;
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [detectionRunning, isActive, onViolation]);

  return (
    <div className="fixed bottom-4 right-4 w-48 h-36 bg-gray-900 rounded-lg overflow-hidden border-2 border-primary-500 shadow-2xl z-50">
      {!cameraError ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover mirror"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 text-red-500 p-2 text-center">
          <CameraOff className="w-8 h-8 mb-2" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Camera Required</span>
        </div>
      )}
      
      <div className="absolute top-2 left-2 flex items-center bg-black bg-opacity-50 px-1.5 py-0.5 rounded text-[10px] text-white">
        <div className={`w-1.5 h-1.5 rounded-full mr-1 ${detectionRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
        MONITORING
      </div>

      {!modelsLoaded && !cameraError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
        </div>
      )}

      {noFaceCount.current >= 5 && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-30 pointer-events-none">
          <AlertTriangle className="w-12 h-12 text-red-600 animate-bounce" />
        </div>
      )}
    </div>
  );
};

export default FaceDetectionCamera;
