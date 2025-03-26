import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plane, Building, MapPin, Calendar } from "lucide-react"
import type { Trip } from "@/lib/data"

interface DashboardStatsProps {
  trips: Trip[]
}

export default function DashboardStats({ trips }: DashboardStatsProps) {
  // Calculate real stats from the trips data
  const upcomingTrips = trips.filter((trip) => new Date(trip.startDate) > new Date()).length

  const totalFlights = trips.reduce((count, trip) => count + (trip.flights?.length || 0), 0)
  const upcomingFlights = trips.reduce((count, trip) => {
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

    const flightsInNext30Days =
      trip.flights?.filter((flight) => {
        const flightDate = new Date(flight.departureTime)
        return flightDate > new Date() && flightDate < thirtyDaysFromNow
      }).length || 0

    return count + flightsInNext30Days
  }, 0)

  const totalAccommodations = trips.reduce((count, trip) => count + (trip.accommodations?.length || 0), 0)
  const totalNights = trips.reduce((count, trip) => {
    const accommodationNights =
      trip.accommodations?.reduce((nights, accommodation) => {
        const checkIn = new Date(accommodation.checkIn)
        const checkOut = new Date(accommodation.checkOut)
        const stayDuration = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
        return nights + stayDuration
      }, 0) || 0

    return count + accommodationNights
  }, 0)

  const totalActivities = trips.reduce((count, trip) => count + (trip.activities?.length || 0), 0)
  const uniqueLocations = new Set()
  trips.forEach((trip) => {
    trip.activities?.forEach((activity) => {
      if (activity.location) {
        uniqueLocations.add(activity.location)
      }
    })
  })

  const stats = [
    {
      title: "Trips",
      value: trips.length.toString(),
      description: `${upcomingTrips} upcoming`,
      icon: <Calendar className="h-5 w-5 text-primary" />,
    },
    {
      title: "Flights",
      value: totalFlights.toString(),
      description: `${upcomingFlights} in the next 30 days`,
      icon: <Plane className="h-5 w-5 text-primary" />,
    },
    {
      title: "Accommodations",
      value: totalAccommodations.toString(),
      description: `${totalNights} nights total`,
      icon: <Building className="h-5 w-5 text-primary" />,
    },
    {
      title: "Activities",
      value: totalActivities.toString(),
      description: `In ${uniqueLocations.size} different locations`,
      icon: <MapPin className="h-5 w-5 text-primary" />,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

