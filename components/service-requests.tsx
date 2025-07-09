"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  AlertCircle,
  Calendar,
  User,
  Ticket,
  RefreshCw,
  ExternalLink,
  Clock,
  MessageSquare,
  Tag,
  Filter,
  Pencil,
  Trash2,
} from "lucide-react"
import { getServiceDeskRequests, type ServiceDeskRequest, deleteServiceDeskRequest } from "@/lib/auth"

export function ServiceRequests() {
  const [requests, setRequests] = useState<ServiceDeskRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<ServiceDeskRequest | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  async function fetchRequests() {
    try {
      setLoading(true)
      const data = await getServiceDeskRequests()
      // Ensure data is an array and each item is properly formatted
      const formattedData = Array.isArray(data) ? data : []
      setRequests(formattedData)
      setError("")
    } catch (err) {
      console.error("Error fetching requests:", err)
      setError("Failed to load service desk requests - using demo data")
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  async function deleteRequest(requestId: string) {
    try {
      await deleteServiceDeskRequest(requestId)
      await fetchRequests()
    } catch (err) {
      console.error("Error deleting request:", err)
      setError("Failed to delete request")
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  async function handleRefresh() {
    setIsRefreshing(true)
    await fetchRequests()
  }

  function handleRequestClick(request: ServiceDeskRequest) {
    setSelectedRequest(request)
    setIsDialogOpen(true)
  }

  function getStatusColor(status: string) {
    switch (status?.toLowerCase() || "") {
      case "open":
      case "new":
      case "initialisation":
        return "bg-primary/20 text-primary border-primary/50"
      case "in progress":
      case "waiting for support":
        return "bg-primary/20 text-primary border-primary/50"
      case "resolved":
      case "closed":
        return "bg-primary/20 text-primary border-primary/50"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  function getRequestName(request: ServiceDeskRequest): string {
    const summaryField = request.requestFieldValues?.find(
      (field) => field.fieldId === "summary" || field.label?.toLowerCase() === "résumé",
    )
    return summaryField?.value || request.issueKey || "Untitled Request"
  }

  function getInitials(displayName: string | undefined): string {
    if (!displayName) return "??"
    return displayName
      .split(" ")
      .map((n) => n[0] || "")
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  function getAvatarUrl(reporter: any): string | undefined {
    return reporter?._links?.avatarUrls?.["48x48"] || undefined
  }

  function formatDate(epochMillis: number): string {
    return new Date(epochMillis).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  function getPriorityName(priorityValue: any): string {
    if (typeof priorityValue === 'object' && priorityValue !== null) {
      return priorityValue.name || 'Unknown'
    }
    return String(priorityValue || 'Unknown')
  }

  if (loading && !isRefreshing) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-card">
            <CardHeader>
              <Skeleton className="h-4 w-1/3 bg-muted" />
              <Skeleton className="h-3 w-1/2 bg-muted" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-3 w-full bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Service Requests</h2>
          <p className="text-muted-foreground mt-1 text-sm">Click on any request to view details</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-accent/50 border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200"
          >
            <Filter className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-accent/50 border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200"
          >
            <RefreshCw className={`h-4 w-4 sm:mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </Button>
        </div>
      </div>

      {error && (
        <Card className="bg-destructive/10 border-destructive/20">
          <CardContent className="flex items-center space-x-2 p-4">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {requests.length === 0 && !loading && !error && (
        <Card className="bg-card">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Ticket className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Service Requests</h3>
            <p className="text-muted-foreground">You don't have any service desk requests yet.</p>
          </CardContent>
        </Card>
      )}

      {requests.length > 0 && (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <Card className="bg-card overflow-hidden">
              <CardHeader className="bg-accent/50 border-b border-border">
                <CardTitle className="text-foreground flex items-center space-x-2">
                  <Ticket className="h-5 w-5 text-primary" />
                  <span>Service Desk Requests</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Manage and track your service desk requests
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-accent/30">
                        <th className="text-left py-4 px-6 text-muted-foreground font-medium">Request</th>
                        <th className="text-left py-4 px-6 text-muted-foreground font-medium">Reporter</th>
                        <th className="text-left py-4 px-6 text-muted-foreground font-medium">Status</th>
                        <th className="text-left py-4 px-6 text-muted-foreground font-medium">Created</th>
                        <th className="text-left py-4 px-6 text-muted-foreground font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((request) => (
                        <tr
                          key={request.issueId}
                          className="border-b border-border hover:bg-accent/30 transition-all duration-200 cursor-pointer group"
                          onClick={() => handleRequestClick(request)}
                        >
                          <td className="py-4 px-6">
                            <div>
                              <p className="text-foreground font-medium group-hover:text-primary transition-colors">
                                {getRequestName(request)}
                              </p>
                              <p className="text-sm text-muted-foreground">{request.issueKey}</p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8 ring-2 ring-transparent group-hover:ring-primary/50 transition-all">
                                <AvatarImage src={getAvatarUrl(request.reporter) || "/placeholder.svg"} />
                                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                  {getInitials(request.reporter?.displayName)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-foreground text-sm">{request.reporter?.displayName || "Unknown"}</p>
                                <p className="text-muted-foreground text-xs">{request.reporter?.emailAddress || "No email"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <Badge className={getStatusColor(request.currentStatus?.status || "")}>
                              {request.currentStatus?.status || "Unknown"}
                            </Badge>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-foreground text-sm">{request.createdDate?.friendly || "Unknown"}</p>
                            <p className="text-muted-foreground text-xs">
                              {request.createdDate?.epochMillis
                                ? new Date(request.createdDate.epochMillis).toLocaleDateString()
                                : "No date"}
                            </p>
                          </td>
                          <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10  text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary hover:bg-primary/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Add edit functionality
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => {
                            console.log("Request deleted" + request.issueId)
                            e.stopPropagation();
                            deleteRequest(request.issueId)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tablet View */}
          <div className="hidden md:block lg:hidden">
            <div className="grid gap-4">
              {requests.map((request) => (
                <Card
                  key={request.issueId}
                  className="bg-card cursor-pointer hover:bg-accent/50 hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 group"
                  onClick={() => handleRequestClick(request)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-foreground font-semibold group-hover:text-primary transition-colors">
                          {getRequestName(request)}
                        </h3>
                        <p className="text-muted-foreground text-sm">{request.issueKey}</p>
                      </div>
                      <Badge className={getStatusColor(request.currentStatus?.status || "")}>
                        {request.currentStatus?.status || "Unknown"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={getAvatarUrl(request.reporter) || "/placeholder.svg"} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {getInitials(request.reporter?.displayName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-foreground text-sm">{request.reporter?.displayName || "Unknown"}</p>
                          <p className="text-muted-foreground text-xs">{request.createdDate?.friendly || "Unknown"}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary hover:bg-primary/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Add edit functionality
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteRequest(request.issueId)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {requests.map((request) => (
              <Card
                key={request.issueId}
                className="bg-card cursor-pointer hover:bg-accent/50 hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 group"
                onClick={() => handleRequestClick(request)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-foreground text-base group-hover:text-primary transition-colors truncate">
                        {getRequestName(request)}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground flex items-center space-x-2 mt-1">
                        <span>{request.issueKey}</span>
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(request.currentStatus?.status || "")} ml-2 shrink-0`}>
                      {request.currentStatus?.status || "Unknown"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex items-center space-x-2 min-w-0">
                      <Avatar className="h-6 w-6 shrink-0">
                        <AvatarImage src={getAvatarUrl(request.reporter) || "/placeholder.svg"} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getInitials(request.reporter?.displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-foreground text-sm truncate">{request.reporter?.displayName || "Unknown"}</p>
                        <p className="text-muted-foreground text-xs truncate">
                          {request.reporter?.emailAddress || "No email"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-foreground text-sm">{request.createdDate?.friendly || "Unknown"}</p>
                      <p className="text-muted-foreground text-xs">
                        {request.createdDate?.epochMillis
                          ? new Date(request.createdDate.epochMillis).toLocaleDateString()
                          : "No date"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Request Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground flex items-center space-x-2">
              <Ticket className="h-5 w-5 text-primary" />
              <span>{selectedRequest ? getRequestName(selectedRequest) : ""}</span>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Request Details - {selectedRequest?.issueKey}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* Status and Key Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Request Key</label>
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-primary" />
                    <span className="text-foreground font-mono">{selectedRequest.issueKey}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm mx-4 font-medium text-muted-foreground">Status</label>
                  <Badge className={getStatusColor(selectedRequest.currentStatus?.status || "")}>
                    {selectedRequest.currentStatus?.status || "Unknown"}
                  </Badge>
                </div>
              </div>

              <Separator className="bg-border" />

              {/* Reporter Information */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>Reporter</span>
                </h3>
                <div className="flex items-center space-x-4 p-4 bg-accent/50 rounded-lg border border-border">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/50">
                    <AvatarImage src={getAvatarUrl(selectedRequest.reporter) || "/placeholder.svg"} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(selectedRequest.reporter?.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-foreground font-medium">{selectedRequest.reporter?.displayName || "Unknown"}</p>
                    <p className="text-muted-foreground text-sm">{selectedRequest.reporter?.emailAddress || "No email"}</p>
                    <p className="text-muted-foreground text-xs">Account ID: {selectedRequest.reporter?.accountId || "N/A"}</p>
                  </div>
                </div>
              </div>

              <Separator className="bg-border" />

              {/* Timeline */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>Timeline</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-accent/50 rounded-lg border border-border">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <p className="text-foreground font-medium">Request Created</p>
                      <p className="text-muted-foreground text-sm">
                        {selectedRequest.createdDate?.epochMillis
                          ? formatDate(selectedRequest.createdDate.epochMillis)
                          : "Unknown date"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-accent/50 rounded-lg border border-border">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <p className="text-foreground font-medium">Status Updated</p>
                      <p className="text-muted-foreground text-sm">
                        {selectedRequest.currentStatus?.statusDate?.epochMillis
                          ? formatDate(selectedRequest.currentStatus.statusDate.epochMillis)
                          : "Unknown date"}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Changed to: {selectedRequest.currentStatus?.status || "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-border" />

              {/* Additional Fields */}
              {selectedRequest.requestFieldValues && selectedRequest.requestFieldValues.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <span>Request Details</span>
                  </h3>
                  <div className="grid gap-4">
                    {selectedRequest.requestFieldValues.map((field, index) => (
                      <div key={index} className="p-4 bg-accent/50 rounded-lg border border-border">
                        <label className="text-sm font-medium text-muted-foreground">{field.label || field.fieldId}</label>
                        <p className="text-foreground mt-2 whitespace-pre-wrap">
                          {typeof field.value === 'object' ? getPriorityName(field.value) : field.value || "No value"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Service Desk Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-accent/50 rounded-lg border border-border">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Service Desk ID</label>
                  <p className="text-foreground">{selectedRequest.serviceDeskId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Request Type ID</label>
                  <p className="text-foreground">{selectedRequest.requestTypeId}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
