import type { Accommodation } from "@/lib/data"
import { TripService } from "./trip-service"
import { HistoryService } from "./history-service"

/**
 * Service for managing accommodations
 */
export const AccommodationService = {
  /**
   * Get all accommodations for a trip
   */
  getAccommodations: (tripId: string): Accommodation[] => {
    const trip = TripService.getTripById(tripId)
    return trip?.accommodations || []
  },

  /**
   * Get an accommodation by ID
   */
  getAccommodationById: (tripId: string, accommodationId: string): Accommodation | undefined => {
    const trip = TripService.getTripById(tripId)
    return trip?.accommodations?.find((accommodation) => accommodation.id === accommodationId)
  },

  /**
   * Add an accommodation to a trip
   */
  addAccommodation: (tripId: string, accommodationData: Omit<Accommodation, "id">): Accommodation | undefined => {
    const trip = TripService.getTripById(tripId)
    if (!trip) return undefined

    const newAccommodation: Accommodation = {
      id: `accom-${Date.now()}`,
      ...accommodationData,
    }

    const accommodations = [...(trip.accommodations || []), newAccommodation]
    TripService.updateTrip(tripId, { accommodations })

    // Add history entry
    HistoryService.addEntry("CREATE", "ACCOMMODATION", newAccommodation.id, tripId, null, newAccommodation)

    return newAccommodation
  },

  /**
   * Update an accommodation
   */
  updateAccommodation: (
    tripId: string,
    accommodationId: string,
    accommodationData: Partial<Accommodation>,
  ): Accommodation | undefined => {
    const trip = TripService.getTripById(tripId)
    if (!trip || !trip.accommodations) return undefined

    const accommodationIndex = trip.accommodations.findIndex((accommodation) => accommodation.id === accommodationId)

    if (accommodationIndex === -1) return undefined

    // Store previous state for history
    const previousState = { ...trip.accommodations[accommodationIndex] }

    const updatedAccommodation = {
      ...trip.accommodations[accommodationIndex],
      ...accommodationData,
    }

    const updatedAccommodations = [
      ...trip.accommodations.slice(0, accommodationIndex),
      updatedAccommodation,
      ...trip.accommodations.slice(accommodationIndex + 1),
    ]

    TripService.updateTrip(tripId, { accommodations: updatedAccommodations })

    // Add history entry
    HistoryService.addEntry("UPDATE", "ACCOMMODATION", accommodationId, tripId, previousState, updatedAccommodation)

    return updatedAccommodation
  },

  /**
   * Delete an accommodation
   */
  deleteAccommodation: (tripId: string, accommodationId: string): boolean => {
    const trip = TripService.getTripById(tripId)
    if (!trip || !trip.accommodations) return false

    // Find the accommodation to be deleted for history
    const accommodationToDelete = trip.accommodations.find((accommodation) => accommodation.id === accommodationId)
    if (!accommodationToDelete) return false

    const updatedAccommodations = trip.accommodations.filter((accommodation) => accommodation.id !== accommodationId)

    if (updatedAccommodations.length === trip.accommodations.length) {
      return false
    }

    TripService.updateTrip(tripId, { accommodations: updatedAccommodations })

    // Add history entry
    HistoryService.addEntry("DELETE", "ACCOMMODATION", accommodationId, tripId, accommodationToDelete, null)

    return true
  },

  /**
   * Validate accommodation dates
   */
  validateAccommodationDates: (
    tripStartDate: string,
    tripEndDate: string,
    checkIn: string,
    checkOut: string,
  ): boolean => {
    const tripStart = new Date(tripStartDate)
    const tripEnd = new Date(tripEndDate)
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)

    return checkInDate >= tripStart && checkOutDate <= tripEnd && checkOutDate > checkInDate
  },
}

