"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import { AlertTriangle, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  public handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
          <div className="mb-4 rounded-full bg-red-100 p-4 dark:bg-red-900/20">
            <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="mb-2 text-2xl font-bold tracking-tight">Something went wrong</h1>
          <p className="mb-6 max-w-md text-muted-foreground">
            We apologize for the inconvenience. An unexpected error occurred while processing your request.
          </p>
          <div className="bg-muted/50 p-4 rounded-md mb-6 max-w-lg w-full overflow-auto text-left text-xs font-mono border">
            {this.state.error?.message}
          </div>
          <div className="flex gap-4">
            <Button onClick={() => this.setState({ hasError: false, error: null })} variant="outline">
              Try Again
            </Button>
            <Button onClick={this.handleReload}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reload Page
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
