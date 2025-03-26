"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin, PlusCircle, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ActivityService } from "@/services/activity-service"
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

interface Activity {
  id: string
  name: string
  date: string
  time: string
  duration?: string
  location?: string
  cost?: string
  notes?: string
}

interface ActivityListProps {
  tripId: string
  activities: Activity[]
}

export default function ActivityList({ tripId, activities }: ActivityListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { showUndoToast } = useUndoToast()
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null)

  const handleDelete = (activityId: string) => {
    const success = ActivityService.deleteActivity(tripId, activityId)

    if (success) {
      showUndoToast({
        actionType: "DELETE",
        entityType: "ACTIVITY",
        message: "Activity has been deleted",
      })
      router.refresh()
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete activity",
      })
    }

    setActivityToDelete(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Activities</h2>
        <Link href={`/trips/${tripId}/activities/new`}>
          <Button className="flex items-center gap-2">
            <PlusCircle size={16} />
            <span>Add Activity</span>
          </Button>
        </Link>
      </div>

      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No activities added yet</h3>
          <p className="text-muted-foreground mb-4">Add activities to your itinerary to keep track of your plans</p>
          <Link href={`/trips/${tripId}/activities/new`}>
            <Button>Add Activity</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {activities.map((activity) => (
            <Card key={activity.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{activity.name}</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/trips/${tripId}/activities/${activity.id}/edit`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={() => setActivityToDelete(activity.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
                <CardDescription>{new Date(activity.date).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{new Date(activity.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{activity.time}</span>
                </div>
                {activity.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{activity.location}</span>
                  </div>
                )}
                {activity.duration && <div className="text-sm font-medium">Duration: {activity.duration}</div>}
                {activity.cost && <div className="text-sm font-medium">Cost: {activity.cost}</div>}
                {activity.notes && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-1">Notes</h4>
                    <p className="text-sm text-muted-foreground">{activity.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!activityToDelete} onOpenChange={(open) => !open && setActivityToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the activity from your trip. This action can be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => activityToDelete && handleDelete(activityToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

