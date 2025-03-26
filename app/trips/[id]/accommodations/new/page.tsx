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

export default function NewAccommodationPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tripData, setTripData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Load trip data to validate accommodation dates
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

      // Create the accommodation
      AccommodationService.addAccommodation(params.id, {
        name,
        type,
        location,
        address,
        checkIn,
        checkOut,
        price: price || undefined,
        notes: notes || undefined,
      })

      toast({
        title: "Success",
        description: "Accommodation added successfully!",
      })

      // Redirect back to the accommodations page
      router.push(`/trips/${params.id}/accommodations`)
    } catch (error) {
      console.error("Failed to add accommodation:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add accommodation. Please try again.",
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
        <h1 className="text-2xl font-bold">Add Accommodation</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Accommodation Details</CardTitle>
          <CardDescription>Add accommodation information for your trip</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="e.g. Hilton Hotel" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Input id="type" name="type" placeholder="e.g. Hotel, Airbnb, Hostel" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" placeholder="e.g. Paris, France" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" placeholder="Full address" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkIn">Check-in Date</Label>
                <Input id="checkIn" name="checkIn" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkOut">Check-out Date</Label>
                <Input id="checkOut" name="checkOut" type="date" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (Optional)</Label>
              <Input id="price" name="price" placeholder="e.g. $150 per night" />
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
              Add Accommodation
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

