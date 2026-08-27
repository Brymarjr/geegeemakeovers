"use client";

import { useState } from "react";
import { format } from "date-fns";
import { confirmAppointment, cancelAppointment } from "@/actions/appointments";

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
    <div className="bg-white border border-border rounded-[16px] p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
      <div>
        <div className="mb-3">
          <span className="bg-[#FBEAD3] text-[#8A5A12] text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-[0.03em]">
            Pending
          </span>
        </div>
        <h3 className="font-fraunces font-bold text-lg text-wine-deep">{appointment.clientName}</h3>
        <p className="text-[13px] text-ink-soft mb-1">{appointment.clientPhone} · {appointment.numberOfPeople} {appointment.numberOfPeople === 1 ? 'person' : 'people'}</p>
        
        {appointment.location && (
          <p className="text-[13px] text-wine-deep font-semibold mb-3">📍 Location: {appointment.location}</p>
        )}

        <div className="space-y-1 text-[13.5px] text-ink-soft mt-2">
          <p><span className="font-bold text-wine-deep">Date:</span> {format(new Date(appointment.startTime), "MMMM do, yyyy")}</p>
          <p><span className="font-bold text-wine-deep">Time:</span> {format(new Date(appointment.startTime), "h:mm a")}</p>
        </div>
      </div>
      
      <div className="mt-5 pt-4 border-t border-border/50">
        {isConfirming ? (
          <div className="space-y-3 animate-in fade-in duration-300">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft font-bold">$</span>
              <input 
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full h-11 pl-8 pr-4 rounded-[10px] border-[1.5px] border-border bg-white focus:outline-none focus:border-gold text-[14px]"
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleConfirm}
                disabled={!price || isProcessing}
                className="flex-1 bg-emerald text-white text-[13px] font-bold h-10 rounded-[10px] hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:transform-none shadow-sm cursor-pointer"
              >
                {isProcessing ? "Saving..." : "Save Price"}
              </button>
              <button 
                onClick={() => setIsConfirming(false)}
                disabled={isProcessing}
                className="flex-1 border-[1.5px] border-border text-ink text-[13px] font-bold h-10 rounded-[10px] hover:bg-black/5 transition-colors cursor-pointer"
              >
                Back
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={() => setIsConfirming(true)}
              disabled={isProcessing}
              className="flex-1 bg-emerald text-white text-[13px] font-bold h-10 rounded-[10px] hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:transform-none shadow-sm cursor-pointer"
            >
              Accept
            </button>
            <button 
              onClick={handleCancel}
              disabled={isProcessing}
              className="flex-1 border-[1.5px] border-[#A8422F] text-[#A8422F] text-[13px] font-bold h-10 rounded-[10px] hover:bg-[#A8422F]/10 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Decline
            </button>
          </div>
        )}
      </div>
    </div>
  );
}