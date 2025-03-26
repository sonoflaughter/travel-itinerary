import { Calendar, MapPin } from "lucide-react"

interface TripHeaderProps {
  trip: {
    id: string
    name: string
    destination: string
    startDate: string
    endDate: string
    description?: string
    imageUrl?: string
  }
}

export default function TripHeader({ trip }: TripHeaderProps) {
  const startDate = new Date(trip.startDate)
  const endDate = new Date(trip.endDate)

  const getDurationInDays = () => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="mb-8">
      <div className="relative w-full h-[200px] md:h-[300px] overflow-hidden rounded-lg mb-6">
        <img
          src={trip.imageUrl || `/placeholder.svg?height=300&width=1200`}
          alt={trip.destination}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <h1 className="text-3xl font-bold tracking-tight">{trip.name}</h1>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-2">
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
          <span>{trip.destination}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
          <span>
            {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
            <span className="text-muted-foreground ml-1">({getDurationInDays()} days)</span>
          </span>
        </div>
      </div>

      {trip.description && <p className="text-muted-foreground mt-4">{trip.description}</p>}
    </div>
  )
}

