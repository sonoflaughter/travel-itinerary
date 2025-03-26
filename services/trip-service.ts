import type { Trip } from "@/lib/data"
import { HistoryService } from "./history-service"

// Initialize localStorage with sample data if it doesn't exist
const initializeLocalStorage = () => {
  if (!localStorage.getItem("trips")) {
    // Use the initial data from lib/data.ts as a starting point
    // In a real app, this would be empty until the user creates trips
    const initialTripsJson = localStorage.getItem("initialTrips")
    if (initialTripsJson) {
      localStorage.setItem("trips", initialTripsJson)
    } else {
      localStorage.setItem("trips", JSON.stringify([]))
    }
  }
}

/**
 * Service for managing trips
 */
export const TripService = {
  /**
   * Get all trips
   */
  getTrips: (): Trip[] => {
    initializeLocalStorage()
    const tripsJson = localStorage.getItem("trips")
    return tripsJson ? JSON.parse(tripsJson) : []
  },

  /**
   * Get a trip by ID
   */
  getTripById: (id: string): Trip | undefined => {
    const trips = TripService.getTrips()
    return trips.find((trip) => trip.id === id)
  },

  /**
   * Create a new trip
   */
  createTrip: (tripData: Omit<Trip, "id">): Trip => {
    const trips = TripService.getTrips()

    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      ...tripData,
      flights: [],
      accommodations: [],
      activities: [],
    }

    const updatedTrips = [...trips, newTrip]
    localStorage.setItem("trips", JSON.stringify(updatedTrips))

    // Add history entry
    HistoryService.addEntry("CREATE", "TRIP", newTrip.id, newTrip.id, null, newTrip)

    return newTrip
  },

  /**
   * Update an existing trip
   */
  updateTrip: (id: string, tripData: Partial<Trip>): Trip | undefined => {
    const trips = TripService.getTrips()

    const tripIndex = trips.findIndex((trip) => trip.id === id)
    if (tripIndex === -1) return undefined

    // Store previous state for history
    const previousState = { ...trips[tripIndex] }

    const updatedTrip = {
      ...trips[tripIndex],
      ...tripData,
    }

    const updatedTrips = [...trips.slice(0, tripIndex), updatedTrip, ...trips.slice(tripIndex + 1)]

    localStorage.setItem("trips", JSON.stringify(updatedTrips))

    // Add history entry
    HistoryService.addEntry("UPDATE", "TRIP", id, id, previousState, updatedTrip)

    return updatedTrip
  },

  /**
   * Delete a trip
   */
  deleteTrip: (id: string): boolean => {
    const trips = TripService.getTrips()

    // Find the trip to be deleted for history
    const tripToDelete = trips.find((trip) => trip.id === id)
    if (!tripToDelete) return false

    const initialLength = trips.length
    const updatedTrips = trips.filter((trip) => trip.id !== id)

    localStorage.setItem("trips", JSON.stringify(updatedTrips))

    const success = updatedTrips.length < initialLength

    if (success) {
      // Add history entry
      HistoryService.addEntry("DELETE", "TRIP", id, id, tripToDelete, null)
    }

    return success
  },

  /**
   * Share a trip with another user
   */
  shareTrip: (tripId: string, email: string, permission: "view" | "edit" | "comment"): boolean => {
    // In a real app, this would send an invitation or update permissions in a database
    console.log(`Shared trip ${tripId} with ${email} (${permission} permission)`)

    return true
  },
}

