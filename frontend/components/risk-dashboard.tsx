"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePaymentStore } from "@/store/payment-store"
import { AlertTriangle, TrendingUp, CheckCircle, Users } from "lucide-react"
import { useRouter } from "next/navigation"

export function RiskDashboard() {
  const { clients } = usePaymentStore()
  const router = useRouter()

  const highRisk = clients.filter(c => c.riskLevel === 'High').length
  const mediumRisk = clients.filter(c => c.riskLevel === 'Medium').length
  const lowRisk = clients.filter(c => c.riskLevel === 'Low').length
  const avgRiskScore = clients.length > 0 
    ? Math.round(clients.reduce((sum, c) => sum + c.riskScore, 0) / clients.length)
    : 0

  const cards = [
    {
      title: "High Risk Clients",
      value: highRisk,
      icon: AlertTriangle,
      gradient: "from-red-500 to-pink-500",
      change: `${((highRisk / (clients.length || 1)) * 100).toFixed(1)}% of total`
    },
    {
      title: "Medium Risk Clients",
      value: mediumRisk,
      icon: TrendingUp,
      gradient: "from-yellow-500 to-orange-500",
      change: `${((mediumRisk / (clients.length || 1)) * 100).toFixed(1)}% of total`
    },
    {
      title: "Low Risk Clients",
      value: lowRisk,
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-500",
      change: `${((lowRisk / (clients.length || 1)) * 100).toFixed(1)}% of total`
    },
    {
      title: "Avg Risk Score",
      value: avgRiskScore,
      icon: Users,
      gradient: "from-blue-500 to-purple-500",
      change: avgRiskScore < 30 ? "Healthy" : avgRiskScore < 60 ? "Moderate" : "Critical"
    }
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Client Risk Assessment
        </h2>
        <button 
          onClick={() => router.push('/clients')}
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline"
        >
          View All Clients →
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <Card 
            key={index} 
            className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg border-white/20 dark:border-slate-800/50 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
            onClick={() => router.push('/clients')}
          >
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
    </div>
  )
}