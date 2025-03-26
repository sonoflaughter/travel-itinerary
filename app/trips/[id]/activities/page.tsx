"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import ActivityList from "@/components/activity-list"
import { useEffect, useState } from "react"
import type { Trip } from "@/lib/data"
import { TripService } from "@/services/trip-service"
import { useRouter } from "next/navigation"

export default function ActivitiesPage({
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
    return <div className="container mx-auto px-4 py-8">Loading activity details...</div>
  }

  if (!trip) {
    return <div className="container mx-auto px-4 py-8">Trip not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Activities</h1>
        <Link href={`/trips/${params.id}/activities/new`}>
          <Button className="flex items-center gap-2">
            <PlusCircle size={18} />
            <span>Add Activity</span>
          </Button>
        </Link>
      </div>

      <ActivityList tripId={trip.id} activities={trip.activities || []} />
    </div>
  )
}

