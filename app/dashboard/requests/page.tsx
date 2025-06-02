import { ServiceRequests } from "@/components/service-requests"

export default function RequestsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Service Requests</h1>
        <p className="text-gray-400">View and manage all your service desk requests</p>
      </div>

      <ServiceRequests />
    </div>
  )
}
