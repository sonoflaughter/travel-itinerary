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
import { AccommodationService } from "@/services/accommodation-service"
import { TripService } from "@/services/trip-service"
import { useToast } from "@/components/ui/use-toast"
import { useUndoToast } from "@/components/undo-toast-action"

export default function EditAccommodationPage({
  params,
}: {
  params: { id: string; accommodationId: string }
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [accommodation, setAccommodation] = useState<any>(null)
  const [tripData, setTripData] = useState<any>(null)
  const { toast } = useToast()
  const { showUndoToast } = useUndoToast()

  // Load accommodation and trip data
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

        const accommodationData = AccommodationService.getAccommodationById(params.id, params.accommodationId)
        if (!accommodationData) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Accommodation not found",
          })
          router.push(`/trips/${params.id}/accommodations`)
          return
        }

        setAccommodation(accommodationData)
      } catch (error) {
        console.error("Failed to load data:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load accommodation data",
        })
        router.push(`/trips/${params.id}`)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [params.id, params.accommodationId, router, toast])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)

      // Extract form values
      const name = formData.get("name") as string
      const type = formData.get("type") as string
      const location = formData.get("location") as string
      const address = formData.get("address") as string
      const checkIn = formData.get("checkIn") as string
      const checkOut = formData.get("checkOut") as string
      const price = formData.get("price") as string
      const notes = formData.get("notes") as string

      // Validate dates if trip data is available
      if (tripData) {
        if (!AccommodationService.validateAccommodationDates(tripData.startDate, tripData.endDate, checkIn, checkOut)) {
          toast({
            variant: "destructive",
            title: "Invalid Dates",
            description: "Accommodation dates must be within your trip dates and check-out must be after check-in",
          })
          setIsSubmitting(false)
          return
        }
      }

      // Update the accommodation
      const updatedAccommodation = AccommodationService.updateAccommodation(params.id, params.accommodationId, {
        name,
        type,
        location,
        address,
        checkIn,
        checkOut,
        price: price || undefined,
        notes: notes || undefined,
      })

      if (updatedAccommodation) {
        showUndoToast({
          actionType: "UPDATE",
          entityType: "ACCOMMODATION",
          message: "Accommodation updated successfully!",
        })

        // Redirect back to the accommodations page
        router.push(`/trips/${params.id}/accommodations`)
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update accommodation",
        })
      }
    } catch (error) {
      console.error("Failed to update accommodation:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update accommodation. Please try again.",
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

  if (!accommodation) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Accommodation not found</h1>
        <p className="mt-2">The accommodation you're looking for doesn't exist or has been deleted.</p>
        <Button className="mt-4" asChild>
          <Link href={`/trips/${params.id}/accommodations`}>Back to Accommodations</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href={`/trips/${params.id}/accommodations`} className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit Accommodation</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Accommodation Details</CardTitle>
          <CardDescription>Update accommodation information for your trip</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={accommodation.name}
                  placeholder="e.g. Hilton Hotel"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Input
                  id="type"
                  name="type"
                  defaultValue={accommodation.type}
                  placeholder="e.g. Hotel, Airbnb, Hostel"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                defaultValue={accommodation.location}
                placeholder="e.g. Paris, France"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                defaultValue={accommodation.address}
                placeholder="Full address"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkIn">Check-in Date</Label>
                <Input id="checkIn" name="checkIn" type="date" defaultValue={accommodation.checkIn} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkOut">Check-out Date</Label>
                <Input id="checkOut" name="checkOut" type="date" defaultValue={accommodation.checkOut} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (Optional)</Label>
              <Input id="price" name="price" defaultValue={accommodation.price} placeholder="e.g. $150 per night" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                defaultValue={accommodation.notes}
                placeholder="Any additional information"
                className="resize-none"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push(`/trips/${params.id}/accommodations`)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Accommodation
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

