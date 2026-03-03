import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import io from 'socket.io-client'
import Peer from 'simple-peer'
import { useAuth } from '../../context/AuthContext'
import axiosInstance from '../../services/api/axios.config'
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  Users,
  Share,
  Copy,
  Check,
  MessageSquare,
  Send,
  X,
} from 'lucide-react'
import toast from 'react-hot-toast'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string
  text: string
  senderName: string
  senderId: string
  socketId: string
  timestamp: string
  isLocal: boolean
}

// ─── Remote participant video tile ───────────────────────────────────────────

interface VideoTileProps {
  peer: any
  className?: string
}

const RemoteVideo: React.FC<VideoTileProps> = ({ peer, className = '' }) => {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (peer.streams?.[0] && ref.current) {
      ref.current.srcObject = peer.streams[0]
    }
    peer.on('stream', (stream: MediaStream) => {
      if (ref.current) ref.current.srcObject = stream
    })
  }, [peer])

  return (
    <div className={`relative bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg ${className}`}>
      <video playsInline autoPlay ref={ref} className="w-full h-full object-cover" />
      <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-0.5 rounded-md">
        <span className="text-xs font-medium">Participant</span>
      </div>
    </div>
  )
}

// ─── Main room component ──────────────────────────────────────────────────────

const VideoRoom: React.FC = () => {
  const { meetingCode } = useParams<{ meetingCode: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  // video / audio
  const [micActive, setMicActive] = useState(true)
  const [videoActive, setVideoActive] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [screenSharingSocketId, setScreenSharingSocketId] = useState<string | null>(null)

  // participants
  const [peers, setPeers] = useState<any[]>([])
  const [meeting, setMeeting] = useState<any>(null)
  const [meetingEnded, setMeetingEnded] = useState(false)

  // header util
  const [copied, setCopied] = useState(false)

  // chat
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [messageInput, setMessageInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // refs
  const socketRef = useRef<any>()
  const userVideo = useRef<HTMLVideoElement>(null)
  const peersRef = useRef<any[]>([])
  const streamRef = useRef<MediaStream>()
  const screenStreamRef = useRef<MediaStream | null>(null)
  const chatOpenRef = useRef(false)
  const meetingIdRef = useRef<string | null>(null)

  // keep chatOpenRef in sync so socket callbacks can read it without stale closure
  useEffect(() => { chatOpenRef.current = chatOpen }, [chatOpen])

  // scroll chat to bottom on new messages
  useEffect(() => {
    if (chatOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, chatOpen])

  // ── Socket + media setup ──────────────────────────────────────────────────

  useEffect(() => {
    if (!meetingCode) return

    // ── Cancellation flag ─────────────────────────────────────────────────────
    // React Strict Mode runs effects twice in development (mount → cleanup →
    // mount). Without this flag the cleanup from the first run disconnects the
    // socket mid-handshake ("WebSocket closed before connection established")
    // and stops the camera tracks. When the second run then calls getUserMedia
    // the OS hasn't released the camera yet → NotReadableError.
    // Setting `cancelled = true` in the cleanup makes the async callbacks aware
    // that they belong to a stale run and should release resources immediately.
    let cancelled = false

    fetchMeetingDetails()

    const socket = io('http://localhost:5000', {
      transports: ['websocket'],
      auth: { token: localStorage.getItem('token') ?? '' },
    })
    socketRef.current = socket

    // ── Listeners that don't need the media stream ────────────────────────────

    socket.on('chat-message', (msg: Omit<ChatMessage, 'id' | 'isLocal'>) => {
      if (cancelled) return
      const isLocal = msg.senderId === user?.id
      setMessages((prev) => [
        ...prev,
        { ...msg, id: `${msg.socketId}-${msg.timestamp}`, isLocal },
      ])
      if (!chatOpenRef.current && !isLocal) setUnreadCount((n) => n + 1)
    })

    socket.on('screen-share-started', ({ socketId }: { socketId: string }) => {
      if (!cancelled) setScreenSharingSocketId(socketId)
    })

    socket.on('screen-share-stopped', ({ socketId }: { socketId: string }) => {
      if (!cancelled) setScreenSharingSocketId((prev) => (prev === socketId ? null : prev))
    })

    socket.on('meeting-ended', () => {
      if (cancelled) return
      setMeetingEnded(true)
      toast.error('The meeting has been ended by the host', { duration: 5000 })
      streamRef.current?.getTracks().forEach((t) => t.stop())
    })

    // ── Media acquisition ─────────────────────────────────────────────────────

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        // If cleanup already ran, release the camera immediately and bail out.
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return }

        streamRef.current = stream
        if (userVideo.current) userVideo.current.srcObject = stream

        socket.emit('join-meeting', {
          meetingCode,
          userId: user?.id,
          userName: `${user?.firstName} ${user?.lastName}`,
        })

        socket.on('all-users', (users: any[]) => {
          if (cancelled) return
          const newPeers: any[] = []
          users.forEach((u: any) => {
            const peer = createPeer(u.id, socket.id, stream)
            peersRef.current.push({ peerID: u.id, peer })
            newPeers.push({ peerID: u.id, peer })
          })
          setPeers(newPeers)
        })

        socket.on('user-joined', (payload: any) => {
          if (cancelled || !payload.signal) return
          const peer = addPeer(payload.signal, payload.callerID, stream)
          peersRef.current.push({ peerID: payload.callerID, peer })
          setPeers((prev) => [...prev, { peerID: payload.callerID, peer }])
        })

        socket.on('receiving-returned-signal', (payload: any) => {
          if (cancelled) return
          peersRef.current.find((p) => p.peerID === payload.id)?.peer.signal(payload.signal)
        })

        socket.on('user-left', (id: string) => {
          if (cancelled) return
          const peerObj = peersRef.current.find((p) => p.peerID === id)
          if (peerObj) peerObj.peer.destroy()
          const updated = peersRef.current.filter((p) => p.peerID !== id)
          peersRef.current = updated
          setPeers(updated)
        })
      })
      .catch((err) => {
        if (cancelled) return
        console.error('Failed to get media devices:', err)
        toast.error('Could not access camera/microphone')
      })

    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((t) => t.stop())
      screenStreamRef.current?.getTracks().forEach((t) => t.stop())
      if (meetingIdRef.current) {
        axiosInstance.post(`/video-meetings/${meetingIdRef.current}/leave`).catch(console.error)
      }
      socket.disconnect()
    }
  }, [meetingCode, user?.id, user?.firstName, user?.lastName])

  // ── API ───────────────────────────────────────────────────────────────────

  const fetchMeetingDetails = async () => {
    try {
      const response = await axiosInstance.get(`/video-meetings/code/${meetingCode}`)
      const meetingData = response.data.data.meeting
      if (!meetingData.isActive) { setMeetingEnded(true); return }
      setMeeting(meetingData)
      meetingIdRef.current = meetingData.id
      await axiosInstance.post(`/video-meetings/${meetingData.id}/join`)
    } catch {
      toast.error('Meeting not found or expired')
      navigate('/lecturer/dashboard')
    }
  }

  // ── WebRTC helpers ────────────────────────────────────────────────────────

  function createPeer(userToSignal: string, callerID: string, stream: MediaStream) {
    const peer = new Peer({ initiator: true, trickle: false, stream })
    peer.on('signal', (signal: any) => {
      socketRef.current.emit('sending-signal', { userToSignal, callerID, signal })
    })
    return peer
  }

  function addPeer(incomingSignal: any, callerID: string, stream: MediaStream) {
    const peer = new Peer({ initiator: false, trickle: false, stream })
    peer.on('signal', (signal: any) => {
      socketRef.current.emit('returning-signal', { signal, callerID })
    })
    peer.signal(incomingSignal)
    return peer
  }

  // ── Controls ──────────────────────────────────────────────────────────────

  const toggleMic = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks()[0].enabled = !micActive
      setMicActive(!micActive)
    }
  }

  const toggleVideo = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks()[0].enabled = !videoActive
      setVideoActive(!videoActive)
    }
  }

  const stopScreenShare = () => {
    screenStreamRef.current?.getTracks().forEach((t) => t.stop())
    screenStreamRef.current = null
    const cameraTrack = streamRef.current?.getVideoTracks()[0]
    if (cameraTrack) {
      peersRef.current.forEach(({ peer }) => {
        const senders: RTCRtpSender[] = peer._pc?.getSenders() ?? []
        senders.find((s) => s.track?.kind === 'video')?.replaceTrack(cameraTrack)
      })
    }
    if (userVideo.current && streamRef.current) userVideo.current.srcObject = streamRef.current
    socketRef.current?.emit('screen-share-stopped', { meetingCode })
    setIsScreenSharing(false)
    setScreenSharingSocketId(null)
  }

  const toggleScreenShare = async () => {
    if (isScreenSharing) { stopScreenShare(); return }
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false })
      screenStreamRef.current = screenStream
      const screenTrack = screenStream.getVideoTracks()[0]
      peersRef.current.forEach(({ peer }) => {
        const senders: RTCRtpSender[] = peer._pc?.getSenders() ?? []
        senders.find((s) => s.track?.kind === 'video')?.replaceTrack(screenTrack)
      })
      if (userVideo.current) userVideo.current.srcObject = screenStream
      screenTrack.onended = () => stopScreenShare()
      socketRef.current?.emit('screen-share-started', { meetingCode })
      setIsScreenSharing(true)
      setScreenSharingSocketId('local')
    } catch (err: any) {
      if (err.name !== 'NotAllowedError') toast.error('Could not start screen sharing')
    }
  }

  const handleEndMeeting = async () => {
    if (!meeting) return
    if (!window.confirm('Are you sure you want to end this meeting for everyone?')) return
    try {
      await axiosInstance.put(`/video-meetings/${meeting.id}/end`)
      toast.success('Meeting ended')
      navigate(user?.role === 'LECTURER' ? '/lecturer/classes' : '/student/courses')
    } catch {
      toast.error('Failed to end meeting')
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(meetingCode || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Meeting code copied!')
  }

  const openChat = () => {
    setChatOpen(true)
    setUnreadCount(0)
  }

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    const text = messageInput.trim()
    if (!text) return

    const timestamp = new Date().toISOString()

    // Add locally right away so the sender always sees the message,
    // regardless of whether the socket has joined the room yet.
    setMessages((prev) => [
      ...prev,
      {
        id: `local-${timestamp}-${Math.random()}`,
        text,
        senderName: `${user?.firstName} ${user?.lastName}`,
        senderId: user?.id ?? '',
        socketId: socketRef.current?.id ?? '',
        timestamp,
        isLocal: true,
      },
    ])

    // Relay to all other participants (backend uses socket.to(), not io.to(),
    // so the server only forwards to others — no duplicate for the sender).
    socketRef.current?.emit('chat-message', {
      meetingCode,
      text,
      senderName: `${user?.firstName} ${user?.lastName}`,
      senderId: user?.id,
    })

    setMessageInput('')
  }

  // ── Sync local video srcObject after layout switches ──────────────────────

  useLayoutEffect(() => {
    if (!userVideo.current) return
    const target = isScreenSharing && screenStreamRef.current
      ? screenStreamRef.current
      : streamRef.current
    if (target) userVideo.current.srcObject = target
  })

  // ── Derived layout state ──────────────────────────────────────────────────

  const isSomeoneSharing = screenSharingSocketId !== null
  const isLocalSharing   = screenSharingSocketId === 'local'
  const sharingPeer      = isSomeoneSharing && !isLocalSharing
    ? peers.find((p) => p.peerID === screenSharingSocketId)
    : null

  // ── Meeting ended screen ──────────────────────────────────────────────────

  if (meetingEnded) {
    return (
      <div className="h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 max-w-md w-full">
          <div className="w-20 h-20 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <PhoneOff className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Meeting Ended</h1>
          <p className="text-gray-400 mb-8">
            The host has ended this live session. You will be redirected shortly.
          </p>
          <button
            onClick={() => navigate(user?.role === 'LECTURER' ? '/lecturer/classes' : '/student/courses')}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition"
          >
            Go Back Now
          </button>
        </div>
      </div>
    )
  }

  // ── Room layout ───────────────────────────────────────────────────────────

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">

      {/* Top Header */}
      <div className="px-4 py-3 flex justify-between items-center bg-gray-800 border-b border-gray-700 shrink-0">
        <div>
          <h2 className="text-lg font-semibold">{meeting?.title || 'Online Lecture'}</h2>
          <p className="text-sm text-gray-400">{meeting?.module?.moduleName}</p>
        </div>
        <div className="flex items-center space-x-3">
          {isSomeoneSharing && (
            <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-medium border border-yellow-500/40">
              <Share className="w-3 h-3" />
              {isLocalSharing ? 'You are sharing' : 'Screen sharing'}
            </span>
          )}
          <div className="flex items-center px-3 py-1 bg-gray-700 rounded-full border border-gray-600">
            <span className="text-sm font-mono mr-2">{meetingCode}</span>
            <button onClick={copyCode} className="hover:text-primary-400">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <Users className="w-4 h-4 mr-1" />
            <span>{peers.length + 1}</span>
          </div>
        </div>
      </div>

      {/* ── Body: video + optional chat panel ─────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── Video column ────────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {isSomeoneSharing ? (
            /* SPOTLIGHT LAYOUT */
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 p-3 flex items-center justify-center overflow-hidden">
                {isLocalSharing ? (
                  <div className="relative w-full h-full bg-gray-800 rounded-xl overflow-hidden border-2 border-yellow-400 shadow-2xl">
                    <video muted ref={userVideo} autoPlay playsInline className="w-full h-full object-contain" />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-yellow-500 text-gray-900 px-2.5 py-1 rounded-full text-xs font-bold">
                      <Share className="w-3 h-3" /> You · Sharing screen
                    </div>
                  </div>
                ) : sharingPeer ? (
                  <div className="relative w-full h-full">
                    <RemoteVideo peer={sharingPeer.peer} className="w-full h-full border-2 border-yellow-400" />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-yellow-500 text-gray-900 px-2.5 py-1 rounded-full text-xs font-bold">
                      <Share className="w-3 h-3" /> Participant · Sharing screen
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 text-gray-500">
                    <Share className="w-12 h-12 animate-pulse" />
                    <p className="text-sm">Waiting for screen share stream…</p>
                  </div>
                )}
              </div>
              {/* Thumbnail strip */}
              <div className="shrink-0 px-3 pb-3 flex gap-3 overflow-x-auto">
                {!isLocalSharing && (
                  <div className="relative w-40 aspect-video bg-gray-800 rounded-xl overflow-hidden border border-gray-600 shrink-0">
                    <video muted ref={userVideo} autoPlay playsInline className="w-full h-full object-cover mirror" />
                    <div className="absolute bottom-1.5 left-1.5 bg-black/60 px-2 py-0.5 rounded-md">
                      <span className="text-xs font-medium">You</span>
                    </div>
                    {!videoActive && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                        <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-lg font-bold">
                          {user?.firstName?.charAt(0)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {peers
                  .filter((p) => isLocalSharing || p.peerID !== screenSharingSocketId)
                  .map((p) => (
                    <RemoteVideo key={p.peerID} peer={p.peer} className="w-40 aspect-video shrink-0" />
                  ))}
              </div>
            </div>
          ) : (
            /* GRID LAYOUT */
            <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto content-start">
              <div className="relative aspect-video bg-gray-800 rounded-xl overflow-hidden shadow-lg border-2 border-primary-500">
                <video muted ref={userVideo} autoPlay playsInline className="w-full h-full object-cover mirror" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/50 px-3 py-1 rounded-lg">
                  <span className="text-xs font-medium">You</span>
                  {!micActive && <MicOff className="w-3 h-3 text-red-500" />}
                </div>
                {!videoActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-3xl font-bold">
                      {user?.firstName?.charAt(0)}
                    </div>
                  </div>
                )}
              </div>
              {peers.map((p) => (
                <RemoteVideo key={p.peerID} peer={p.peer} className="aspect-video" />
              ))}
            </div>
          )}
        </div>

        {/* ── Chat panel ──────────────────────────────────────────────────────── */}
        {chatOpen && (
          <div className="w-80 shrink-0 flex flex-col bg-gray-800 border-l border-gray-700">
            {/* Chat header */}
            <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 font-semibold">
                <MessageSquare className="w-4 h-4 text-primary-400" />
                Meeting Chat
              </div>
              <button onClick={() => setChatOpen(false)} className="text-gray-400 hover:text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
              {messages.length === 0 && (
                <p className="text-center text-gray-500 text-sm mt-8">
                  No messages yet. Say hello!
                </p>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.isLocal ? 'items-end' : 'items-start'}`}>
                  {/* sender name */}
                  <span className="text-xs text-gray-400 mb-1 px-1">
                    {msg.isLocal ? 'You' : msg.senderName}
                  </span>
                  {/* bubble */}
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm break-words ${
                      msg.isLocal
                        ? 'bg-primary-600 text-white rounded-tr-sm'
                        : 'bg-gray-700 text-gray-100 rounded-tl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                  {/* timestamp */}
                  <span className="text-xs text-gray-500 mt-1 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="px-3 py-3 border-t border-gray-700 flex gap-2 shrink-0">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 bg-gray-700 text-white placeholder-gray-400 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="p-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="px-6 py-4 bg-gray-800 border-t border-gray-700 flex justify-center items-center gap-3 shrink-0">
        <button
          onClick={toggleMic}
          className={`p-4 rounded-full transition ${micActive ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}
          title={micActive ? 'Mute' : 'Unmute'}
        >
          {micActive ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
        </button>

        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full transition ${videoActive ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}
          title={videoActive ? 'Turn off camera' : 'Turn on camera'}
        >
          {videoActive ? <VideoIcon className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
        </button>

        <button
          onClick={toggleScreenShare}
          className={`p-4 rounded-full transition ${
            isScreenSharing
              ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
          title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
        >
          <Share className="w-6 h-6" />
        </button>

        {/* Chat toggle with unread badge */}
        <button
          onClick={chatOpen ? () => setChatOpen(false) : openChat}
          className={`relative p-4 rounded-full transition ${
            chatOpen ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-700 hover:bg-gray-600'
          }`}
          title={chatOpen ? 'Close chat' : 'Open chat'}
        >
          <MessageSquare className="w-6 h-6" />
          {unreadCount > 0 && !chatOpen && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full px-1">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => navigate(-1)}
          className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition"
          title="Leave meeting"
        >
          <PhoneOff className="w-6 h-6" />
        </button>

        {user?.role === 'LECTURER' && meeting?.lecturer?.user?.id === user?.id && (
          <button
            onClick={handleEndMeeting}
            className="px-5 py-4 rounded-full bg-red-600 hover:bg-red-700 transition text-white font-bold flex items-center"
            title="End meeting for all"
          >
            <PhoneOff className="w-5 h-5 mr-2" />
            End Meeting
          </button>
        )}
      </div>
    </div>
  )
}

export default VideoRoom
