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
import { useUndoToast } from "@/components/undo-toast-action"

export default function EditFlightPage({
  params,
}: {
  params: { id: string; flightId: string }
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [flight, setFlight] = useState<any>(null)
  const [tripData, setTripData] = useState<any>(null)
  const { toast } = useToast()
  const { showUndoToast } = useUndoToast()

  // Load flight and trip data
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

        const flightData = FlightService.getFlightById(params.id, params.flightId)
        if (!flightData) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Flight not found",
          })
          router.push(`/trips/${params.id}/flights`)
          return
        }

        setFlight(flightData)
      } catch (error) {
        console.error("Failed to load data:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load flight data",
        })
        router.push(`/trips/${params.id}`)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [params.id, params.flightId, router, toast])

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

      // Update the flight
      const updatedFlight = FlightService.updateFlight(params.id, params.flightId, {
        airline,
        flightNumber,
        departureCity,
        departureAirport,
        departureTime,
        arrivalCity,
        arrivalAirport,
        arrivalTime,
      })

      if (updatedFlight) {
        showUndoToast({
          actionType: "UPDATE",
          entityType: "FLIGHT",
          message: "Flight updated successfully!",
        })

        // Redirect back to the flights page
        router.push(`/trips/${params.id}/flights`)
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update flight",
        })
      }
    } catch (error) {
      console.error("Failed to update flight:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update flight. Please try again.",
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

  if (!flight) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Flight not found</h1>
        <p className="mt-2">The flight you're looking for doesn't exist or has been deleted.</p>
        <Button className="mt-4" asChild>
          <Link href={`/trips/${params.id}/flights`}>Back to Flights</Link>
        </Button>
      </div>
    )
  }

  // Format datetime-local value
  const formatDateTimeForInput = (dateTimeString: string) => {
    const date = new Date(dateTimeString)
    return date.toISOString().slice(0, 16) // Format as YYYY-MM-DDTHH:MM
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href={`/trips/${params.id}/flights`} className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit Flight</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Flight Details</CardTitle>
          <CardDescription>Update flight information for your trip</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="airline">Airline</Label>
                <Input
                  id="airline"
                  name="airline"
                  defaultValue={flight.airline}
                  placeholder="e.g. Delta Airlines"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="flightNumber">Flight Number</Label>
                <Input
                  id="flightNumber"
                  name="flightNumber"
                  defaultValue={flight.flightNumber}
                  placeholder="e.g. DL123"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="departureCity">Departure City</Label>
                  <Input
                    id="departureCity"
                    name="departureCity"
                    defaultValue={flight.departureCity}
                    placeholder="e.g. New York"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departureAirport">Departure Airport</Label>
                  <Input
                    id="departureAirport"
                    name="departureAirport"
                    defaultValue={flight.departureAirport}
                    placeholder="e.g. JFK"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departureTime">Departure Date & Time</Label>
                  <Input
                    id="departureTime"
                    name="departureTime"
                    type="datetime-local"
                    defaultValue={formatDateTimeForInput(flight.departureTime)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="arrivalCity">Arrival City</Label>
                  <Input
                    id="arrivalCity"
                    name="arrivalCity"
                    defaultValue={flight.arrivalCity}
                    placeholder="e.g. Los Angeles"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arrivalAirport">Arrival Airport</Label>
                  <Input
                    id="arrivalAirport"
                    name="arrivalAirport"
                    defaultValue={flight.arrivalAirport}
                    placeholder="e.g. LAX"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arrivalTime">Arrival Date & Time</Label>
                  <Input
                    id="arrivalTime"
                    name="arrivalTime"
                    type="datetime-local"
                    defaultValue={formatDateTimeForInput(flight.arrivalTime)}
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push(`/trips/${params.id}/flights`)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Flight
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

