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

export default function NewActivityPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tripData, setTripData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasConflict, setHasConflict] = useState(false)
  const { toast } = useToast()

  // Load trip data to validate activity dates
  useEffect(() => {
    const loadTrip = () => {
      try {
        const trip = TripService.getTripById(params.id)
        setTripData(trip)
      } catch (error) {
        console.error("Failed to load trip:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load trip data",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadTrip()
  }, [params.id, toast])

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
      const hasConflict = ActivityService.checkSchedulingConflicts(params.id, date, time, duration)

      if (hasConflict) {
        const confirmAdd = window.confirm(
          "There appears to be another activity scheduled around this time. Do you still want to add this activity?",
        )

        if (!confirmAdd) {
          setIsSubmitting(false)
          return
        }
      }

      // Create the activity
      ActivityService.addActivity(params.id, {
        name,
        date,
        time,
        duration: duration || undefined,
        cost: cost || undefined,
        location: location || undefined,
        notes: notes || undefined,
      })

      toast({
        title: "Success",
        description: "Activity added successfully!",
      })

      // Redirect back to the activities page
      router.push(`/trips/${params.id}/activities`)
    } catch (error) {
      console.error("Failed to add activity:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add activity. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href={`/trips/${params.id}`} className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Add Activity</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Activity Details</CardTitle>
          <CardDescription>Add activities and things to do during your trip</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Activity Name</Label>
              <Input id="name" name="name" placeholder="e.g. Visit the Eiffel Tower" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" name="time" type="time" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (Optional)</Label>
                <Input id="duration" name="duration" placeholder="e.g. 2 hours" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Cost (Optional)</Label>
                <Input id="cost" name="cost" placeholder="e.g. $25 per person" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input id="location" name="location" placeholder="e.g. 1 Eiffel Tower, Paris" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea id="notes" name="notes" placeholder="Any additional information" className="resize-none" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push(`/trips/${params.id}`)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Activity
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

