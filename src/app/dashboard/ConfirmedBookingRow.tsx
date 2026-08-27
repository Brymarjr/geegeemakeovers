"use client";

import { useState } from "react";
import { format } from "date-fns";
import { cancelAppointment, completeAppointment } from "@/actions/appointments";

const getLocalDateString = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function ConfirmedBookingRow({ appointment }: { appointment: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const executeCancellation = async () => {
    setIsCancelling(true);
    
    const dateString = getLocalDateString(new Date(appointment.startTime));
    await cancelAppointment(appointment.id, dateString);

    const cleanPhone = appointment.clientPhone.replace(/[^\d+]/g, '');
    const formattedDate = format(new Date(appointment.startTime), "MMMM do, yyyy");
    const formattedTime = format(new Date(appointment.startTime), "h:mm a");
    
    const message = `Hello ${appointment.clientName}, this is Gee-Gee Makeovers. Unfortunately, we need to cancel your confirmed appointment for ${formattedDate} at ${formattedTime}. Please let us know if you would like to reschedule.`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    
    setIsCancelling(false);
    setIsModalOpen(false);
  };

  const executeCompletion = async () => {
    setIsCompleting(true);
    await completeAppointment(appointment.id);
    setIsCompleting(false);
  };

  return (
    <>
      <tr className="hover:bg-black/5 transition-colors border-b border-border/50 last:border-0">
        <td className="px-6 py-5">
          <p className="font-bold text-[14.5px] text-wine-deep">{appointment.clientName}</p>
          <p className="text-[12.5px] font-semibold text-ink-soft">{appointment.clientPhone}</p>
          {appointment.location && (
            <p className="text-[12px] font-medium text-emerald-deep mt-0.5">📍 {appointment.location}</p>
          )}
        </td>
        <td className="px-6 py-5 text-[14px]">{format(new Date(appointment.startTime), "MMM do, yyyy")}</td>
        <td className="px-6 py-5 text-[14px]">{format(new Date(appointment.startTime), "h:mm a")}</td>
        <td className="px-6 py-5">
          <span className="bg-[#DCEEE6] text-emerald-deep text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-[0.03em]">
            Confirmed
          </span>
        </td>
        <td className="px-6 py-5 font-semibold text-[14px]">
          ${(appointment.agreedPriceInCents / 100).toFixed(2)}
        </td>
        <td className="px-6 py-5 text-right space-x-2">
          <button 
            onClick={executeCompletion}
            disabled={isCompleting || isCancelling}
            className="px-4 py-2 bg-wine/10 text-wine-deep rounded-[10px] hover:bg-wine/20 transition-colors font-bold text-[12px] disabled:opacity-50 cursor-pointer"
          >
            {isCompleting ? "Processing..." : "Mark Done"}
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            disabled={isCompleting || isCancelling}
            className="px-4 py-2 border-[1.5px] border-[#A8422F] text-[#A8422F] rounded-[10px] hover:bg-[#A8422F]/10 transition-colors font-bold text-[12px] disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
        </td>
      </tr>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 backdrop-blur-[2px] px-4">
          <div className="bg-white rounded-[22px] p-8 max-w-[420px] w-full shadow-card animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-fraunces font-bold text-wine-deep mb-2">Cancel Appointment?</h3>
            <p className="text-ink-soft text-[13.5px] mb-6 leading-relaxed">
              Are you sure you want to cancel the booking for <span className="font-bold text-ink">{appointment.clientName}</span>? This will immediately open up the time slot on your public calendar and redirect you to WhatsApp to notify the client.
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={executeCancellation}
                disabled={isCancelling}
                className="flex-1 bg-[#A8422F] text-white text-[13px] font-bold h-11 rounded-[12px] hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:transform-none cursor-pointer"
              >
                {isCancelling ? "Processing..." : "Yes, Cancel Booking"}
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                disabled={isCancelling}
                className="flex-1 border-[1.5px] border-border bg-transparent text-ink text-[13px] font-bold h-11 rounded-[12px] hover:bg-black/5 transition-colors cursor-pointer"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}