"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { requestAppointment } from "@/actions/booking";
import { getOccupiedSlots } from "@/actions/availability";
import { STANDARD_TIME_SLOTS } from "@/lib/constants";

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
  const [numberOfPeople, setNumberOfPeople] = useState(1);
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
        numberOfPeople: numberOfPeople,
      });

      if (!dbResult.success) {
        console.error("Failed to save booking:", dbResult.message);
        setIsSubmitting(false);
        return;
      }

      const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const message = `Hello GeeGee Makeovers! I would like to request a consultation.\n\nName: ${name}\nRequested Date: ${formattedDate}\nRequested Time: ${selectedTime}\nParty Size: ${numberOfPeople} person(s)\n\nPlease let me know if this slot is available and what the pricing would be.`;
      
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${businessWhatsAppNumber}?text=${encodedMessage}`;

      window.open(whatsappUrl, '_blank');
      
      setIsSubmitting(false);
      setSelectedTime(null);
      setName("");
      setPhone("");
      setNumberOfPeople(1);
      
      const dateString = getLocalDateString(date);
      const freshResult = await getOccupiedSlots(dateString);
      if (freshResult.success) setOccupiedTimes(freshResult.occupiedSlots);

    } catch (error) {
      console.error("Booking workflow failed", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 md:px-12 py-12">
      <div className="bg-wine-deep rounded-[32px] p-8 md:p-14 text-cream grid md:grid-cols-[0.85fr_1.15fr] gap-12 shadow-card items-start">
        
        <div>
          <p className="text-xs font-extrabold tracking-[0.16em] uppercase text-gold-light mb-2">How booking works</p>
          <h1 className="text-3xl font-bold text-white leading-tight mb-4">No prices online <br />we settle it on WhatsApp.</h1>
          <p className="text-[14.5px] text-[#e6d3c4] leading-relaxed mb-8">
            Pick an open date and time below. We will send your request straight to GeeGee WhatsApp, where you can agree on pricing together.
          </p>

          <div className="flex flex-col gap-5">
            <div className="flex gap-4">
              <div className="w-8 h-8 shrink-0 rounded-full bg-secondary text-gold-light flex items-center justify-center font-extrabold font-fraunces text-sm">1</div>
              <div>
                <b className="block text-[15px] mb-1">Choose your date and time</b>
                <span className="text-[13.5px] text-[#d8c2b4] leading-relaxed">Grayed out days are already booked or blocked.</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 shrink-0 rounded-full bg-secondary text-gold-light flex items-center justify-center font-extrabold font-fraunces text-sm">2</div>
              <div>
                <b className="block text-[15px] mb-1">Tell us about your booking</b>
                <span className="text-[13.5px] text-[#d8c2b4] leading-relaxed">Your name and how many people need makeup.</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 shrink-0 rounded-full bg-secondary text-gold-light flex items-center justify-center font-extrabold font-fraunces text-sm">3</div>
              <div>
                <b className="block text-[15px] mb-1">Chat and confirm on WhatsApp</b>
                <span className="text-[13.5px] text-[#d8c2b4] leading-relaxed">GeeGee replies to confirm price, location, and details.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-cream text-ink rounded-[24px] p-6 md:p-8 shadow-card flex flex-col space-y-6">
          <div className="space-y-2">
            <label className="text-[12.5px] font-bold text-wine-deep uppercase tracking-[0.04em]">01. Select Date</label>
            <div className="bg-white border border-border rounded-[16px] p-4 flex justify-center shadow-sm">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="bg-transparent"
                disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[12.5px] font-bold text-wine-deep uppercase tracking-[0.04em]">02. Select Time</label>
            
            {!date ? (
              <div className="flex items-center justify-center border border-dashed border-border rounded-[12px] text-ink-soft p-6 text-center text-sm">
                Please select a date first to view availability.
              </div>
            ) : isLoadingSlots ? (
              <div className="flex items-center justify-center border border-dashed border-border rounded-[12px] text-ink-soft p-6 text-center text-sm">
                Checking availability...
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
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
                      className={`px-3 py-2 text-[13px] border-[1.5px] rounded-full font-bold transition-all ${
                        isOccupied 
                          ? "bg-white text-ink opacity-35 line-through border-border cursor-not-allowed"
                          : selectedTime === time 
                            ? "bg-wine border-wine text-cream shadow-md" 
                            : "bg-white border-border text-ink hover:bg-gold-light hover:border-gold-light"
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {selectedTime && (
            <div className="flex flex-col space-y-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="space-y-2 flex-1">
                  <label className="text-[12.5px] font-bold text-wine-deep uppercase tracking-[0.04em]">Your Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 rounded-[12px] border-[1.5px] border-border bg-white text-[14.5px] focus:outline-none focus:border-gold transition-colors"
                    placeholder="e.g. Jane Doe"
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <label className="text-[12.5px] font-bold text-wine-deep uppercase tracking-[0.04em]">Number of People</label>
                  <input 
                    type="number" 
                    min="1"
                    max="15"
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(parseInt(e.target.value) || 1)}
                    className="w-full p-3 rounded-[12px] border-[1.5px] border-border bg-white text-[14.5px] focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[12.5px] font-bold text-wine-deep uppercase tracking-[0.04em]">Phone Number</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 rounded-[12px] border-[1.5px] border-border bg-white text-[14.5px] focus:outline-none focus:border-gold transition-colors"
                  placeholder="+1 (555) 0000000"
                />
              </div>

              <div className="pt-2">
                <button 
                  onClick={handleBookingRequest}
                  className="w-full bg-wine text-cream font-bold text-sm px-6 py-4 rounded-full shadow-custom hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2" 
                  disabled={!selectedTime || !name || !phone || isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Send booking request on WhatsApp"}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}