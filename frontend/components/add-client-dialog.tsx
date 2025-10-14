"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePaymentStore } from "@/store/payment-store";
import { useToast } from "@/hooks/use-toast";

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddClientDialog({ open, onOpenChange }: AddClientDialogProps) {
  const [loading, setLoading] = useState(false);
  const { addClient } = usePaymentStore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      await addClient({
        name: formData.get("name") as string,
        companyName: formData.get("companyName") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        gstNumber: formData.get("gstNumber") as string,
        panNumber: formData.get("panNumber") as string,
        creditLimit:
          parseFloat(formData.get("creditLimit") as string) || 100000,
      });

      toast({
        title: "✅ Client Added Successfully",
        description: "New client has been added to the system.",
      });

      onOpenChange(false);
      e.currentTarget.reset();
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to add client. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[500px]"
        aria-describedby="add-client-description"
      >
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <p
            id="add-client-description"
            className="text-sm text-muted-foreground sr-only"
          >
            Fill in the form to add a new client
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Client Name *</Label>
            <Input id="name" name="name" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input id="companyName" name="companyName" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" name="email" type="email" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input id="phone" name="phone" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gstNumber">GST Number</Label>
              <Input id="gstNumber" name="gstNumber" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="panNumber">PAN Number</Label>
              <Input id="panNumber" name="panNumber" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="creditLimit">Credit Limit (₹)</Label>
            <Input
              id="creditLimit"
              name="creditLimit"
              type="number"
              defaultValue="100000"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Client"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
