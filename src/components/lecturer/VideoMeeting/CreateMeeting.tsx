import React, { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import Peer from 'simple-peer'

interface VideoRoomProps {
  meetingCode: string
  isLecturer: boolean
}

const VideoRoom: React.FC<VideoRoomProps> = ({ meetingCode, isLecturer }) => {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [micEnabled, setMicEnabled] = useState(true)
  const [camEnabled, setCamEnabled] = useState(true)
  const [peers, setPeers] = useState<Peer.Instance[]>([])

  const socketRef = useRef<Socket | null>(null)
  const userVideo = useRef<HTMLVideoElement>(null)
  const peersRef = useRef<{ peerID: string; peer: Peer.Instance }[]>([])

  useEffect(() => {
    let currentStream: MediaStream | null = null

    const init = async () => {
      try {
        currentStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        })

        setStream(currentStream)
        if (userVideo.current) {
          userVideo.current.srcObject = currentStream
        }

        // You should use real auth context here in real app
        const token = localStorage.getItem('token') || ''

        const socket = io(
          process.env.REACT_APP_API_URL || 'http://localhost:5000',
          {
            auth: { token },
            reconnection: true,
            reconnectionAttempts: 5,
          }
        )

        socketRef.current = socket

        socket.emit('join-meeting', {
          meetingCode,
          userId: 'temp-user-id', // ← REPLACE with real user id from auth
          userName: 'You', // ← REPLACE with real name
          role: isLecturer ? 'LECTURER' : 'STUDENT',
        })

        socket.on('all-users', (users: { id: string }[]) => {
          const newPeers: Peer.Instance[] = []
          users.forEach(({ id }) => {
            if (id === socket.id) return // skip self
            const peer = createPeer(id, stream!)
            peersRef.current.push({ peerID: id, peer })
            newPeers.push(peer)
          })
          setPeers(newPeers)
        })

        socket.on(
          'user-joined',
          (payload: { signal: any; callerID: string }) => {
            const peer = addPeer(payload.signal, payload.callerID, stream!)
            peersRef.current.push({ peerID: payload.callerID, peer })
            setPeers((prev) => [...prev, peer])
          }
        )

        socket.on(
          'receiving-returned-signal',
          (payload: { signal: any; id: string }) => {
            const item = peersRef.current.find((p) => p.peerID === payload.id)
            if (item) item.peer.signal(payload.signal)
          }
        )

        socket.on('user-left', (id: string) => {
          const peerObj = peersRef.current.find((p) => p.peerID === id)
          if (peerObj) {
            peerObj.peer.destroy()
            peersRef.current = peersRef.current.filter((p) => p.peerID !== id)
            setPeers((prev) => prev.filter((p) => p !== peerObj.peer))
          }
        })
      } catch (err) {
        console.error('Failed to get media devices:', err)
        alert('Cannot access camera or microphone. Please check permissions.')
      }
    }

    init()

    return () => {
      // Cleanup
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
      peersRef.current.forEach(({ peer }) => peer.destroy())
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [meetingCode, isLecturer])

  const createPeer = (userToSignal: string, stream: MediaStream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          // You can add your own TURN server here in production
        ],
      },
    })

    peer.on('signal', (signal) => {
      socketRef.current?.emit('sending-signal', {
        userToSignal,
        callerID: socketRef.current.id,
        signal,
      })
    })

    return peer
  }

  const addPeer = (
    incomingSignal: any,
    callerID: string,
    stream: MediaStream
  ) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
      config: {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      },
    })

    peer.on('signal', (signal) => {
      socketRef.current?.emit('returning-signal', { signal, id: callerID })
    })

    peer.signal(incomingSignal)

    return peer
  }

  const toggleMic = () => {
    if (!stream) return
    const audioTrack = stream.getAudioTracks()[0]
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled
      setMicEnabled(audioTrack.enabled)
    }
  }

  const toggleCam = () => {
    if (!stream) return
    const videoTrack = stream.getVideoTracks()[0]
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled
      setCamEnabled(videoTrack.enabled)
    }
  }

  const handleLeave = () => {
    // You can add confirmation dialog here if you want
    window.location.href = '/' // or your home route
  }

  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col">
      {/* Video Grid */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-4 overflow-auto">
        {/* Local Video */}
        <div className="relative bg-black rounded-xl overflow-hidden shadow-lg">
          <video
            ref={userVideo}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 left-3 bg-black/70 px-3 py-1 rounded-md text-sm">
            You {isLecturer ? '(Host)' : '(You)'}
          </div>
        </div>

        {/* Remote Peers */}
        {peers.map((peer, index) => (
          <Video key={index} peer={peer} />
        ))}
      </div>

      {/* Bottom Controls */}
      <div className="bg-gray-900/90 backdrop-blur-sm border-t border-gray-800 p-5 flex justify-center items-center gap-5 md:gap-8">
        <button
          onClick={toggleMic}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
            micEnabled
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'bg-red-600/90 hover:bg-red-700'
          }`}
        >
          {micEnabled ? 'Mute Mic' : 'Unmute Mic'}
        </button>

        <button
          onClick={toggleCam}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
            camEnabled
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'bg-red-600/90 hover:bg-red-700'
          }`}
        >
          {camEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
        </button>

        <button
          onClick={handleLeave}
          className="flex items-center gap-2 px-8 py-3 rounded-full font-medium bg-red-700 hover:bg-red-800 transition-all"
        >
          Leave Meeting
        </button>
      </div>
    </div>
  )
}

interface VideoProps {
  peer: Peer.Instance
}

const Video: React.FC<VideoProps> = ({ peer }) => {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    peer.on('stream', (stream) => {
      if (ref.current) {
        ref.current.srcObject = stream
      }
    })

    return () => {
      peer.removeAllListeners()
    }
  }, [peer])

  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      className="w-full h-full object-cover rounded-xl bg-black shadow-lg"
    />
  )
}

export default VideoRoom
