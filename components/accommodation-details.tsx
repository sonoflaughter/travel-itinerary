"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, MapPin, Calendar, PlusCircle, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AccommodationService } from "@/services/accommodation-service"
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

interface Accommodation {
  id: string
  name: string
  type: string
  location: string
  address: string
  checkIn: string
  checkOut: string
  price?: string
  notes?: string
}

interface AccommodationDetailsProps {
  tripId: string
  accommodations: Accommodation[]
}

export default function AccommodationDetails({ tripId, accommodations }: AccommodationDetailsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { showUndoToast } = useUndoToast()
  const [accommodationToDelete, setAccommodationToDelete] = useState<string | null>(null)

  const handleDelete = (accommodationId: string) => {
    const success = AccommodationService.deleteAccommodation(tripId, accommodationId)

    if (success) {
      showUndoToast({
        actionType: "DELETE",
        entityType: "ACCOMMODATION",
        message: "Accommodation has been deleted",
      })
      router.refresh()
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete accommodation",
      })
    }

    setAccommodationToDelete(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Accommodations</h2>
        <Link href={`/trips/${tripId}/accommodations/new`}>
          <Button className="flex items-center gap-2">
            <PlusCircle size={16} />
            <span>Add Accommodation</span>
          </Button>
        </Link>
      </div>

      {accommodations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <Home className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No accommodations added yet</h3>
          <p className="text-muted-foreground mb-4">Add your accommodations to keep track of where you'll be staying</p>
          <Link href={`/trips/${tripId}/accommodations/new`}>
            <Button>Add Accommodation</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {accommodations.map((accommodation) => (
            <Card key={accommodation.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{accommodation.name}</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/trips/${tripId}/accommodations/${accommodation.id}/edit`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={() => setAccommodationToDelete(accommodation.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
                <CardDescription>{accommodation.type}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <div className="space-y-1">
                    <p>{accommodation.location}</p>
                    <p className="text-sm text-muted-foreground">{accommodation.address}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    {new Date(accommodation.checkIn).toLocaleDateString()} -{" "}
                    {new Date(accommodation.checkOut).toLocaleDateString()}
                  </span>
                </div>
                {accommodation.price && <div className="text-sm font-medium">Price: {accommodation.price}</div>}
                {accommodation.notes && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-1">Notes</h4>
                    <p className="text-sm text-muted-foreground">{accommodation.notes}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" size="sm">
                  View on Map
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!accommodationToDelete} onOpenChange={(open) => !open && setAccommodationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the accommodation from your trip. This action can be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => accommodationToDelete && handleDelete(accommodationToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

