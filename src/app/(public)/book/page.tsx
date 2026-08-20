"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { requestAppointment } from "@/actions/booking";
import { getOccupiedSlots } from "@/actions/availability";
import { STANDARD_TIME_SLOTS } from "@/lib/constants";

// Helper to extract the exact local date without UTC shifting
const getLocalDateString = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function BookingPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [occupiedTimes, setOccupiedTimes] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const businessWhatsAppNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER; 

  useEffect(() => {
    async function fetchAvailability() {
      if (!date) return;
      
      setIsLoadingSlots(true);
      setSelectedTime(null);
      
      const dateString = getLocalDateString(date);
      const result = await getOccupiedSlots(dateString);
      
      if (result.success) {
        setOccupiedTimes(result.occupiedSlots);
      }
      setIsLoadingSlots(false);
    }

    fetchAvailability();
  }, [date]);

  const handleBookingRequest = async () => {
    if (!date || !selectedTime || !name || !phone) return;
    
    setIsSubmitting(true);

    try {
      const [timeStr, ampm] = selectedTime.split(" ");
      let [hours, minutes] = timeStr.split(":").map(Number);
      if (ampm === "PM" && hours !== 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;

      const startTime = new Date(date);
      startTime.setHours(hours, minutes, 0, 0);

      const endTime = new Date(startTime);
      endTime.setHours(startTime.getHours() + 2); 

      const dbResult = await requestAppointment({
        clientName: name,
        clientPhone: phone,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });

      if (!dbResult.success) {
        console.error("Failed to save booking:", dbResult.message);
        setIsSubmitting(false);
        return;
      }

      const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const message = `Hello GeeGee Makeovers! I would like to request a consultation.\n\nName: ${name}\nRequested Date: ${formattedDate}\nRequested Time: ${selectedTime}\n\nPlease let me know if this slot is available and what the pricing would be.`;
      
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${businessWhatsAppNumber}?text=${encodedMessage}`;

      window.open(whatsappUrl, '_blank');
      
      setIsSubmitting(false);
      setSelectedTime(null);
      setName("");
      setPhone("");
      
      const dateString = getLocalDateString(date);
      const freshResult = await getOccupiedSlots(dateString);
      if (freshResult.success) setOccupiedTimes(freshResult.occupiedSlots);

    } catch (error) {
      console.error("Booking workflow failed", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 md:px-6 flex-grow flex flex-col w-full">
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-3xl font-medium tracking-tight">Request a Consultation</h1>
        <p className="text-muted-foreground mt-2 font-light">
          Select a date and provide your details. You will be redirected to WhatsApp to finalize your booking.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 bg-background border border-border p-6 md:p-8">
        
        <div className="flex flex-col space-y-6">
          <h2 className="font-medium text-lg uppercase tracking-widest text-sm text-primary">01. Select Date</h2>
          <div className="border border-border p-4 flex justify-center bg-secondary/20">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-none bg-transparent"
              disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
            />
          </div>
        </div>

        <div className="flex flex-col space-y-6">
          <h2 className="font-medium text-lg uppercase tracking-widest text-sm text-primary">02. Select Time & Details</h2>
          
          {!date ? (
            <div className="h-full flex items-center justify-center border border-dashed border-border text-muted-foreground p-8 text-center font-light">
              Please select a date first to view availability.
            </div>
          ) : isLoadingSlots ? (
            <div className="h-full flex items-center justify-center text-muted-foreground font-light">
              Checking availability...
            </div>
          ) : (
            <div className="flex flex-col h-full justify-between space-y-8">
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {STANDARD_TIME_SLOTS.map((time) => {
                  const [timeStr, ampm] = time.split(" ");
                  let [hours, minutes] = timeStr.split(":").map(Number);
                  if (ampm === "PM" && hours !== 12) hours += 12;
                  if (ampm === "AM" && hours === 12) hours = 0;
                  
                  const slotDate = new Date(date);
                  slotDate.setHours(hours, minutes, 0, 0);
                  const slotISO = slotDate.toISOString();

                  const isOccupied = occupiedTimes.includes(slotISO);
                  
                  return (
                    <button
                      key={time}
                      disabled={isOccupied}
                      onClick={() => setSelectedTime(time)}
                      className={`h-10 text-sm border transition-colors ${
                        isOccupied 
                          ? "bg-secondary text-muted-foreground border-border cursor-not-allowed opacity-50"
                          : selectedTime === time 
                            ? "bg-primary border-primary text-primary-foreground" 
                            : "bg-transparent border-border text-foreground hover:border-primary"
                      }`}
                    >
                      {time} {isOccupied && "(Booked)"}
                    </button>
                  );
                })}
              </div>

              {selectedTime && (
                <div className="flex flex-col space-y-4 pt-6 border-t border-border animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-primary transition-colors"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-primary transition-colors"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4">
                <Button 
                  onClick={handleBookingRequest}
                  className="w-full h-14 bg-foreground text-background hover:bg-foreground/90 text-base" 
                  disabled={!selectedTime || !name || !phone || isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Continue to WhatsApp"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}