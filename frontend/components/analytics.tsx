"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import { usePaymentStore } from "@/store/payment-store"

export function Analytics() {
  const { cheques, cashTransactions } = usePaymentStore()
  const [metrics, setMetrics] = useState({
    avgCollectionTime: 0,
    riskScore: "Low",
    accuracy: 0,
  })

  useEffect(() => {
    const clearedCheques = cheques.filter(c => c.status === 'Cleared')
    const totalCheques = cheques.length
    
    const avgTime = clearedCheques.length > 0 ? 28 : 0
    
    const bouncedCount = cheques.filter(c => c.status === 'Bounced').length
    const riskScore = bouncedCount > 2 ? "High" : bouncedCount > 0 ? "Medium" : "Low"
    
    const totalTransactions = cheques.length + cashTransactions.length
    const successfulTransactions = clearedCheques.length + cashTransactions.filter(t => t.verified).length
    const accuracy = totalTransactions > 0 
      ? Math.round((successfulTransactions / totalTransactions) * 100)
      : 0

    setMetrics({
      avgCollectionTime: avgTime,
      riskScore,
      accuracy,
    })
  }, [cheques, cashTransactions])

  const metricsData = [
    { 
      label: "Avg. Collection Time", 
      value: `${metrics.avgCollectionTime} days`, 
      change: metrics.avgCollectionTime > 30 ? "Needs attention" : "Good" 
    },
    { 
      label: "Client Risk Score", 
      value: metrics.riskScore, 
      change: metrics.riskScore === "Low" ? "Improved" : "Monitor" 
    },
    { 
      label: "Payment Accuracy", 
      value: `${metrics.accuracy}%`, 
      change: metrics.accuracy > 90 ? "Excellent" : "Needs improvement" 
    },
  ]

  return (
    <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg border-white/20 dark:border-slate-800/50 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5" />
          Key Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metricsData.map((metric, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{metric.label}</span>
              <span className={`text-xs ${
                metric.change.includes("Good") || metric.change.includes("Excellent") || metric.change.includes("Improved")
                  ? "text-green-600 dark:text-green-400"
                  : "text-orange-600 dark:text-orange-400"
              }`}>
                {metric.change}
              </span>
            </div>
            <p className="text-xl font-bold">{metric.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}