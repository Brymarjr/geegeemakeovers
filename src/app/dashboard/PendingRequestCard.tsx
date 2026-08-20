"use client";

import { useState } from "react";
import { format } from "date-fns";
import { confirmAppointment, cancelAppointment } from "@/actions/appointments";

// Helper to extract the local date string for Redis invalidation
const getLocalDateString = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function PendingRequestCard({ appointment }: { appointment: any }) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [price, setPrice] = useState("");

  const handleConfirm = async () => {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) return;

    setIsProcessing(true);
    await confirmAppointment(appointment.id, numPrice);
    setIsProcessing(false);
  };

  const handleCancel = async () => {
    setIsProcessing(true);
    const dateString = getLocalDateString(new Date(appointment.startTime));
    await cancelAppointment(appointment.id, dateString);
    setIsProcessing(false);
  };

  return (
    <div className="bg-background border border-border p-6 flex flex-col justify-between">
      <div>
        <h3 className="font-medium text-lg">{appointment.clientName}</h3>
        <p className="text-sm text-muted-foreground mb-4">{appointment.clientPhone}</p>
        
        <div className="space-y-1 text-sm font-light">
          <p><span className="font-medium">Date:</span> {format(new Date(appointment.startTime), "MMMM do, yyyy")}</p>
          <p><span className="font-medium">Time:</span> {format(new Date(appointment.startTime), "h:mm a")}</p>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-border">
        {isConfirming ? (
          <div className="space-y-3 animate-in fade-in duration-300">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <input 
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full h-10 pl-8 pr-4 border border-border bg-background focus:outline-none focus:border-primary text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleConfirm}
                disabled={!price || isProcessing}
                className="flex-1 bg-foreground text-background text-sm font-medium h-10 hover:bg-foreground/90 transition-colors disabled:opacity-50"
              >
                {isProcessing ? "Saving..." : "Save Price"}
              </button>
              <button 
                onClick={() => setIsConfirming(false)}
                disabled={isProcessing}
                className="flex-1 border border-border text-foreground text-sm font-medium h-10 hover:bg-secondary transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            <button 
              onClick={() => setIsConfirming(true)}
              disabled={isProcessing}
              className="flex-1 bg-foreground text-background text-sm font-medium h-10 hover:bg-foreground/90 transition-colors"
            >
              Confirm
            </button>
            <button 
              onClick={handleCancel}
              disabled={isProcessing}
              className="flex-1 border border-border text-foreground text-sm font-medium h-10 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}