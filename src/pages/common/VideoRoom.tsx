import React, { useEffect, useRef, useState } from 'react'
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
  MessageSquare,
  Settings,
  Copy,
  Check,
} from 'lucide-react'
import toast from 'react-hot-toast'

const VideoRoom: React.FC = () => {
  const { meetingCode } = useParams<{ meetingCode: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [micActive, setMicActive] = useState(true)
  const [videoActive, setVideoActive] = useState(true)
  const [peers, setPeers] = useState<any[]>([])
  const [meeting, setMeeting] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const [meetingEnded, setMeetingEnded] = useState(false)

  const socketRef = useRef<any>()
  const userVideo = useRef<HTMLVideoElement>(null)
  const peersRef = useRef<any[]>([])
  const streamRef = useRef<MediaStream>()

  useEffect(() => {
    if (!meetingCode) return
    fetchMeetingDetails()

    // Connect to signaling server
    socketRef.current = io('http://localhost:5000') // Ensure this matches backend URL

    const currentSocket = socketRef.current

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        streamRef.current = stream
        if (userVideo.current) {
          userVideo.current.srcObject = stream
        }

        currentSocket.emit('join-meeting', {
          meetingCode,
          userId: user?.id,
          userName: `${user?.firstName} ${user?.lastName}`,
        })

        currentSocket.on('all-users', (users: any[]) => {
          const peers: any[] = []
          users.forEach((userObj: any) => {
            const peer = createPeer(userObj.id, currentSocket.id, stream)
            peersRef.current.push({
              peerID: userObj.id,
              peer,
            })
            peers.push({
              peerID: userObj.id,
              peer,
            })
          })
          setPeers(peers)
        })

        currentSocket.on('user-joined', (payload: any) => {
          // If signal is present, it's a WebRTC signaling event
          if (payload.signal) {
            const peer = addPeer(payload.signal, payload.callerID, stream)
            peersRef.current.push({
              peerID: payload.callerID,
              peer,
            })
            setPeers((users) => [...users, { peerID: payload.callerID, peer }])
          }
        })

        currentSocket.on('receiving-returned-signal', (payload: any) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id)
          if (item) {
            item.peer.signal(payload.signal)
          }
        })

        currentSocket.on('user-left', (id: string) => {
          const peerObj = peersRef.current.find((p) => p.peerID === id)
          if (peerObj) peerObj.peer.destroy()
          const updatedPeers = peersRef.current.filter((p) => p.peerID !== id)
          peersRef.current = updatedPeers
          setPeers(updatedPeers)
        })

        currentSocket.on('meeting-ended', () => {
          setMeetingEnded(true)
          toast.error('The meeting has been ended by the host', { duration: 5000 })
          // Stop media stream immediately
          stream.getTracks().forEach(track => track.stop())
        })
      })
      .catch((err) => {
        console.error('Failed to get media devices:', err)
        toast.error('Could not access camera/microphone')
      })

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop())
      if (meeting) {
        axiosInstance.post(`/video-meetings/${meeting.id}/leave`).catch(console.error)
      }
      currentSocket?.disconnect()
    }
  }, [meetingCode, meeting?.id, user?.id, user?.firstName, user?.lastName])

  const fetchMeetingDetails = async () => {
    try {
      const response = await axiosInstance.get(
        `/video-meetings/code/${meetingCode}`
      )
      const meetingData = response.data.data.meeting

      if (!meetingData.isActive) {
        setMeetingEnded(true)
        return
      }

      setMeeting(meetingData)

      // Mark as joined in DB
      await axiosInstance.post(`/video-meetings/${meetingData.id}/join`)
    } catch (error) {
      toast.error('Meeting not found or expired')
      navigate('/lecturer/dashboard')
    }
  }

  function createPeer(
    userToSignal: string,
    callerID: string,
    stream: MediaStream
  ) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    })

    peer.on('signal', (signal) => {
      socketRef.current.emit('sending-signal', {
        userToSignal,
        callerID,
        signal,
      })
    })

    return peer
  }

  function addPeer(incomingSignal: any, callerID: string, stream: MediaStream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    })

    peer.on('signal', (signal) => {
      socketRef.current.emit('returning-signal', { signal, callerID })
    })

    peer.signal(incomingSignal)

    return peer
  }

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

  const leaveMeeting = () => {
    navigate(-1)
  }

  const handleEndMeeting = async () => {
    if (!meeting) return
    if (!window.confirm('Are you sure you want to end this meeting for everyone?')) return

    try {
      await axiosInstance.put(`/video-meetings/${meeting.id}/end`)
      toast.success('Meeting ended')
      navigate(user?.role === 'LECTURER' ? '/lecturer/classes' : '/student/courses')
    } catch (error) {
      toast.error('Failed to end meeting')
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(meetingCode || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Meeting code copied!')
  }

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

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Top Header */}
      <div className="p-4 flex justify-between items-center bg-gray-800 border-b border-gray-700">
        <div>
          <h2 className="text-lg font-semibold">
            {meeting?.title || 'Online Lecture'}
          </h2>
          <p className="text-sm text-gray-400">{meeting?.module?.moduleName}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center px-3 py-1 bg-gray-700 rounded-full border border-gray-600">
            <span className="text-sm font-mono mr-2">{meetingCode}</span>
            <button onClick={copyCode} className="hover:text-primary-400">
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <Users className="w-4 h-4 mr-1" />
            <span>{peers.length + 1}</span>
          </div>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto content-start">
        {/* Local Video */}
        <div className="relative aspect-video bg-gray-800 rounded-xl overflow-hidden border-2 border-primary-500 shadow-lg">
          <video
            muted
            ref={userVideo}
            autoPlay
            playsInline
            className="w-full h-full object-cover mirror"
          />
          <div className="absolute bottom-4 left-4 flex items-center bg-black bg-opacity-50 px-3 py-1 rounded-lg">
            <span className="text-xs font-medium">You (Host)</span>
            {!micActive && <MicOff className="w-3 h-3 ml-2 text-red-500" />}
          </div>
          {!videoActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-3xl font-bold">
                {user?.firstName?.charAt(0)}
              </div>
            </div>
          )}
        </div>

        {/* Remote Videos */}
        {peers.map((peer, index) => (
          <Video key={index} peer={peer.peer} />
        ))}
      </div>

      {/* Bottom Controls */}
      <div className="p-6 bg-gray-800 border-t border-gray-700 flex justify-center items-center space-x-6">
        <button
          onClick={toggleMic}
          className={`p-4 rounded-full transition ${
            micActive
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          {micActive ? (
            <Mic className="w-6 h-6" />
          ) : (
            <MicOff className="w-6 h-6" />
          )}
        </button>
        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full transition ${
            videoActive
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          {videoActive ? (
            <VideoIcon className="w-6 h-6" />
          ) : (
            <VideoOff className="w-6 h-6" />
          )}
        </button>
        <button
          className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition"
          title="Share Screen"
        >
          <Share className="w-6 h-6" />
        </button>
        <button
          onClick={leaveMeeting}
          className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition"
          title="Leave Meeting"
        >
          <PhoneOff className="w-6 h-6" />
        </button>

        {user?.role === 'LECTURER' && meeting?.lecturer?.user?.id === user?.id && (
          <button
            onClick={handleEndMeeting}
            className="px-6 py-4 rounded-full bg-red-600 hover:bg-red-700 transition text-white font-bold flex items-center"
            title="End Meeting for All"
          >
            <PhoneOff className="w-6 h-6 mr-2" />
            End Meeting
          </button>
        )}
      </div>
    </div>
  )
}

const Video = (props: any) => {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    props.peer.on('stream', (stream: any) => {
      if (ref.current) {
        ref.current.srcObject = stream
      }
    })
  }, [props.peer])

  return (
    <div className="relative aspect-video bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg">
      <video
        playsInline
        autoPlay
        ref={ref}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-lg">
        <span className="text-xs font-medium">Participant</span>
      </div>
    </div>
  )
}

export default VideoRoom
