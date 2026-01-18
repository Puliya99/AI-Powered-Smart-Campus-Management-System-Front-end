import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { Camera, CameraOff, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

interface FaceDetectionCameraProps {
  onViolation: (type: 'NO_FACE' | 'MULTIPLE_FACES' | 'CAMERA_DISABLED' | 'NONE', details?: string, shouldCancel?: boolean) => void;
  isActive: boolean;
  isCameraOff?: boolean;
}

const FaceDetectionCamera: React.FC<FaceDetectionCameraProps> = ({ onViolation, isActive, isCameraOff = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [detectionRunning, setDetectionRunning] = useState(false);
  const [noFaceWarning, setNoFaceWarning] = useState(false);
  const [multipleFacesWarning, setMultipleFacesWarning] = useState(false);
  const [cameraOffWarning, setCameraOffWarning] = useState(false);
  
  const noFaceTimer = useRef<NodeJS.Timeout | null>(null);
  const multipleFacesTimer = useRef<NodeJS.Timeout | null>(null);
  const cameraOffTimer = useRef<NodeJS.Timeout | null>(null);

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
      if (isCameraOff) {
        stopVideo();
      } else {
        startVideo();
      }
    } else {
      stopVideo();
    }
    return () => stopVideo();
  }, [modelsLoaded, isActive, cameraError, isCameraOff]);

  useEffect(() => {
    if (isActive && isCameraOff && !cameraError) {
      if (!cameraOffWarning) {
        setCameraOffWarning(true);
        onViolation('CAMERA_DISABLED', 'Camera was manually turned off');
        toast.error('Camera must be ON during the quiz!', { duration: 3000 });
      }
      if (!cameraOffTimer.current) {
        cameraOffTimer.current = setTimeout(() => {
          onViolation('CAMERA_DISABLED', 'Camera remained off for 10 seconds', true);
          setCameraOffWarning(false);
          cameraOffTimer.current = null;
        }, 10000);
      }
    } else {
      if (cameraOffTimer.current) {
        clearTimeout(cameraOffTimer.current);
        cameraOffTimer.current = null;
      }
      if (cameraOffWarning) {
        setCameraOffWarning(false);
      }
      if (isActive && modelsLoaded && !cameraError && !noFaceWarning && !multipleFacesWarning) {
        onViolation('NONE');
      }
    }
    return () => {
      if (cameraOffTimer.current) {
        clearTimeout(cameraOffTimer.current);
        cameraOffTimer.current = null;
      }
    };
  }, [isActive, isCameraOff, cameraError, onViolation, modelsLoaded, cameraOffWarning, noFaceWarning, multipleFacesWarning]);

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
      onViolation('CAMERA_DISABLED', 'Could not access webcam', true); // Critical if hardware error
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

          // Handle NO_FACE
          if (detections.length === 0) {
            if (!noFaceWarning) {
              setNoFaceWarning(true);
              onViolation('NO_FACE', 'No face detected');
              toast.error('Face not detected! Please stay in front of the camera.', { duration: 3000 });
            }
            if (!noFaceTimer.current) {
              noFaceTimer.current = setTimeout(() => {
                onViolation('NO_FACE', 'No face detected for 10 seconds', true);
                setNoFaceWarning(false);
                noFaceTimer.current = null;
              }, 10000);
            }
            if (multipleFacesWarning) {
              setMultipleFacesWarning(false);
            }
            if (multipleFacesTimer.current) {
              clearTimeout(multipleFacesTimer.current);
              multipleFacesTimer.current = null;
            }
          } else {
            if (noFaceTimer.current) {
              clearTimeout(noFaceTimer.current);
              noFaceTimer.current = null;
            }
            if (noFaceWarning) {
              setNoFaceWarning(false);
            }
          }

          // Handle MULTIPLE_FACES
          if (detections.length > 1) {
            if (!multipleFacesWarning) {
              setMultipleFacesWarning(true);
              onViolation('MULTIPLE_FACES', `${detections.length} faces detected`);
              toast.error('Multiple faces detected!', { duration: 3000 });
            }
            if (!multipleFacesTimer.current) {
              multipleFacesTimer.current = setTimeout(() => {
                onViolation('MULTIPLE_FACES', 'Multiple faces detected for 10 seconds', true);
                setMultipleFacesWarning(false);
                multipleFacesTimer.current = null;
              }, 10000);
            }
            if (noFaceWarning) {
              setNoFaceWarning(false);
            }
            if (noFaceTimer.current) {
              clearTimeout(noFaceTimer.current);
              noFaceTimer.current = null;
            }
          } else {
            if (multipleFacesTimer.current) {
              clearTimeout(multipleFacesTimer.current);
              multipleFacesTimer.current = null;
            }
            if (multipleFacesWarning) {
              setMultipleFacesWarning(false);
            }
          }

          // Trigger clear if all counts are back to 0
          if (!noFaceWarning && !multipleFacesWarning && !cameraOffWarning) {
            onViolation('NONE');
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [detectionRunning, isActive, onViolation, noFaceWarning, multipleFacesWarning, cameraOffWarning]);

  useEffect(() => {
    return () => {
      if (noFaceTimer.current) {
        clearTimeout(noFaceTimer.current);
      }
      if (multipleFacesTimer.current) {
        clearTimeout(multipleFacesTimer.current);
      }
      if (cameraOffTimer.current) {
        clearTimeout(cameraOffTimer.current);
      }
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 w-48 h-36 bg-gray-900 rounded-lg overflow-hidden border-2 border-primary-500 shadow-2xl z-50">
      {!isCameraOff ? (
        !cameraError ? (
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
        )
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 text-gray-400 p-2 text-center">
          <CameraOff className="w-8 h-8 mb-2" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Camera Off</span>
        </div>
      )}
      
      <div className="absolute top-2 left-2 flex items-center bg-black bg-opacity-50 px-1.5 py-0.5 rounded text-[10px] text-white">
        <div className={`w-1.5 h-1.5 rounded-full mr-1 ${detectionRunning && !isCameraOff ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
        {isCameraOff ? 'PAUSED' : 'MONITORING'}
      </div>

      {!modelsLoaded && !cameraError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
        </div>
      )}

      {noFaceWarning && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-30 pointer-events-none">
          <AlertTriangle className="w-12 h-12 text-red-600 animate-bounce" />
        </div>
      )}
    </div>
  );
};

export default FaceDetectionCamera;
