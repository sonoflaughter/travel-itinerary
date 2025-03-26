"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Plane, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { FlightService } from "@/services/flight-service"
import { useToast } from "@/components/ui/use-toast"
import { useUndoToast } from "@/components/undo-toast-action"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Flight {
  id: string
  airline: string
  flightNumber: string
  departureCity: string
  departureAirport: string
  departureTime: string
  arrivalCity: string
  arrivalAirport: string
  arrivalTime: string
}

interface FlightDetailsProps {
  tripId: string
  flights: Flight[]
}

export default function FlightDetails({ tripId, flights }: FlightDetailsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { showUndoToast } = useUndoToast()
  const [flightToDelete, setFlightToDelete] = useState<string | null>(null)

  const handleDelete = (flightId: string) => {
    const success = FlightService.deleteFlight(tripId, flightId)

    if (success) {
      showUndoToast({
        actionType: "DELETE",
        entityType: "FLIGHT",
        message: "Flight has been deleted",
      })
      router.refresh()
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete flight",
      })
    }

    setFlightToDelete(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Flights</h2>
        <Link href={`/trips/${tripId}/flights/new`}>
          <Button className="flex items-center gap-2">
            <PlusCircle size={16} />
            <span>Add Flight</span>
          </Button>
        </Link>
      </div>

      {flights.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <Plane className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No flights added yet</h3>
          <p className="text-muted-foreground mb-4">Add your flight details to keep track of your travel plans</p>
          <Link href={`/trips/${tripId}/flights/new`}>
            <Button>Add Flight</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {flights.map((flight) => (
            <Card key={flight.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {flight.airline} {flight.flightNumber}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/trips/${tripId}/flights/${flight.id}/edit`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={() => setFlightToDelete(flight.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
                <CardDescription>{new Date(flight.departureTime).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">{flight.departureCity}</span>
                    <span className="text-sm text-muted-foreground">{flight.departureAirport}</span>
                    <span className="text-sm">
                      {new Date(flight.departureTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex flex-1 items-center justify-center">
                    <div className="w-full flex items-center">
                      <div className="h-[2px] flex-1 bg-muted"></div>
                      <Plane className="mx-2 h-4 w-4 text-muted-foreground" />
                      <div className="h-[2px] flex-1 bg-muted"></div>
                    </div>
                  </div>

                  <div className="flex flex-col text-right">
                    <span className="text-2xl font-bold">{flight.arrivalCity}</span>
                    <span className="text-sm text-muted-foreground">{flight.arrivalAirport}</span>
                    <span className="text-sm">
                      {new Date(flight.arrivalTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!flightToDelete} onOpenChange={(open) => !open && setFlightToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the flight from your trip. This action can be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => flightToDelete && handleDelete(flightToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

