"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePaymentStore } from "@/store/payment-store";
import { useToast } from "@/hooks/use-toast";
import { OCRUpload } from "./ocr-upload";
import { ClientSelector } from "./client-selector";
import { AddClientDialog } from "./add-client-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AddPaymentDialog() {
  const [open, setOpen] = useState(false);
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [paymentType, setPaymentType] = useState("cheque");
  const [status, setStatus] = useState("Pending");
  const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [ocrData, setOcrData] = useState<any>(null);

  const { addCheque, addCashTransaction, clients } = usePaymentStore();
  const { toast } = useToast();

  const handleOCRDataExtracted = (data: any) => {
    setOcrData(data);

    // Auto-fill form with OCR data
    const form = document.getElementById("payment-form") as HTMLFormElement;
    if (form) {
      if (data.chequeNumber) {
        (form.elements.namedItem("chequeNumber") as HTMLInputElement).value =
          data.chequeNumber;
      }
      if (data.amount) {
        (form.elements.namedItem("amount") as HTMLInputElement).value =
          data.amount;
      }
      if (data.bankName) {
        (form.elements.namedItem("bankName") as HTMLInputElement).value =
          data.bankName;
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Store form reference BEFORE async operations
    const form = e.currentTarget;

    setLoading(true);

    const formData = new FormData(form);

    try {
      const selectedClientData = clients.find((c) => c._id === selectedClient);

      if (paymentType === "cheque") {
        const chequeData: any = {
          clientName:
            (formData.get("clientName") as string) || selectedClientData?.name,
          chequeNumber: formData.get("chequeNumber") as string,
          bankName: formData.get("bankName") as string,
          amount: parseFloat(formData.get("amount") as string),
          dueDate: formData.get("dueDate") as string,
          status: status as any,
        };

        if (selectedClient && selectedClient.trim() !== "") {
          chequeData.clientId = selectedClient;
        }

        if (ocrData) {
          chequeData.ocrData = ocrData;
        }

        await addCheque(chequeData);

        toast({
          title: "✅ Payment Added Successfully",
          description: "Cheque has been recorded in the database.",
        });
      } else {
        const denominations = [
          {
            value: 2000,
            count: parseInt(formData.get("denom_2000") as string) || 0,
          },
          {
            value: 500,
            count: parseInt(formData.get("denom_500") as string) || 0,
          },
          {
            value: 200,
            count: parseInt(formData.get("denom_200") as string) || 0,
          },
          {
            value: 100,
            count: parseInt(formData.get("denom_100") as string) || 0,
          },
          {
            value: 50,
            count: parseInt(formData.get("denom_50") as string) || 0,
          },
          {
            value: 20,
            count: parseInt(formData.get("denom_20") as string) || 0,
          },
          {
            value: 10,
            count: parseInt(formData.get("denom_10") as string) || 0,
          },
        ]
          .map((d) => ({
            ...d,
            total: d.value * d.count,
          }))
          .filter((d) => d.count > 0);

        const cashData: any = {
          clientName:
            (formData.get("clientName") as string) || selectedClientData?.name,
          receiptNumber: formData.get("receiptNumber") as string,
          amount: parseFloat(formData.get("amount") as string),
          date: formData.get("date") as string,
          verified: true,
          denominationBreakdown: denominations,
        };

        if (selectedClient && selectedClient.trim() !== "") {
          cashData.clientId = selectedClient;
        }

        await addCashTransaction(cashData);

        toast({
          title: "✅ Payment Added Successfully",
          description: "Cash transaction has been recorded in the database.",
        });
      }

      // Reset state and close dialog
      setOpen(false);
      setPaymentType("cheque");
      setStatus("Pending");
      setSelectedClient("");
      setOcrData(null);

      // Reset form using stored reference
      form.reset();
    } catch (error: any) {
      console.error("Error adding payment:", error);

      let errorMessage = "Failed to add payment. Please try again.";

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "❌ Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Payment
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
          aria-describedby="add-payment-description"
        >
          <DialogHeader>
            <DialogTitle>Add New Payment</DialogTitle>
            <p
              id="add-payment-description"
              className="text-sm text-muted-foreground sr-only"
            >
              Fill in the form to add a new payment transaction
            </p>
          </DialogHeader>
          <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
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
              <Label>Select Client</Label>
              <ClientSelector
                value={selectedClient}
                onValueChange={setSelectedClient}
                onAddNew={() => {
                  setAddClientOpen(true);
                }}
              />
            </div>

            {!selectedClient && (
              <div className="space-y-2">
                <Label htmlFor="clientName">Or Enter Client Name</Label>
                <Input id="clientName" name="clientName" />
              </div>
            )}

            {paymentType === "cheque" ? (
              <>
                <Tabs defaultValue="manual" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                    <TabsTrigger value="ocr">Scan Cheque (OCR)</TabsTrigger>
                  </TabsList>

                  <TabsContent value="manual" className="space-y-4">
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
                      <Label htmlFor="amount">Amount (₹)</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        required
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="ocr" className="space-y-4">
                    <OCRUpload onDataExtracted={handleOCRDataExtracted} />

                    {ocrData && (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-sm font-semibold text-green-700 dark:text-green-300 mb-2">
                          ✅ Data Extracted ({Math.round(ocrData.confidence)}%
                          confidence)
                        </p>
                        <div className="text-xs space-y-1">
                          {ocrData.chequeNumber && (
                            <p>Cheque #: {ocrData.chequeNumber}</p>
                          )}
                          {ocrData.amount && <p>Amount: ₹{ocrData.amount}</p>}
                          {ocrData.bankName && <p>Bank: {ocrData.bankName}</p>}
                        </div>
                      </div>
                    )}

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
                      <Label htmlFor="amount">Amount (₹)</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        required
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Post-Dated">Post-Dated</SelectItem>
                      <SelectItem value="Cleared">Cleared</SelectItem>
                      <SelectItem value="Bounced">Bounced</SelectItem>
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
                <div className="space-y-2">
                  <Label htmlFor="amount">Total Amount (₹)</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Denomination Breakdown</Label>
                  <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    {[2000, 500, 200, 100, 50, 20, 10].map((value) => (
                      <div key={value} className="flex items-center gap-2">
                        <Label className="w-16">₹{value}:</Label>
                        <Input
                          type="number"
                          name={`denom_${value}`}
                          placeholder="0"
                          min="0"
                          className="w-20"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

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

      <AddClientDialog open={addClientOpen} onOpenChange={setAddClientOpen} />
    </>
  );
}
