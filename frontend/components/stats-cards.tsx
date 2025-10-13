"use client"

import { IndianRupee, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePaymentStore } from "@/store/payment-store"

export function StatsCards() {
  const { stats } = usePaymentStore()

  const cards = [
    {
      title: "Total Outstanding",
      value: `₹${stats.totalOutstanding.toLocaleString('en-IN')}`,
      icon: IndianRupee,
      gradient: "from-blue-500 to-cyan-500",
      change: "Pending payments"
    },
    {
      title: "Pending Cheques",
      value: stats.pendingCheques,
      icon: AlertCircle,
      gradient: "from-purple-500 to-pink-500",
      change: `${stats.pendingCheques} items`
    },
    {
      title: "Cleared This Month",
      value: `₹${stats.clearedThisMonth.toLocaleString('en-IN')}`,
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-500",
      change: "Current month"
    },
    {
      title: "Bounce Rate",
      value: `${stats.bounceRate}%`,
      icon: TrendingUp,
      gradient: "from-orange-500 to-red-500",
      change: stats.bounceRate > 5 ? "High risk" : "Normal"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg border-white/20 dark:border-slate-800/50 shadow-xl hover:shadow-2xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg bg-gradient-to-br ${card.gradient}`}>
              <card.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{card.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}