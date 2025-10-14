"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { usePaymentStore } from "@/store/payment-store"

export function PaymentCalendar() {
  const cheques = usePaymentStore((state) => state.cheques)

  // Calculate upcoming payments directly in component
  const getUpcomingPayments = () => {
    const today = new Date()
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

    return cheques
      .filter(c => {
        const dueDate = new Date(c.dueDate)
        return (
          (c.status === 'Pending' || c.status === 'Post-Dated') &&
          dueDate >= today &&
          dueDate <= nextMonth
        )
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5)
      .map(c => ({
        id: c._id,
        clientName: c.clientName,
        amount: c.amount,
        date: c.dueDate,
      }))
  }

  const upcomingPayments = getUpcomingPayments()

  return (
    <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg border-white/20 dark:border-slate-800/50 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5" />
          Upcoming Payments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcomingPayments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No upcoming payments in next 30 days
          </p>
        ) : (
          upcomingPayments.map((payment) => (
            <div
              key={payment.id}
              className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg border border-blue-200/50 dark:border-blue-800/50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-sm">{payment.clientName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(payment.date).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  ₹{payment.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}