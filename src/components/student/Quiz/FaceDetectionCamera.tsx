import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { Camera, CameraOff, AlertTriangle, Smartphone, Eye, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

type ViolationType = 'NO_FACE' | 'MULTIPLE_FACES' | 'CAMERA_DISABLED' | 'CHEATING_OBJECT' | 'LOOKING_AWAY' | 'HEAD_POSE' | 'TAB_SWITCH' | 'NONE';

interface ViolationInfo {
  type: ViolationType;
  details?: string;
  weight: number;
}

interface FaceDetectionCameraProps {
  onViolation: (type: ViolationType, details?: string, shouldCancel?: boolean) => void;
  onViolationScore?: (score: number, violations: ViolationInfo[]) => void;
  isActive: boolean;
  isCameraOff?: boolean;
}

const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000';

// Professional violation thresholds (in seconds)
const NO_FACE_GRACE_PERIOD = 3;       // 3 seconds before reporting
const MULTIPLE_FACE_GRACE_PERIOD = 2;  // 2 seconds
const LOOKING_AWAY_GRACE_PERIOD = 5;   // 5 seconds before reporting
const CAMERA_OFF_GRACE_PERIOD = 10;    // 10 seconds before cancel
const OBJECT_DETECTION_INTERVAL = 5;   // Run YOLO every 5th analysis call

const FaceDetectionCamera: React.FC<FaceDetectionCameraProps> = ({ onViolation, onViolationScore, isActive, isCameraOff = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [detectionRunning, setDetectionRunning] = useState(false);

  // Warning states
  const [noFaceWarning, setNoFaceWarning] = useState(false);
  const [multipleFacesWarning, setMultipleFacesWarning] = useState(false);
  const [cameraOffWarning, setCameraOffWarning] = useState(false);
  const [cheatingObjectWarning, setCheatingObjectWarning] = useState(false);
  const [lookingAwayWarning, setLookingAwayWarning] = useState(false);

  // Display info
  const [detectedObjects, setDetectedObjects] = useState<string[]>([]);
  const [lookingDirection, setLookingDirection] = useState<string>('center');
  const [headPose, setHeadPose] = useState<{ yaw: number; pitch: number; roll: number } | null>(null);
  const [currentViolationScore, setCurrentViolationScore] = useState(0);

  // Timers for grace periods
  const noFaceTimer = useRef<NodeJS.Timeout | null>(null);
  const noFaceStartTime = useRef<number | null>(null);
  const multipleFacesTimer = useRef<NodeJS.Timeout | null>(null);
  const cameraOffTimer = useRef<NodeJS.Timeout | null>(null);
  const lookingAwayStartTime = useRef<number | null>(null);
  const lookingAwayTimer = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analysisFrameCount = useRef(0);

  // Load face-api.js models (fallback for when AI service is down)
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

  // Camera off violation handling
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
        }, CAMERA_OFF_GRACE_PERIOD * 1000);
      }
    } else {
      if (cameraOffTimer.current) {
        clearTimeout(cameraOffTimer.current);
        cameraOffTimer.current = null;
      }
      if (cameraOffWarning) {
        setCameraOffWarning(false);
      }
      if (isActive && modelsLoaded && !cameraError && !noFaceWarning && !multipleFacesWarning && !lookingAwayWarning) {
        onViolation('NONE');
      }
    }
    return () => {
      if (cameraOffTimer.current) {
        clearTimeout(cameraOffTimer.current);
        cameraOffTimer.current = null;
      }
    };
  }, [isActive, isCameraOff, cameraError, onViolation, modelsLoaded, cameraOffWarning, noFaceWarning, multipleFacesWarning, lookingAwayWarning]);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },  // Optimized resolution for MX150
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setDetectionRunning(true);
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setCameraError(true);
      onViolation('CAMERA_DISABLED', 'Could not access webcam', true);
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

  // Capture frame as base64
  const captureFrameAsBase64 = useCallback((): string | null => {
    if (!videoRef.current) return null;

    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
    return dataUrl.split(',')[1];
  }, []);

  // Main analysis loop - uses combined /api/proctor/analyze endpoint
  const runProctorAnalysis = useCallback(async () => {
    if (!detectionRunning || !isActive || isCameraOff) return;

    const base64Image = captureFrameAsBase64();
    if (!base64Image) return;

    analysisFrameCount.current += 1;
    const runObjectDetection = analysisFrameCount.current % OBJECT_DETECTION_INTERVAL === 0;

    try {
      const response = await axios.post(`${AI_SERVICE_URL}/api/proctor/analyze`, {
        image: base64Image,
        run_object_detection: runObjectDetection,
        confidence_threshold: 0.6,
      }, { timeout: 5000 });

      const data = response.data;
      const { face_count, head_pose: pose, looking_away, looking_direction: direction, suspicious_objects, violations, total_violation_weight } = data;

      // Update display state
      if (pose) setHeadPose(pose);
      setLookingDirection(direction || 'center');
      setCurrentViolationScore(total_violation_weight);

      // Report violation score to parent
      if (onViolationScore) {
        onViolationScore(total_violation_weight, violations);
      }

      // --- Handle NO_FACE with grace period ---
      if (face_count === 0) {
        if (!noFaceStartTime.current) {
          noFaceStartTime.current = Date.now();
        }
        const elapsed = (Date.now() - noFaceStartTime.current) / 1000;

        if (elapsed >= NO_FACE_GRACE_PERIOD && !noFaceWarning) {
          setNoFaceWarning(true);
          onViolation('NO_FACE', `No face detected for ${Math.round(elapsed)}s`);
          toast.error('Face not detected! Please stay in front of the camera.', { duration: 3000 });
        }

        if (!noFaceTimer.current) {
          noFaceTimer.current = setTimeout(() => {
            onViolation('NO_FACE', 'No face detected for extended period', true);
            noFaceStartTime.current = null;
            setNoFaceWarning(false);
            noFaceTimer.current = null;
          }, 10000);
        }

        // Clear multiple faces state
        if (multipleFacesWarning) setMultipleFacesWarning(false);
        if (multipleFacesTimer.current) {
          clearTimeout(multipleFacesTimer.current);
          multipleFacesTimer.current = null;
        }
      } else {
        // Face found - clear no-face state
        noFaceStartTime.current = null;
        if (noFaceTimer.current) {
          clearTimeout(noFaceTimer.current);
          noFaceTimer.current = null;
        }
        if (noFaceWarning) setNoFaceWarning(false);
      }

      // --- Handle MULTIPLE_FACES ---
      if (face_count > 1) {
        if (!multipleFacesWarning) {
          setMultipleFacesWarning(true);
          onViolation('MULTIPLE_FACES', `${face_count} faces detected`);
          toast.error('Multiple faces detected!', { duration: 3000 });
        }
        if (!multipleFacesTimer.current) {
          multipleFacesTimer.current = setTimeout(() => {
            onViolation('MULTIPLE_FACES', 'Multiple faces detected for extended period', true);
            setMultipleFacesWarning(false);
            multipleFacesTimer.current = null;
          }, 10000);
        }
      } else {
        if (multipleFacesTimer.current) {
          clearTimeout(multipleFacesTimer.current);
          multipleFacesTimer.current = null;
        }
        if (multipleFacesWarning) setMultipleFacesWarning(false);
      }

      // --- Handle LOOKING_AWAY with 5-second grace period ---
      if (looking_away && face_count === 1) {
        if (!lookingAwayStartTime.current) {
          lookingAwayStartTime.current = Date.now();
        }
        const elapsed = (Date.now() - lookingAwayStartTime.current) / 1000;

        if (elapsed >= LOOKING_AWAY_GRACE_PERIOD && !lookingAwayWarning) {
          setLookingAwayWarning(true);
          const details = `Looking ${direction} for ${Math.round(elapsed)}s`;
          onViolation('LOOKING_AWAY', details);
          toast.error(`Looking away detected: ${direction}`, { duration: 3000 });
        }

        if (!lookingAwayTimer.current && elapsed >= LOOKING_AWAY_GRACE_PERIOD) {
          lookingAwayTimer.current = setTimeout(() => {
            onViolation('LOOKING_AWAY', `Looking ${direction} for extended period`, true);
            lookingAwayStartTime.current = null;
            setLookingAwayWarning(false);
            lookingAwayTimer.current = null;
          }, 15000); // Cancel after 15s total of looking away
        }
      } else {
        lookingAwayStartTime.current = null;
        if (lookingAwayTimer.current) {
          clearTimeout(lookingAwayTimer.current);
          lookingAwayTimer.current = null;
        }
        if (lookingAwayWarning) setLookingAwayWarning(false);
      }

      // --- Handle CHEATING_OBJECT ---
      if (suspicious_objects && suspicious_objects.length > 0) {
        const labels = suspicious_objects.map((obj: any) => obj.label);
        setDetectedObjects(labels);

        if (!cheatingObjectWarning) {
          setCheatingObjectWarning(true);
          onViolation('CHEATING_OBJECT', `Detected: ${labels.join(', ')}`);
          toast.error(`Suspicious object detected: ${labels.join(', ')}`, { duration: 4000 });
        }
      } else if (runObjectDetection) {
        // Only clear when we actually ran object detection
        if (cheatingObjectWarning) {
          setCheatingObjectWarning(false);
          setDetectedObjects([]);
        }
      }

      // Clear all violations if everything is normal
      if (face_count === 1 && !looking_away && (!suspicious_objects || suspicious_objects.length === 0) && !cameraOffWarning) {
        onViolation('NONE');
      }

    } catch {
      // AI service unavailable - fall back to face-api.js
      await runFallbackDetection();
    }
  }, [detectionRunning, isActive, isCameraOff, onViolation, onViolationScore, captureFrameAsBase64, noFaceWarning, multipleFacesWarning, lookingAwayWarning, cheatingObjectWarning, cameraOffWarning]);

  // Fallback detection using face-api.js when AI service is down
  const runFallbackDetection = useCallback(async () => {
    if (!videoRef.current) return;

    const detections = await faceapi.detectAllFaces(
      videoRef.current,
      new faceapi.TinyFaceDetectorOptions()
    );

    if (detections.length === 0) {
      if (!noFaceWarning) {
        setNoFaceWarning(true);
        onViolation('NO_FACE', 'No face detected (fallback mode)');
        toast.error('Face not detected!', { duration: 3000 });
      }
    } else {
      if (noFaceWarning) setNoFaceWarning(false);
    }

    if (detections.length > 1) {
      if (!multipleFacesWarning) {
        setMultipleFacesWarning(true);
        onViolation('MULTIPLE_FACES', `${detections.length} faces detected (fallback mode)`);
        toast.error('Multiple faces detected!', { duration: 3000 });
      }
    } else {
      if (multipleFacesWarning) setMultipleFacesWarning(false);
    }

    if (detections.length === 1 && !cameraOffWarning) {
      onViolation('NONE');
    }
  }, [onViolation, noFaceWarning, multipleFacesWarning, cameraOffWarning]);

  // Run analysis every second
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (detectionRunning && isActive && !isCameraOff) {
      interval = setInterval(runProctorAnalysis, 1000);
    }
    return () => clearInterval(interval);
  }, [detectionRunning, isActive, isCameraOff, runProctorAnalysis]);

  // Cleanup all timers
  useEffect(() => {
    return () => {
      if (noFaceTimer.current) clearTimeout(noFaceTimer.current);
      if (multipleFacesTimer.current) clearTimeout(multipleFacesTimer.current);
      if (cameraOffTimer.current) clearTimeout(cameraOffTimer.current);
      if (lookingAwayTimer.current) clearTimeout(lookingAwayTimer.current);
    };
  }, []);

  // Determine status indicator color
  const getStatusColor = () => {
    if (!detectionRunning || isCameraOff) return 'bg-red-500';
    if (noFaceWarning || multipleFacesWarning || cheatingObjectWarning) return 'bg-red-500 animate-pulse';
    if (lookingAwayWarning) return 'bg-yellow-500 animate-pulse';
    return 'bg-green-500 animate-pulse';
  };

  const getStatusText = () => {
    if (isCameraOff) return 'PAUSED';
    if (!detectionRunning) return 'STARTING';
    if (noFaceWarning) return 'NO FACE';
    if (multipleFacesWarning) return 'MULTI FACE';
    if (cheatingObjectWarning) return 'OBJECT';
    if (lookingAwayWarning) return `LOOK ${lookingDirection.toUpperCase()}`;
    return 'MONITORING';
  };

  return (
    <div className="fixed bottom-4 right-4 w-52 bg-gray-900 rounded-lg overflow-hidden border-2 border-primary-500 shadow-2xl z-50">
      {/* Video Feed */}
      <div className="relative w-full h-36">
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

        {/* Status Badge */}
        <div className="absolute top-1.5 left-1.5 flex items-center bg-black bg-opacity-60 px-1.5 py-0.5 rounded text-[9px] text-white font-bold">
          <div className={`w-1.5 h-1.5 rounded-full mr-1 ${getStatusColor()}`} />
          {getStatusText()}
        </div>

        {/* Head Pose Indicator */}
        {headPose && detectionRunning && !isCameraOff && (
          <div className="absolute top-1.5 right-1.5 bg-black bg-opacity-60 px-1.5 py-0.5 rounded text-[8px] text-gray-300">
            {lookingDirection === 'center' ? 'OK' : lookingDirection.toUpperCase()}
          </div>
        )}

        {!modelsLoaded && !cameraError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
          </div>
        )}

        {/* No Face Overlay */}
        {noFaceWarning && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-30 pointer-events-none">
            <AlertTriangle className="w-12 h-12 text-red-600 animate-bounce" />
          </div>
        )}

        {/* Multiple Faces Overlay */}
        {multipleFacesWarning && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-30 pointer-events-none">
            <Users className="w-12 h-12 text-red-600 animate-pulse" />
          </div>
        )}

        {/* Looking Away Overlay */}
        {lookingAwayWarning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-yellow-500 bg-opacity-30 pointer-events-none">
            <Eye className="w-10 h-10 text-yellow-700 animate-pulse" />
            <span className="text-[8px] font-bold text-yellow-900 mt-1">LOOK AT SCREEN</span>
          </div>
        )}

        {/* Cheating Object Overlay */}
        {cheatingObjectWarning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-orange-500 bg-opacity-40 pointer-events-none">
            <Smartphone className="w-10 h-10 text-orange-700 animate-pulse" />
            <span className="text-[8px] font-bold text-orange-900 mt-1">{detectedObjects.join(', ')}</span>
          </div>
        )}
      </div>

      {/* Violation Score Bar */}
      {detectionRunning && !isCameraOff && (
        <div className="px-2 py-1 bg-gray-800">
          <div className="flex items-center justify-between text-[8px] text-gray-400 mb-0.5">
            <span>Violation Score</span>
            <span className={`font-bold ${currentViolationScore > 3 ? 'text-red-400' : currentViolationScore > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
              {currentViolationScore}/5
            </span>
          </div>
          <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                currentViolationScore > 3 ? 'bg-red-500' : currentViolationScore > 0 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min((currentViolationScore / 5) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceDetectionCamera;
