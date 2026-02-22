import React, { useState, useEffect, useCallback } from 'react'
import {
  Fingerprint,
  CheckCircle,
  XCircle,
  Clock,
  LogIn,
  LogOut,
  Delete,
  BookOpen,
  User,
  AlertCircle,
} from 'lucide-react'
import { startAuthentication } from '@simplewebauthn/browser'
import kioskService from '../../services/kiosk.service'

type KioskState = 'idle' | 'loading' | 'student-found' | 'success' | 'error'
type AttendanceAction = 'ENTRY' | 'EXIT' | 'ALREADY_COMPLETED'

interface ScheduleInfo {
  id: string
  moduleName: string
  moduleCode: string
  batchNumber: string
  lecturer: string
  lectureHall: string
  startTime: string
  endTime: string
}

interface StudentInfo {
  id: string
  name: string
  universityNumber: string
  profilePic?: string
}

const KioskAttendancePage: React.FC = () => {
  const [state, setState] = useState<KioskState>('idle')
  const [passkey, setPasskey] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [schedule, setSchedule] = useState<ScheduleInfo | null>(null)
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null)
  const [action, setAction] = useState<AttendanceAction | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [resetTimer, setResetTimer] = useState<NodeJS.Timeout | null>(null)

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  // Fetch current schedule on mount and every 5 minutes
  useEffect(() => {
    fetchSchedule()
    const interval = setInterval(fetchSchedule, 300000)
    return () => clearInterval(interval)
  }, [])

  const fetchSchedule = async () => {
    try {
      const res = await kioskService.getCurrentSchedule()
      setSchedule(res.data.data.currentSchedule)
    } catch {
      setSchedule(null)
    }
  }

  const resetToIdle = useCallback(() => {
    setState('idle')
    setPasskey('')
    setStudentInfo(null)
    setAction(null)
    setErrorMessage('')
    if (resetTimer) clearTimeout(resetTimer)
  }, [resetTimer])

  const autoReset = useCallback((delay = 5000) => {
    if (resetTimer) clearTimeout(resetTimer)
    const timer = setTimeout(resetToIdle, delay)
    setResetTimer(timer)
  }, [resetTimer, resetToIdle])

  const handleKeyPress = (key: string) => {
    if (state !== 'idle' && state !== 'student-found') return

    if (key === 'clear') {
      setPasskey('')
      return
    }
    if (key === 'backspace') {
      setPasskey(prev => prev.slice(0, -1))
      return
    }
    if (passkey.length < 6) {
      const newPasskey = passkey + key
      setPasskey(newPasskey)
      if (newPasskey.length === 6) {
        handlePasskeyScan(parseInt(newPasskey, 10))
      }
    }
  }

  const handlePasskeyScan = async (passkeyNum: number) => {
    setState('loading')
    try {
      const res = await kioskService.scanByPasskey(passkeyNum)
      const data = res.data.data
      setStudentInfo(data.student)
      setAction(data.action)
      setState('success')
      autoReset()
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Scan failed. Please try again.'
      setErrorMessage(msg)
      setState('error')
      autoReset()
    }
  }

  const handleFingerprintScan = async () => {
    if (passkey.length !== 6) {
      setErrorMessage('Please enter your 6-digit passkey first')
      setState('error')
      autoReset(3000)
      return
    }

    setState('loading')
    const passkeyNum = parseInt(passkey, 10)

    try {
      // Start WebAuthn authentication
      const startRes = await kioskService.webauthnAuthStart(passkeyNum)
      const options = startRes.data.data.options

      // Trigger browser fingerprint prompt
      const authResponse = await startAuthentication({ optionsJSON: options })

      // Verify and mark attendance
      const finishRes = await kioskService.webauthnAuthFinish(passkeyNum, authResponse)
      const data = finishRes.data.data
      setStudentInfo(data.student)
      setAction(data.action)
      setState('success')
      autoReset()
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Fingerprint verification failed'
      setErrorMessage(msg)
      setState('error')
      autoReset()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const numpadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'backspace']

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white flex flex-col">
      {/* Header: Clock + Schedule */}
      <div className="text-center py-6 border-b border-white/10">
        <div className="text-6xl font-mono font-bold tracking-wider text-blue-300">
          {formatTime(currentTime)}
        </div>
        <div className="text-lg text-slate-400 mt-1">{formatDate(currentTime)}</div>
        {schedule && (
          <div className="mt-4 inline-flex items-center gap-3 bg-white/5 rounded-xl px-6 py-3">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <span className="font-semibold text-blue-200">{schedule.moduleCode}</span>
            <span className="text-slate-300">-</span>
            <span className="text-white">{schedule.moduleName}</span>
            <span className="text-slate-400">|</span>
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-slate-300">{schedule.startTime} - {schedule.endTime}</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300">{schedule.lectureHall}</span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        {/* Idle / Input State */}
        {(state === 'idle' || state === 'student-found') && (
          <div className="max-w-md w-full space-y-8">
            {/* Title */}
            <div className="text-center">
              <Fingerprint className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold">Mark Attendance</h1>
              <p className="text-slate-400 mt-2">Enter your 6-digit passkey or use fingerprint</p>
            </div>

            {/* Passkey Display */}
            <div className="flex justify-center gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-14 h-16 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                    i < passkey.length
                      ? 'border-blue-400 bg-blue-500/20 text-blue-300'
                      : 'border-slate-600 bg-slate-800/50 text-slate-500'
                  }`}
                >
                  {i < passkey.length ? '\u2022' : ''}
                </div>
              ))}
            </div>

            {/* Numpad */}
            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
              {numpadKeys.map(key => (
                <button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  className={`h-16 rounded-xl text-xl font-semibold transition-all active:scale-95 ${
                    key === 'clear'
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm'
                      : key === 'backspace'
                      ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                      : 'bg-slate-700/50 text-white hover:bg-slate-600/50'
                  }`}
                >
                  {key === 'clear' ? 'CLR' : key === 'backspace' ? <Delete className="w-6 h-6 mx-auto" /> : key}
                </button>
              ))}
            </div>

            {/* Fingerprint Button */}
            <button
              onClick={handleFingerprintScan}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
            >
              <Fingerprint className="w-6 h-6" />
              Verify with Fingerprint
            </button>
          </div>
        )}

        {/* Loading State */}
        {state === 'loading' && (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto" />
            <p className="text-xl text-slate-300">Processing...</p>
          </div>
        )}

        {/* Success State */}
        {state === 'success' && (
          <div className="text-center space-y-6 animate-in fade-in">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto ${
              action === 'ALREADY_COMPLETED' ? 'bg-yellow-500/20' : 'bg-green-500/20'
            }`}>
              {action === 'ENTRY' && <LogIn className="w-16 h-16 text-green-400" />}
              {action === 'EXIT' && <LogOut className="w-16 h-16 text-green-400" />}
              {action === 'ALREADY_COMPLETED' && <CheckCircle className="w-16 h-16 text-yellow-400" />}
            </div>

            {studentInfo && (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-3">
                  <User className="w-6 h-6 text-blue-400" />
                  <span className="text-2xl font-bold">{studentInfo.name}</span>
                </div>
                <p className="text-slate-400">{studentInfo.universityNumber}</p>
              </div>
            )}

            <div className={`text-3xl font-bold ${
              action === 'ALREADY_COMPLETED' ? 'text-yellow-400' : 'text-green-400'
            }`}>
              {action === 'ENTRY' && 'Entry Recorded'}
              {action === 'EXIT' && 'Exit Recorded'}
              {action === 'ALREADY_COMPLETED' && 'Already Recorded'}
            </div>

            <p className="text-slate-500 text-sm">Auto-resetting in a few seconds...</p>

            <button
              onClick={resetToIdle}
              className="mt-4 px-8 py-3 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 text-white font-medium transition-all"
            >
              Done
            </button>
          </div>
        )}

        {/* Error State */}
        {state === 'error' && (
          <div className="text-center space-y-6 animate-in fade-in">
            <div className="w-32 h-32 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
              <XCircle className="w-16 h-16 text-red-400" />
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-red-400">Error</p>
              <p className="text-slate-400 max-w-sm mx-auto">{errorMessage}</p>
            </div>

            <button
              onClick={resetToIdle}
              className="mt-4 px-8 py-3 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 text-white font-medium transition-all"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-4 border-t border-white/10">
        <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>Smart Campus Attendance System</span>
        </div>
      </div>
    </div>
  )
}

export default KioskAttendancePage
