"use client"

import { db } from "./firebase"
import { collection, addDoc, onSnapshot, serverTimestamp } from "firebase/firestore"

export interface WebRTCSignal {
  id: string
  chatRoomId: string
  senderId: string
  receiverId: string
  type: "offer" | "answer" | "ice-candidate" | "call-request" | "call-accept" | "call-reject" | "call-end"
  data?: any
  timestamp: any
}

export class WebRTCManager {
  private peerConnection: RTCPeerConnection | null = null
  private localStream: MediaStream | null = null
  private remoteStream: MediaStream | null = null
  private chatRoomId: string
  private userId: string
  private remoteUserId: string
  private onRemoteStreamCallback?: (stream: MediaStream) => void
  private onCallEndCallback?: () => void
  private signalUnsubscribe?: () => void

  constructor(chatRoomId: string, userId: string, remoteUserId: string) {
    this.chatRoomId = chatRoomId
    this.userId = userId
    this.remoteUserId = remoteUserId
  }

  async initialize() {
    // Create peer connection with STUN servers
    this.peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
    })

    // Handle remote stream
    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0]
      if (this.onRemoteStreamCallback) {
        this.onRemoteStreamCallback(this.remoteStream)
      }
    }

    // Handle ICE candidates
    this.peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        await this.sendSignal("ice-candidate", {
          candidate: {
            candidate: event.candidate.candidate,
            sdpMLineIndex: event.candidate.sdpMLineIndex,
            sdpMid: event.candidate.sdpMid,
          },
        })
      }
    }

    // Listen for signaling messages
    this.listenForSignals()
  }

  async startLocalStream(video = true, audio = true) {
    try {
      // First, try to stop any existing streams to free up devices
      if (this.localStream) {
        this.localStream.getTracks().forEach((track) => track.stop())
        this.localStream = null
      }

      // Try to get user media with fallback options
      let constraints = {
        video: video ? { 
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          facingMode: "user"
        } : false,
        audio: audio ? {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } : false,
      }

      try {
        this.localStream = await navigator.mediaDevices.getUserMedia(constraints)
      } catch (error) {
        console.warn("Failed with ideal constraints, trying fallback:", error)
        
        // Fallback to basic constraints
        const fallbackConstraints = {
          video: video ? true : false,
          audio: audio ? true : false,
        }
        
        this.localStream = await navigator.mediaDevices.getUserMedia(fallbackConstraints)
      }

      // Add local stream to peer connection
      if (this.peerConnection) {
        this.localStream.getTracks().forEach((track) => {
          this.peerConnection!.addTrack(track, this.localStream!)
        })
      }

      return this.localStream
    } catch (error) {
      console.error("Error accessing media devices:", error)
      
      // Provide more helpful error messages
      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          throw new Error("Camera/microphone access denied. Please allow permissions and try again.")
        } else if (error.name === "NotFoundError") {
          throw new Error("No camera or microphone found. Please check your device.")
        } else if (error.name === "NotReadableError") {
          throw new Error("Camera/microphone is in use by another application. Please close other apps using camera/mic and try again.")
        } else if (error.name === "OverconstrainedError") {
          throw new Error("Camera/microphone doesn't meet requirements. Please check your device settings.")
        } else if (error.name === "TypeError") {
          throw new Error("Invalid media constraints. Please check your browser settings.")
        }
      }
      
      throw new Error("Failed to access camera/microphone. Please check permissions and try again.")
    }
  }

  async createOffer() {
    if (!this.peerConnection) throw new Error("Peer connection not initialized")

    const offer = await this.peerConnection.createOffer()
    await this.peerConnection.setLocalDescription(offer)

    await this.sendSignal("offer", {
      offer: {
        type: offer.type,
        sdp: offer.sdp,
      },
    })
  }

  async createAnswer(offer: RTCSessionDescriptionInit) {
    if (!this.peerConnection) throw new Error("Peer connection not initialized")

    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
    const answer = await this.peerConnection.createAnswer()
    await this.peerConnection.setLocalDescription(answer)

    await this.sendSignal("answer", {
      answer: {
        type: answer.type,
        sdp: answer.sdp,
      },
    })
  }

  async handleAnswer(answer: RTCSessionDescriptionInit) {
    if (!this.peerConnection) throw new Error("Peer connection not initialized")

    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
  }

  async handleIceCandidate(candidate: RTCIceCandidateInit) {
    if (!this.peerConnection) throw new Error("Peer connection not initialized")

    await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
  }

  async sendCallRequest() {
    await this.sendSignal("call-request", {})
  }

  async acceptCall() {
    await this.sendSignal("call-accept", {})
  }

  async rejectCall() {
    await this.sendSignal("call-reject", {})
  }

  async endCall() {
    await this.sendSignal("call-end", {})
    this.cleanup()
  }

  private async sendSignal(type: WebRTCSignal["type"], data: any) {
    try {
      await addDoc(collection(db, "webrtcSignals"), {
        chatRoomId: this.chatRoomId,
        senderId: this.userId,
        receiverId: this.remoteUserId,
        type,
        data,
        timestamp: serverTimestamp(),
      })
    } catch (error) {
      console.error("Error sending signal:", error)
    }
  }

  private listenForSignals() {
    const signalsRef = collection(db, "webrtcSignals")

    this.signalUnsubscribe = onSnapshot(signalsRef, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          const signal = { id: change.doc.id, ...change.doc.data() } as WebRTCSignal

          // Only process signals meant for this user
          if (signal.receiverId === this.userId && signal.chatRoomId === this.chatRoomId) {
            await this.handleSignal(signal)
          }
        }
      })
    })
  }

  private async handleSignal(signal: WebRTCSignal) {
    try {
      switch (signal.type) {
        case "offer":
          await this.createAnswer(signal.data.offer)
          break
        case "answer":
          await this.handleAnswer(signal.data.answer)
          break
        case "ice-candidate":
          await this.handleIceCandidate(signal.data.candidate)
          break
        case "call-end":
          if (this.onCallEndCallback) {
            this.onCallEndCallback()
          }
          this.cleanup()
          break
      }
    } catch (error) {
      console.error("Error handling signal:", error)
    }
  }

  toggleAudio() {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        return audioTrack.enabled
      }
    }
    return false
  }

  toggleVideo() {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        return videoTrack.enabled
      }
    }
    return false
  }

  cleanup() {
    // Stop all local tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        track.stop();
      });
      this.localStream = null;
    }

    // Close peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    // Clear callbacks
    this.onRemoteStreamCallback = undefined;
    this.onCallEndCallback = undefined;
  }

  onRemoteStream(callback: (stream: MediaStream) => void) {
    this.onRemoteStreamCallback = callback
  }

  onCallEnd(callback: () => void) {
    this.onCallEndCallback = callback
  }

  getLocalStream() {
    return this.localStream
  }

  getRemoteStream() {
    return this.remoteStream
  }

  // Check if devices are available
  async checkDeviceAvailability() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter(device => device.kind === 'videoinput')
      const audioDevices = devices.filter(device => device.kind === 'audioinput')
      
      return {
        hasVideo: videoDevices.length > 0,
        hasAudio: audioDevices.length > 0,
        videoDevices: videoDevices.length,
        audioDevices: audioDevices.length
      }
    } catch (error) {
      console.error("Error checking device availability:", error)
      return {
        hasVideo: false,
        hasAudio: false,
        videoDevices: 0,
        audioDevices: 0
      }
    }
  }

  // Force stop all tracks (emergency cleanup)
  forceStopAllTracks() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        track.stop();
      });
      this.localStream = null;
    }
  }
}
