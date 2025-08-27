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
          candidate: event.candidate.toJSON(),
        })
      }
    }

    // Listen for signaling messages
    this.listenForSignals()
  }

  async startLocalStream(video = true, audio = true) {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: video ? { width: 1280, height: 720 } : false,
        audio,
      })

      // Add local stream to peer connection
      if (this.peerConnection) {
        this.localStream.getTracks().forEach((track) => {
          this.peerConnection!.addTrack(track, this.localStream!)
        })
      }

      return this.localStream
    } catch (error) {
      console.error("Error accessing media devices:", error)
      throw error
    }
  }

  async createOffer() {
    if (!this.peerConnection) throw new Error("Peer connection not initialized")

    const offer = await this.peerConnection.createOffer()
    await this.peerConnection.setLocalDescription(offer)

    await this.sendSignal("offer", {
      offer: offer.toJSON(),
    })
  }

  async createAnswer(offer: RTCSessionDescriptionInit) {
    if (!this.peerConnection) throw new Error("Peer connection not initialized")

    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
    const answer = await this.peerConnection.createAnswer()
    await this.peerConnection.setLocalDescription(answer)

    await this.sendSignal("answer", {
      answer: answer.toJSON(),
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
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
      this.localStream = null
    }

    if (this.peerConnection) {
      this.peerConnection.close()
      this.peerConnection = null
    }

    if (this.signalUnsubscribe) {
      this.signalUnsubscribe()
    }
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
}
