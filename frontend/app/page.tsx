"use client"

import { useEffect, useRef } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatsCards } from "@/components/stats-cards"
import { PaymentTabs } from "@/components/payment-tabs"
import { PaymentCalendar } from "@/components/payment-calendar"
import { RecentTransactions } from "@/components/recent-transactions"
import { Analytics } from "@/components/analytics"
import { usePaymentStore } from "@/store/payment-store"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wifi, WifiOff } from "lucide-react"

export default function Home() {
  const { backendConnected, initialized, loading } = usePaymentStore()
  const hasInitialized = useRef(false)

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true
      usePaymentStore.getState().initializeStore()
    }
  }, [])

  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading payment data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <DashboardHeader />
        
        {!backendConnected && (
          <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <WifiOff className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800 dark:text-yellow-200">
              ⚠️ Backend not connected. Please start the backend server on port 5000.
            </AlertDescription>
          </Alert>
        )}

        {backendConnected && (
          <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <Wifi className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              ✅ Connected to backend - All data is being saved to database
            </AlertDescription>
          </Alert>
        )}
        
        <StatsCards />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PaymentTabs />
            <RecentTransactions />
          </div>
          
          <div className="space-y-6">
            <PaymentCalendar />
            <Analytics />
          </div>
        </div>
      </div>
    </div>
  )
}