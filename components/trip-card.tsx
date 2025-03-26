import Link from "next/link"
import { Calendar, MapPin } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"

interface TripCardProps {
  trip: {
    id: string
    name: string
    destination: string
    startDate: string
    endDate: string
    imageUrl?: string
  }
}

export default function TripCard({ trip }: TripCardProps) {
  const startDate = new Date(trip.startDate)
  const endDate = new Date(trip.endDate)
  const isUpcoming = startDate > new Date()
  const isOngoing = startDate <= new Date() && endDate >= new Date()
  const isPast = endDate < new Date()

  const getDurationInDays = () => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-video relative">
        <img
          src={trip.imageUrl || `/placeholder.svg?height=200&width=400`}
          alt={trip.name}
          className="object-cover w-full h-full"
        />
        {isUpcoming && (
          <Badge className="absolute top-3 right-3 bg-primary">
            Starting {formatDistanceToNow(startDate, { addSuffix: true })}
          </Badge>
        )}
        {isOngoing && <Badge className="absolute top-3 right-3 bg-green-600">Ongoing</Badge>}
        {isPast && <Badge className="absolute top-3 right-3 bg-muted text-muted-foreground">Completed</Badge>}
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-1">{trip.name}</h3>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <MapPin className="h-4 w-4 mr-1" /> {trip.destination}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-1" />
          <span>
            {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
          </span>
          <Badge variant="outline" className="ml-2 text-xs">
            {getDurationInDays()} days
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/trips/${trip.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

