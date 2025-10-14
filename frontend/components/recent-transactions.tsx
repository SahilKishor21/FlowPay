"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"
import { usePaymentStore } from "@/store/payment-store"

export function RecentTransactions() {
  const cheques = usePaymentStore((state) => state.cheques)
  const cashTransactions = usePaymentStore((state) => state.cashTransactions)

  // Calculate recent activity directly in component
  const getRecentActivity = () => {
    const activities: any[] = []

    // Get last 3 cheques
    const recentCheques = cheques.slice(-3).reverse()
    recentCheques.forEach(c => {
      activities.push({
        id: `cheque-${c._id}`,
        description: `Cheque ${c.chequeNumber} - ${c.status}`,
        timestamp: new Date(c.dueDate).toLocaleDateString('en-IN'),
        type: c.status === 'Cleared' ? 'success' : c.status === 'Bounced' ? 'warning' : 'info',
      })
    })

    // Get last 2 cash transactions
    const recentCash = cashTransactions.slice(-2).reverse()
    recentCash.forEach(t => {
      activities.push({
        id: `cash-${t._id}`,
        description: `Cash payment received from ${t.clientName}`,
        timestamp: new Date(t.date).toLocaleDateString('en-IN'),
        type: 'success',
      })
    })

    return activities.slice(0, 5)
  }

  const recentActivity = getRecentActivity()

  return (
    <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg border-white/20 dark:border-slate-800/50 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentActivity.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No recent activity</p>
          </div>
        ) : (
          recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-lg"
            >
              <div>
                <p className="font-medium text-sm">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${
                activity.type === "success" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                activity.type === "warning" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              }`}>
                {activity.type}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}