"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import DashboardStats from "@/components/dashboard-stats"
import TripCard from "@/components/trip-card"
import { trips } from "@/lib/data"
import { useEffect, useState } from "react"
import type { Trip } from "@/lib/data"
import { TripService } from "@/services/trip-service"

export default function Home() {
  const [userTrips, setUserTrips] = useState<Trip[]>([])

  useEffect(() => {
    // Initialize localStorage with sample data if it's the first visit
    if (typeof window !== "undefined") {
      if (!localStorage.getItem("trips") && !localStorage.getItem("initialTrips")) {
        localStorage.setItem("initialTrips", JSON.stringify(trips))
        localStorage.setItem("trips", JSON.stringify(trips))
      } else if (!localStorage.getItem("trips") && localStorage.getItem("initialTrips")) {
        const initialTrips = localStorage.getItem("initialTrips")
        localStorage.setItem("trips", initialTrips || "[]")
      }
    }

    // Load trips from localStorage
    const loadTrips = () => {
      const loadedTrips = TripService.getTrips()
      setUserTrips(loadedTrips)
    }

    loadTrips()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
          <p className="text-muted-foreground mt-1">Manage your travel plans and create new adventures</p>
        </div>
        <Link href="/trips/new" className="mt-4 md:mt-0">
          <Button className="flex items-center gap-2">
            <PlusCircle size={18} />
            <span>New Trip</span>
          </Button>
        </Link>
      </div>

      <DashboardStats trips={userTrips} />

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Your Trips</h2>
          <Link href="/trips">
            <Button variant="ghost">View All</Button>
          </Link>
        </div>

        {userTrips.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No trips yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first trip to get started with your travel planning
            </p>
            <Link href="/trips/new">
              <Button>Create Trip</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

