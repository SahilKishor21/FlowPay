"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePaymentStore } from "@/store/payment-store"
import { ShieldAlert, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export function RiskSummaryCard() {
  const { clients } = usePaymentStore()
  const router = useRouter()

  const highRisk = clients.filter(c => c.riskLevel === 'High').length
  const mediumRisk = clients.filter(c => c.riskLevel === 'Medium').length
  const lowRisk = clients.filter(c => c.riskLevel === 'Low').length

  return (
    <Card 
      className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg border-white/20 dark:border-slate-800/50 shadow-xl cursor-pointer hover:shadow-2xl transition-all"
      onClick={() => router.push('/clients')}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-orange-500" />
            Client Risk Assessment
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
          <span className="text-sm font-medium">High Risk</span>
          <span className="text-lg font-bold text-red-600 dark:text-red-400">{highRisk}</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
          <span className="text-sm font-medium">Medium Risk</span>
          <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{mediumRisk}</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
          <span className="text-sm font-medium">Low Risk</span>
          <span className="text-lg font-bold text-green-600 dark:text-green-400">{lowRisk}</span>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-3">
          Click to view detailed risk analysis
        </p>
      </CardContent>
    </Card>
  )
}