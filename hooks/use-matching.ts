"use client"

import { useEffect, useState, useCallback } from "react"
import {
  joinMatchingQueue,
  leaveMatchingQueue,
  findRandomMatch,
  createMatchAndChatRoom,
  getMatchingQueueStatus,
  type MatchingQueue,
} from "@/lib/firebase-utils"

export function useMatching(userId: string, userDetails: MatchingQueue["userDetails"]) {
  const [isSearching, setIsSearching] = useState(false)
  const [matchingStatus, setMatchingStatus] = useState<MatchingQueue | null>(null)
  const [matchFound, setMatchFound] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Subscribe to matching queue status
  useEffect(() => {
    if (!userId) return

    const unsubscribe = getMatchingQueueStatus(userId, (status) => {
      setMatchingStatus(status)

      if (status?.status === "matched" && status.chatRoomId) {
        setMatchFound(status.chatRoomId)
        setIsSearching(false)
      }
    })

    return unsubscribe
  }, [userId])

  const startMatching = useCallback(
    async (
      preferences: MatchingQueue["preferences"] = {
        roles: [],
        skipPreviousMatches: true,
      },
    ) => {
      if (!userId || !userDetails) return

      try {
        setIsSearching(true)
        setError(null)
        setMatchFound(null)

        // Join matching queue
        await joinMatchingQueue(userId, userDetails, preferences)

        // Start polling for matches
        const pollForMatch = async () => {
          try {
            const match = await findRandomMatch(userId, preferences)

            if (match) {
              // Create chat room with the match
              const chatRoomId = await createMatchAndChatRoom(userId, match.userId, userDetails, match.userDetails)

              setMatchFound(chatRoomId)
              setIsSearching(false)
            } else {
              // Continue polling if no match found
              setTimeout(pollForMatch, 3000) // Poll every 3 seconds
            }
          } catch (err) {
            console.error("Error polling for match:", err)
            setError("Failed to find a match. Please try again.")
            setIsSearching(false)
          }
        }

        // Start polling after a short delay
        setTimeout(pollForMatch, 2000)
      } catch (err) {
        console.error("Error starting matching:", err)
        setError("Failed to start matching. Please try again.")
        setIsSearching(false)
      }
    },
    [userId, userDetails],
  )

  const stopMatching = useCallback(async () => {
    if (!userId) return

    try {
      await leaveMatchingQueue(userId)
      setIsSearching(false)
      setMatchFound(null)
      setError(null)
    } catch (err) {
      console.error("Error stopping matching:", err)
      setError("Failed to stop matching.")
    }
  }, [userId])

  const resetMatch = useCallback(() => {
    setMatchFound(null)
    setError(null)
  }, [])

  return {
    isSearching,
    matchingStatus,
    matchFound,
    error,
    startMatching,
    stopMatching,
    resetMatch,
  }
}
