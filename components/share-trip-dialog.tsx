"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Share2, Copy, Mail, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ShareTripDialogProps {
  tripId: string
}

export default function ShareTripDialog({ tripId }: ShareTripDialogProps) {
  const [copied, setCopied] = useState(false)
  const [sending, setSending] = useState(false)

  const shareUrl = `https://travel-planner.example.com/shared/${tripId}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEmailShare = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)

    // In a real app, you would send this to your API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSending(false)
    // Show success message in a real app
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Share2 size={16} />
          <span>Share</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Share Trip</DialogTitle>
          <DialogDescription>Share your trip itinerary with friends and family</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">Share Link</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input value={shareUrl} readOnly className="flex-1" />
                <Button size="sm" onClick={copyToClipboard} variant="outline">
                  {copied ? (
                    <span className="text-green-600">Copied!</span>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>

              <div>
                <Label>Permission</Label>
                <Select defaultValue="view">
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select permission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="view">View only</SelectItem>
                    <SelectItem value="edit">Can edit</SelectItem>
                    <SelectItem value="comment">Can comment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="email" className="mt-4">
            <form onSubmit={handleEmailShare}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emails">Email Addresses</Label>
                  <Input id="emails" placeholder="friend@example.com, family@example.com" required />
                  <p className="text-xs text-muted-foreground">Separate multiple email addresses with commas</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Input id="message" placeholder="Check out my trip itinerary!" />
                </div>

                <div>
                  <Label>Permission</Label>
                  <Select defaultValue="view">
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select permission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">View only</SelectItem>
                      <SelectItem value="edit">Can edit</SelectItem>
                      <SelectItem value="comment">Can comment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={sending}>
                  {sending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email Invitation
                    </>
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>

        <DialogFooter className="sm:justify-start">
          <p className="text-xs text-muted-foreground">
            People with the link can view all trip details, including flights, accommodations, and activities based on
            their permission level.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

