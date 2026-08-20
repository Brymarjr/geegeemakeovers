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
    
    const message = `Hello ${appointment.clientName}, this is GeeGee Makeovers. Unfortunately, we need to cancel your confirmed appointment for ${formattedDate} at ${formattedTime}. Please let us know if you would like to reschedule.`;
    
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
      <tr className="hover:bg-secondary/20 transition-colors">
        <td className="px-6 py-4">
          <p className="font-medium">{appointment.clientName}</p>
          <p className="text-xs text-muted-foreground">{appointment.clientPhone}</p>
        </td>
        <td className="px-6 py-4">{format(new Date(appointment.startTime), "MMM do, yyyy")}</td>
        <td className="px-6 py-4">{format(new Date(appointment.startTime), "h:mm a")}</td>
        <td className="px-6 py-4">{appointment.numberOfPeople}</td>
        <td className="px-6 py-4">
          ${(appointment.agreedPriceInCents / 100).toFixed(2)}
        </td>
        <td className="px-6 py-4 text-right space-x-3">
          <button 
            onClick={executeCompletion}
            disabled={isCompleting || isCancelling}
            className="px-4 py-2 bg-foreground text-background hover:bg-foreground/90 transition-colors font-medium text-xs tracking-wide disabled:opacity-50"
          >
            {isCompleting ? "PROCESSING..." : "MARK COMPLETED"}
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            disabled={isCompleting || isCancelling}
            className="px-4 py-2 border border-red-200 text-red-600 bg-background hover:bg-red-50 transition-colors font-medium text-xs tracking-wide disabled:opacity-50"
          >
            CANCEL
          </button>
        </td>
      </tr>

      {/* Custom Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-background border border-border p-6 md:p-8 max-w-md w-full shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-medium tracking-tight mb-2">Cancel Appointment?</h3>
            <p className="text-muted-foreground text-sm font-light mb-8">
              Are you sure you want to cancel the booking for <span className="font-medium text-foreground">{appointment.clientName}</span>? This will immediately open up the time slot on your public calendar and redirect you to WhatsApp to notify the client.
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={executeCancellation}
                disabled={isCancelling}
                className="flex-1 bg-red-600 text-white text-sm font-medium h-12 hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isCancelling ? "Processing..." : "Yes, Cancel Booking"}
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                disabled={isCancelling}
                className="flex-1 border border-border bg-background text-foreground text-sm font-medium h-12 hover:bg-secondary transition-colors"
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