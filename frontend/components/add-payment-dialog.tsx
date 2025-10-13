"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePaymentStore } from "@/store/payment-store"
import { useToast } from "@/hooks/use-toast"

export function AddPaymentDialog() {
  const [open, setOpen] = useState(false)
  const [paymentType, setPaymentType] = useState("cheque")
  const [loading, setLoading] = useState(false)
  const { addCheque, addCashTransaction } = usePaymentStore()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      if (paymentType === "cheque") {
        await addCheque({
          clientName: formData.get("clientName") as string,
          chequeNumber: formData.get("chequeNumber") as string,
          bankName: formData.get("bankName") as string,
          amount: parseFloat(formData.get("amount") as string),
          dueDate: formData.get("dueDate") as string,
          status: formData.get("status") as any,
        })
      } else {
        await addCashTransaction({
          clientName: formData.get("clientName") as string,
          receiptNumber: formData.get("receiptNumber") as string,
          amount: parseFloat(formData.get("amount") as string),
          date: formData.get("date") as string,
          verified: true,
        })
      }

      toast({
        title: "✅ Payment Added Successfully",
        description: `${paymentType === "cheque" ? "Cheque" : "Cash transaction"} has been recorded.`,
      })
      
      setOpen(false)
      e.currentTarget.reset()
    } catch (error) {
      toast({
        title: "⚠️ Warning",
        description: "Payment added locally. Backend connection failed.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Payment Type</Label>
            <Select value={paymentType} onValueChange={setPaymentType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input id="clientName" name="clientName" required />
          </div>

          {paymentType === "cheque" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="chequeNumber">Cheque Number</Label>
                <Input id="chequeNumber" name="chequeNumber" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input id="bankName" name="bankName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" name="dueDate" type="date" required />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select name="status" defaultValue="Pending">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Post-Dated">Post-Dated</SelectItem>
                    <SelectItem value="Cleared">Cleared</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="receiptNumber">Receipt Number</Label>
                <Input id="receiptNumber" name="receiptNumber" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" required />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input id="amount" name="amount" type="number" step="0.01" required />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Payment"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}