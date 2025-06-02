import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ServiceRequests } from "@/components/service-requests"
import { getUser, getServiceDeskRequests, type ServiceDeskRequest } from "@/lib/auth"
import { BarChart3, Ticket, Clock, CheckCircle, TrendingUp, Users, Wifi, WifiOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default async function DashboardPage() {
  const user = await getUser()
  let requests: ServiceDeskRequest[] = []
  let error = null
  let isUsingMockData = false

  try {
    const data = await getServiceDeskRequests()
    requests = Array.isArray(data) ? data : []
    isUsingMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true"
  } catch (err) {
    console.error("Error fetching requests:", err)
    error = "Failed to load service desk requests from API"
  }

  const stats = {
    total: requests.length,
    open: requests.filter((r) => ["open", "new", "in progress"].includes((r.currentStatus?.status || "").toLowerCase()))
      .length,
    resolved: requests.filter((r) => ["resolved", "closed"].includes((r.currentStatus?.status || "").toLowerCase()))
      .length,
    pending: requests.filter((r) => (r.currentStatus?.status || "").toLowerCase().includes("waiting")).length,
  }

  const recentRequests = requests.slice(0, 3)

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
          Welcome back, {user?.displayName || "User"}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Here's an overview of your service desk requests and team activity
        </p>
      </div>

      {/* API Status Indicators */}
      {isUsingMockData && (
        <Alert className="bg-primary/10 border-primary/20 text-primary">
          <Wifi className="h-4 w-4" />
          <AlertDescription>
            Currently using demo data. Set NEXT_PUBLIC_USE_MOCK_DATA=false to use real Jira API.
          </AlertDescription>
        </Alert>
      )}

      {error && !isUsingMockData && (
        <Alert className="bg-destructive/10 border-destructive/20 text-destructive">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>{error}. Please check your Jira credentials and network connection.</AlertDescription>
        </Alert>
      )}

      {!error && !isUsingMockData && requests.length > 0 && (
        <Alert className="bg-primary/10 border-primary/20 text-primary">
          <Wifi className="h-4 w-4" />
          <AlertDescription>Connected to Jira API successfully. Showing live data.</AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="bg-card hover:bg-accent/50 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-foreground">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">All time requests</p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-primary mr-1" />
              <span className="text-xs text-primary">+12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card hover:bg-accent/50 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Requests</CardTitle>
            <Ticket className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-foreground">{stats.open}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently active</p>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.total > 0 ? (stats.open / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card hover:bg-accent/50 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-foreground">{stats.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting response</p>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card hover:bg-accent/50 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-foreground">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground mt-1">Completed requests</p>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 bg-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentRequests.length > 0 ? (
              recentRequests.map((request) => (
                <div
                  key={request.issueId}
                  className="flex items-center space-x-3 p-3 bg-accent/50 rounded-lg border border-border hover:bg-accent transition-all duration-200"
                >
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-sm font-medium truncate">
                      {request.requestFieldValues?.find((f) => f.fieldId === "summary")?.value || request.issueKey}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {request.currentStatus?.status} • {request.createdDate?.friendly}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">No recent activity</p>
            )}
          </CardContent>
        </Card>

        {/* Team Stats */}
        {/* <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Team Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Active Agents</span>
                <span className="text-foreground font-semibold">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Avg Response Time</span>
                <span className="text-foreground font-semibold">2.4h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Resolution Rate</span>
                <span className="text-primary font-semibold">94%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Customer Satisfaction</span>
                <span className="text-primary font-semibold">4.8/5</span>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Service Requests Section */}
      <div className="space-y-4">

        <ServiceRequests />
      </div>
    </div>
  )
}
