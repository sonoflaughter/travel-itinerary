"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { FlightService } from "@/services/flight-service"
import { TripService } from "@/services/trip-service"
import { useToast } from "@/components/ui/use-toast"

export default function NewFlightPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tripData, setTripData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Load trip data to validate flight dates
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

      // Extract and validate form values
      const airline = formData.get("airline") as string
      const flightNumber = formData.get("flightNumber") as string
      const departureCity = formData.get("departureCity") as string
      const departureAirport = formData.get("departureAirport") as string
      const departureTime = formData.get("departureTime") as string
      const arrivalCity = formData.get("arrivalCity") as string
      const arrivalAirport = formData.get("arrivalAirport") as string
      const arrivalTime = formData.get("arrivalTime") as string

      // Validate date if trip data is available
      if (tripData) {
        const departureDate = new Date(departureTime).toISOString().split("T")[0]
        if (!FlightService.validateFlightDates(tripData.startDate, tripData.endDate, departureDate)) {
          toast({
            variant: "destructive",
            title: "Invalid Date",
            description: "Flight departure date should be within your trip dates (±1 day for travel)",
          })
          setIsSubmitting(false)
          return
        }
      }

      // Create the flight
      FlightService.addFlight(params.id, {
        airline,
        flightNumber,
        departureCity,
        departureAirport,
        departureTime,
        arrivalCity,
        arrivalAirport,
        arrivalTime,
      })

      toast({
        title: "Success",
        description: "Flight added successfully!",
      })

      // Redirect back to the flights page
      router.push(`/trips/${params.id}/flights`)
    } catch (error) {
      console.error("Failed to add flight:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add flight. Please try again.",
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
        <h1 className="text-2xl font-bold">Add Flight</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Flight Details</CardTitle>
          <CardDescription>Add flight information for your trip</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="airline">Airline</Label>
                <Input id="airline" name="airline" placeholder="e.g. Delta Airlines" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="flightNumber">Flight Number</Label>
                <Input id="flightNumber" name="flightNumber" placeholder="e.g. DL123" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="departureCity">Departure City</Label>
                  <Input id="departureCity" name="departureCity" placeholder="e.g. New York" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departureAirport">Departure Airport</Label>
                  <Input id="departureAirport" name="departureAirport" placeholder="e.g. JFK" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departureTime">Departure Date & Time</Label>
                  <Input id="departureTime" name="departureTime" type="datetime-local" required />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="arrivalCity">Arrival City</Label>
                  <Input id="arrivalCity" name="arrivalCity" placeholder="e.g. Los Angeles" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arrivalAirport">Arrival Airport</Label>
                  <Input id="arrivalAirport" name="arrivalAirport" placeholder="e.g. LAX" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arrivalTime">Arrival Date & Time</Label>
                  <Input id="arrivalTime" name="arrivalTime" type="datetime-local" required />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push(`/trips/${params.id}`)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Flight
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

