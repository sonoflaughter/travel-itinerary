"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Plane, Home, CalendarClock } from "lucide-react"
import TripHeader from "@/components/trip-header"
import FlightDetails from "@/components/flight-details"
import AccommodationDetails from "@/components/accommodation-details"
import ActivityList from "@/components/activity-list"
import ShareTripDialog from "@/components/share-trip-dialog"
import { useEffect, useState } from "react"
import type { Trip } from "@/lib/data"
import { TripService } from "@/services/trip-service"
import { useRouter } from "next/navigation"

export default function TripDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTrip = () => {
      const foundTrip = TripService.getTripById(params.id)

      if (foundTrip) {
        setTrip(foundTrip)
      } else {
        // Trip not found, redirect to home
        router.push("/")
      }

      setLoading(false)
    }

    loadTrip()
  }, [params.id, router])

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading trip details...</div>
  }

  if (!trip) {
    return <div className="container mx-auto px-4 py-8">Trip not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TripHeader trip={trip} />

      <div className="flex justify-end mb-6">
        <ShareTripDialog tripId={trip.id} />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="flights">Flights</TabsTrigger>
          <TabsTrigger value="accommodations">Accommodations</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-lg border p-6">
              <div className="flex items-center mb-4">
                <Plane className="mr-2 h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Flights</h3>
              </div>
              {trip.flights && trip.flights.length > 0 ? (
                <div className="space-y-4">
                  {trip.flights.slice(0, 2).map((flight) => (
                    <div key={flight.id} className="flex items-start">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{`${flight.airline} ${flight.flightNumber}`}</p>
                        <p className="text-sm text-muted-foreground">{`${flight.departureCity} → ${flight.arrivalCity}`}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(flight.departureTime).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No flights added yet</p>
              )}
              <Button className="mt-4" variant="outline" href={`/trips/${trip.id}/flights`} asChild>
                <a href={`/trips/${trip.id}/flights`}>Manage Flights</a>
              </Button>
            </div>

            <div className="rounded-lg border p-6">
              <div className="flex items-center mb-4">
                <Home className="mr-2 h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Accommodations</h3>
              </div>
              {trip.accommodations && trip.accommodations.length > 0 ? (
                <div className="space-y-4">
                  {trip.accommodations.slice(0, 2).map((accommodation) => (
                    <div key={accommodation.id} className="flex items-start">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{accommodation.name}</p>
                        <p className="text-sm text-muted-foreground">{accommodation.location}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(accommodation.checkIn).toLocaleDateString()} -{" "}
                          {new Date(accommodation.checkOut).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No accommodations added yet</p>
              )}
              <Button className="mt-4" variant="outline" href={`/trips/${trip.id}/accommodations`} asChild>
                <a href={`/trips/${trip.id}/accommodations`}>Manage Accommodations</a>
              </Button>
            </div>

            <div className="md:col-span-2 rounded-lg border p-6">
              <div className="flex items-center mb-4">
                <CalendarClock className="mr-2 h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Activities</h3>
              </div>
              {trip.activities && trip.activities.length > 0 ? (
                <div className="space-y-4">
                  {trip.activities.slice(0, 3).map((activity) => (
                    <div key={activity.id} className="flex items-start">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{activity.name}</p>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Calendar className="mr-1 h-4 w-4" />
                          <span>{new Date(activity.date).toLocaleDateString()}</span>
                          <Clock className="ml-3 mr-1 h-4 w-4" />
                          <span>{activity.time}</span>
                          {activity.location && (
                            <>
                              <MapPin className="ml-3 mr-1 h-4 w-4" />
                              <span>{activity.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No activities added yet</p>
              )}
              <Button className="mt-4" variant="outline" href={`/trips/${trip.id}/activities`} asChild>
                <a href={`/trips/${trip.id}/activities`}>Manage Activities</a>
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="flights" className="mt-6">
          <FlightDetails tripId={trip.id} flights={trip.flights || []} />
        </TabsContent>

        <TabsContent value="accommodations" className="mt-6">
          <AccommodationDetails tripId={trip.id} accommodations={trip.accommodations || []} />
        </TabsContent>

        <TabsContent value="activities" className="mt-6">
          <ActivityList tripId={trip.id} activities={trip.activities || []} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

