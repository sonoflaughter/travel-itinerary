"use client"

import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { HistoryService } from "@/services/history-service"
import { useRouter } from "next/navigation"

interface UndoToastProps {
  actionType: "CREATE" | "UPDATE" | "DELETE"
  entityType: "TRIP" | "FLIGHT" | "ACCOMMODATION" | "ACTIVITY"
  message: string
}

export function useUndoToast() {
  const { toast } = useToast()
  const router = useRouter()

  const showUndoToast = ({ actionType, entityType, message }: UndoToastProps) => {
    toast({
      title: getToastTitle(actionType, entityType),
      description: message,
      action: (
        <ToastAction altText="Undo" onClick={() => handleUndo()}>
          Undo
        </ToastAction>
      ),
    })
  }

  const handleUndo = () => {
    const success = HistoryService.undoLatestAction()

    if (success) {
      toast({
        title: "Action undone",
        description: "Your changes have been reverted",
      })

      // Refresh the page to show updated data
      router.refresh()
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not undo the action",
      })
    }
  }

  return { showUndoToast }
}

function getToastTitle(
  actionType: "CREATE" | "UPDATE" | "DELETE",
  entityType: "TRIP" | "FLIGHT" | "ACCOMMODATION" | "ACTIVITY",
): string {
  const action = actionType === "CREATE" ? "Created" : actionType === "UPDATE" ? "Updated" : "Deleted"
  const entity = entityType.charAt(0) + entityType.slice(1).toLowerCase()

  return `${action} ${entity}`
}

