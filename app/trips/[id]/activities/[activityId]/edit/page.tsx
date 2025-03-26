"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ActivityService } from "@/services/activity-service"
import { TripService } from "@/services/trip-service"
import { useToast } from "@/components/ui/use-toast"
import { useUndoToast } from "@/components/undo-toast-action"

export default function EditActivityPage({
  params,
}: {
  params: { id: string; activityId: string }
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activity, setActivity] = useState<any>(null)
  const [tripData, setTripData] = useState<any>(null)
  const { toast } = useToast()
  const { showUndoToast } = useUndoToast()

  // Load activity and trip data
  useEffect(() => {
    const loadData = () => {
      try {
        const trip = TripService.getTripById(params.id)
        if (!trip) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Trip not found",
          })
          router.push("/trips")
          return
        }

        setTripData(trip)

        const activityData = ActivityService.getActivityById(params.id, params.activityId)
        if (!activityData) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Activity not found",
          })
          router.push(`/trips/${params.id}/activities`)
          return
        }

        setActivity(activityData)
      } catch (error) {
        console.error("Failed to load data:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load activity data",
        })
        router.push(`/trips/${params.id}`)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [params.id, params.activityId, router, toast])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)

      // Extract form values
      const name = formData.get("name") as string
      const date = formData.get("date") as string
      const time = formData.get("time") as string
      const duration = formData.get("duration") as string
      const cost = formData.get("cost") as string
      const location = formData.get("location") as string
      const notes = formData.get("notes") as string

      // Check for scheduling conflicts
      const hasConflict = ActivityService.checkSchedulingConflicts(params.id, date, time, duration, params.activityId)

      if (hasConflict) {
        const confirmAdd = window.confirm(
          "There appears to be another activity scheduled around this time. Do you still want to update this activity?",
        )

        if (!confirmAdd) {
          setIsSubmitting(false)
          return
        }
      }

      // Update the activity
      const updatedActivity = ActivityService.updateActivity(params.id, params.activityId, {
        name,
        date,
        time,
        duration: duration || undefined,
        cost: cost || undefined,
        location: location || undefined,
        notes: notes || undefined,
      })

      if (updatedActivity) {
        showUndoToast({
          actionType: "UPDATE",
          entityType: "ACTIVITY",
          message: "Activity updated successfully!",
        })

        // Redirect back to the activities page
        router.push(`/trips/${params.id}/activities`)
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update activity",
        })
      }
    } catch (error) {
      console.error("Failed to update activity:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update activity. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!activity) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Activity not found</h1>
        <p className="mt-2">The activity you're looking for doesn't exist or has been deleted.</p>
        <Button className="mt-4" asChild>
          <Link href={`/trips/${params.id}/activities`}>Back to Activities</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href={`/trips/${params.id}/activities`} className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit Activity</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Activity Details</CardTitle>
          <CardDescription>Update activity information for your trip</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Activity Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={activity.name}
                placeholder="e.g. Visit the Eiffel Tower"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" defaultValue={activity.date} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" name="time" type="time" defaultValue={activity.time} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (Optional)</Label>
                <Input id="duration" name="duration" defaultValue={activity.duration} placeholder="e.g. 2 hours" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Cost (Optional)</Label>
                <Input id="cost" name="cost" defaultValue={activity.cost} placeholder="e.g. $25 per person" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                name="location"
                defaultValue={activity.location}
                placeholder="e.g. 1 Eiffel Tower, Paris"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                defaultValue={activity.notes}
                placeholder="Any additional information"
                className="resize-none"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push(`/trips/${params.id}/activities`)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Activity
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

