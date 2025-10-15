"use client"

import { useEffect, useState } from "react"
import { usePaymentStore } from "@/store/payment-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"
import { AddClientDialog } from "@/components/add-client-dialog"
import { RiskDashboard } from "@/components/risk-dashboard"  // ← ADD THIS

export default function ClientsPage() {
  const { clients, fetchClients, loading } = usePaymentStore()
  const [addClientOpen, setAddClientOpen] = useState(false)

  useEffect(() => {
    fetchClients()
  }, [])

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-red-500'
      case 'Medium': return 'bg-yellow-500'
      case 'Low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'High': return AlertTriangle
      case 'Medium': return TrendingUp
      case 'Low': return CheckCircle
      default: return CheckCircle
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading clients...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Client Management
            </h1>
            <p className="text-muted-foreground">Manage clients and monitor risk scores</p>
          </div>
          <Button 
            onClick={() => setAddClientOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>

        <RiskDashboard />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">High Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {clients.filter(c => c.riskLevel === 'High').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Medium Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {clients.filter(c => c.riskLevel === 'Medium').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Low Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {clients.filter(c => c.riskLevel === 'Low').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Client List */}
        <Card>
          <CardHeader>
            <CardTitle>All Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clients.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No clients found. Add your first client!</p>
                </div>
              ) : (
                clients.map((client) => {
                  const RiskIcon = getRiskIcon(client.riskLevel)
                  return (
                    <div
                      key={client._id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-white/80 to-blue-50/80 dark:from-slate-800/80 dark:to-blue-900/20 rounded-xl border border-white/40 dark:border-slate-700/40 hover:shadow-lg transition-all"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-lg">{client.name}</h4>
                          <Badge className={`${getRiskColor(client.riskLevel)} text-white`}>
                            <RiskIcon className="h-3 w-3 mr-1" />
                            {client.riskLevel} Risk
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Company</p>
                            <p className="font-medium">{client.companyName || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Email</p>
                            <p className="font-medium">{client.email}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Risk Score</p>
                            <p className="font-bold text-lg">{client.riskScore}/100</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Outstanding</p>
                            <p className="font-bold text-lg">₹{client.outstandingAmount.toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Credit Limit</p>
                          <p className="text-sm font-semibold">₹{client.creditLimit.toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Bounces</p>
                          <p className="text-sm font-semibold text-red-600">{client.bounceCount}</p>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <AddClientDialog open={addClientOpen} onOpenChange={setAddClientOpen} />
    </div>
  )
}