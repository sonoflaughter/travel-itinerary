import type { Trip } from "@/lib/data"

// Define action types
export type ActionType = "CREATE" | "UPDATE" | "DELETE"

// Define entity types
export type EntityType = "TRIP" | "FLIGHT" | "ACCOMMODATION" | "ACTIVITY"

// Define history entry structure
export interface HistoryEntry {
  id: string
  timestamp: number
  actionType: ActionType
  entityType: EntityType
  entityId: string
  tripId: string
  previousState: any
  currentState: any
}

/**
 * Service for managing history and undo functionality
 */
export const HistoryService = {
  /**
   * Get all history entries
   */
  getHistory: (): HistoryEntry[] => {
    const historyJson = localStorage.getItem("history")
    return historyJson ? JSON.parse(historyJson) : []
  },

  /**
   * Add a history entry
   */
  addEntry: (
    actionType: ActionType,
    entityType: EntityType,
    entityId: string,
    tripId: string,
    previousState: any,
    currentState: any,
  ): HistoryEntry => {
    const history = HistoryService.getHistory()

    // Limit history to last 20 entries
    if (history.length >= 20) {
      history.pop() // Remove oldest entry
    }

    const entry: HistoryEntry = {
      id: `history-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: Date.now(),
      actionType,
      entityType,
      entityId,
      tripId,
      previousState,
      currentState,
    }

    const updatedHistory = [entry, ...history]
    localStorage.setItem("history", JSON.stringify(updatedHistory))

    return entry
  },

  /**
   * Get the most recent history entry
   */
  getLatestEntry: (): HistoryEntry | undefined => {
    const history = HistoryService.getHistory()
    return history.length > 0 ? history[0] : undefined
  },

  /**
   * Remove a history entry by ID
   */
  removeEntry: (entryId: string): boolean => {
    const history = HistoryService.getHistory()
    const updatedHistory = history.filter((entry) => entry.id !== entryId)

    if (updatedHistory.length === history.length) {
      return false
    }

    localStorage.setItem("history", JSON.stringify(updatedHistory))
    return true
  },

  /**
   * Undo the most recent action
   */
  undoLatestAction: (): boolean => {
    const latestEntry = HistoryService.getLatestEntry()
    if (!latestEntry) return false

    // Restore previous state based on entity type
    switch (latestEntry.entityType) {
      case "TRIP": {
        const tripsJson = localStorage.getItem("trips")
        if (!tripsJson) return false

        const trips: Trip[] = JSON.parse(tripsJson)

        if (latestEntry.actionType === "DELETE") {
          // Restore deleted trip
          trips.push(latestEntry.previousState)
        } else if (latestEntry.actionType === "UPDATE") {
          // Restore previous trip state
          const tripIndex = trips.findIndex((t) => t.id === latestEntry.entityId)
          if (tripIndex >= 0) {
            trips[tripIndex] = latestEntry.previousState
          } else {
            return false
          }
        } else if (latestEntry.actionType === "CREATE") {
          // Remove created trip
          const filteredTrips = trips.filter((t) => t.id !== latestEntry.entityId)
          if (filteredTrips.length === trips.length) {
            return false
          }
          localStorage.setItem("trips", JSON.stringify(filteredTrips))
          HistoryService.removeEntry(latestEntry.id)
          return true
        }

        localStorage.setItem("trips", JSON.stringify(trips))
        break
      }

      case "FLIGHT":
      case "ACCOMMODATION":
      case "ACTIVITY": {
        const tripsJson = localStorage.getItem("trips")
        if (!tripsJson) return false

        const trips: Trip[] = JSON.parse(tripsJson)
        const tripIndex = trips.findIndex((t) => t.id === latestEntry.tripId)

        if (tripIndex < 0) return false

        const trip = trips[tripIndex]
        let itemsKey: "flights" | "accommodations" | "activities"

        switch (latestEntry.entityType) {
          case "FLIGHT":
            itemsKey = "flights"
            break
          case "ACCOMMODATION":
            itemsKey = "accommodations"
            break
          case "ACTIVITY":
            itemsKey = "activities"
            break
        }

        if (latestEntry.actionType === "DELETE") {
          // Restore deleted item
          if (!trip[itemsKey]) {
            trip[itemsKey] = []
          }
          trip[itemsKey].push(latestEntry.previousState)
        } else if (latestEntry.actionType === "UPDATE") {
          // Restore previous item state
          if (!trip[itemsKey]) return false

          const itemIndex = trip[itemsKey].findIndex((item: any) => item.id === latestEntry.entityId)
          if (itemIndex >= 0) {
            trip[itemsKey][itemIndex] = latestEntry.previousState
          } else {
            return false
          }
        } else if (latestEntry.actionType === "CREATE") {
          // Remove created item
          if (!trip[itemsKey]) return false

          trip[itemsKey] = trip[itemsKey].filter((item: any) => item.id !== latestEntry.entityId)
        }

        trips[tripIndex] = trip
        localStorage.setItem("trips", JSON.stringify(trips))
        break
      }

      default:
        return false
    }

    // Remove the entry after successful undo
    HistoryService.removeEntry(latestEntry.id)
    return true
  },
}

