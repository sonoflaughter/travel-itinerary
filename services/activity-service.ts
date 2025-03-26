import type { Activity } from "@/lib/data"
import { TripService } from "./trip-service"
import { HistoryService } from "./history-service"

/**
 * Service for managing activities
 */
export const ActivityService = {
  /**
   * Get all activities for a trip
   */
  getActivities: (tripId: string): Activity[] => {
    const trip = TripService.getTripById(tripId)
    return trip?.activities || []
  },

  /**
   * Get activities for a specific date
   */
  getActivitiesByDate: (tripId: string, date: string): Activity[] => {
    const activities = ActivityService.getActivities(tripId)
    return activities.filter((activity) => activity.date === date)
  },

  /**
   * Get an activity by ID
   */
  getActivityById: (tripId: string, activityId: string): Activity | undefined => {
    const trip = TripService.getTripById(tripId)
    return trip?.activities?.find((activity) => activity.id === activityId)
  },

  /**
   * Add an activity to a trip
   */
  addActivity: (tripId: string, activityData: Omit<Activity, "id">): Activity | undefined => {
    const trip = TripService.getTripById(tripId)
    if (!trip) return undefined

    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      ...activityData,
    }

    const activities = [...(trip.activities || []), newActivity]
    TripService.updateTrip(tripId, { activities })

    // Add history entry
    HistoryService.addEntry("CREATE", "ACTIVITY", newActivity.id, tripId, null, newActivity)

    return newActivity
  },

  /**
   * Update an activity
   */
  updateActivity: (tripId: string, activityId: string, activityData: Partial<Activity>): Activity | undefined => {
    const trip = TripService.getTripById(tripId)
    if (!trip || !trip.activities) return undefined

    const activityIndex = trip.activities.findIndex((activity) => activity.id === activityId)

    if (activityIndex === -1) return undefined

    // Store previous state for history
    const previousState = { ...trip.activities[activityIndex] }

    const updatedActivity = {
      ...trip.activities[activityIndex],
      ...activityData,
    }

    const updatedActivities = [
      ...trip.activities.slice(0, activityIndex),
      updatedActivity,
      ...trip.activities.slice(activityIndex + 1),
    ]

    TripService.updateTrip(tripId, { activities: updatedActivities })

    // Add history entry
    HistoryService.addEntry("UPDATE", "ACTIVITY", activityId, tripId, previousState, updatedActivity)

    return updatedActivity
  },

  /**
   * Delete an activity
   */
  deleteActivity: (tripId: string, activityId: string): boolean => {
    const trip = TripService.getTripById(tripId)
    if (!trip || !trip.activities) return false

    // Find the activity to be deleted for history
    const activityToDelete = trip.activities.find((activity) => activity.id === activityId)
    if (!activityToDelete) return false

    const updatedActivities = trip.activities.filter((activity) => activity.id !== activityId)

    if (updatedActivities.length === trip.activities.length) {
      return false
    }

    TripService.updateTrip(tripId, { activities: updatedActivities })

    // Add history entry
    HistoryService.addEntry("DELETE", "ACTIVITY", activityId, tripId, activityToDelete, null)

    return true
  },

  /**
   * Check for scheduling conflicts between activities
   */
  checkSchedulingConflicts: (
    tripId: string,
    date: string,
    startTime: string,
    duration: string,
    excludeActivityId?: string,
  ): boolean => {
    const activitiesOnDate = ActivityService.getActivitiesByDate(tripId, date)

    // Filter out the activity being updated if provided
    const otherActivities = excludeActivityId
      ? activitiesOnDate.filter((activity) => activity.id !== excludeActivityId)
      : activitiesOnDate

    // In a real app, we would do actual time-based conflict detection
    // This is a simplified version
    const activityHour = Number.parseInt(startTime.split(":")[0])
    const activityMinutes = Number.parseInt(startTime.split(":")[1])

    // Check if any existing activity is within 1 hour of the new activity
    // This is just a simplified example of conflict detection
    return otherActivities.some((activity) => {
      const existingHour = Number.parseInt(activity.time.split(":")[0])
      const existingMinutes = Number.parseInt(activity.time.split(":")[1])

      const hourDiff = Math.abs(existingHour - activityHour)
      const minuteDiff = Math.abs(existingMinutes - activityMinutes)

      return hourDiff === 0 && minuteDiff < 30
    })
  },
}

