import type { Flight } from "@/lib/data"
import { TripService } from "./trip-service"
import { HistoryService } from "./history-service"

/**
 * Service for managing flights
 */
export const FlightService = {
  /**
   * Get all flights for a trip
   */
  getFlights: (tripId: string): Flight[] => {
    const trip = TripService.getTripById(tripId)
    return trip?.flights || []
  },

  /**
   * Get a flight by ID
   */
  getFlightById: (tripId: string, flightId: string): Flight | undefined => {
    const trip = TripService.getTripById(tripId)
    return trip?.flights?.find((flight) => flight.id === flightId)
  },

  /**
   * Add a flight to a trip
   */
  addFlight: (tripId: string, flightData: Omit<Flight, "id">): Flight | undefined => {
    const trip = TripService.getTripById(tripId)
    if (!trip) return undefined

    const newFlight: Flight = {
      id: `flight-${Date.now()}`,
      ...flightData,
    }

    const flights = [...(trip.flights || []), newFlight]
    TripService.updateTrip(tripId, { flights })

    // Add history entry
    HistoryService.addEntry("CREATE", "FLIGHT", newFlight.id, tripId, null, newFlight)

    return newFlight
  },

  /**
   * Update a flight
   */
  updateFlight: (tripId: string, flightId: string, flightData: Partial<Flight>): Flight | undefined => {
    const trip = TripService.getTripById(tripId)
    if (!trip || !trip.flights) return undefined

    const flightIndex = trip.flights.findIndex((flight) => flight.id === flightId)
    if (flightIndex === -1) return undefined

    // Store previous state for history
    const previousState = { ...trip.flights[flightIndex] }

    const updatedFlight = {
      ...trip.flights[flightIndex],
      ...flightData,
    }

    const updatedFlights = [
      ...trip.flights.slice(0, flightIndex),
      updatedFlight,
      ...trip.flights.slice(flightIndex + 1),
    ]

    TripService.updateTrip(tripId, { flights: updatedFlights })

    // Add history entry
    HistoryService.addEntry("UPDATE", "FLIGHT", flightId, tripId, previousState, updatedFlight)

    return updatedFlight
  },

  /**
   * Delete a flight
   */
  deleteFlight: (tripId: string, flightId: string): boolean => {
    const trip = TripService.getTripById(tripId)
    if (!trip || !trip.flights) return false

    // Find the flight to be deleted for history
    const flightToDelete = trip.flights.find((flight) => flight.id === flightId)
    if (!flightToDelete) return false

    const updatedFlights = trip.flights.filter((flight) => flight.id !== flightId)

    if (updatedFlights.length === trip.flights.length) {
      return false
    }

    TripService.updateTrip(tripId, { flights: updatedFlights })

    // Add history entry
    HistoryService.addEntry("DELETE", "FLIGHT", flightId, tripId, flightToDelete, null)

    return true
  },

  /**
   * Check if a flight date is valid for a trip
   */
  validateFlightDates: (tripStartDate: string, tripEndDate: string, flightDate: string): boolean => {
    const start = new Date(tripStartDate)
    const end = new Date(tripEndDate)
    const date = new Date(flightDate)

    // Allow flights 1 day before or after the trip for travel
    const extendedStart = new Date(start)
    extendedStart.setDate(extendedStart.getDate() - 1)

    const extendedEnd = new Date(end)
    extendedEnd.setDate(extendedEnd.getDate() + 1)

    return date >= extendedStart && date <= extendedEnd
  },
}

