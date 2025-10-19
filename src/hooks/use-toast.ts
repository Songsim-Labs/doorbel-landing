import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export function useToast() {
  return {
    toast: ({ title, description, variant }: ToastProps) => {
      if (variant === "destructive") {
        sonnerToast.error(title || description || "Error", {
          description: title ? description : undefined,
        })
      } else {
        sonnerToast.success(title || description || "Success", {
          description: title ? description : undefined,
        })
      }
    },
  }
}

