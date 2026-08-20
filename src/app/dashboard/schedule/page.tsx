"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { fetchBlockouts, addBlockout, removeBlockout } from "@/actions/schedule";
import { STANDARD_TIME_SLOTS } from "@/lib/constants";

const getLocalDateString = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseLocalDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
};

export default function ScheduleManagementPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeBlockouts, setActiveBlockouts] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadBlockouts = async () => {
    const result = await fetchBlockouts();
    if (result.success) {
      setActiveBlockouts(result.data);
    }
  };

  useEffect(() => {
    loadBlockouts();
  }, []);

  const handleAddBlockout = async (timeSlot: string | null) => {
    if (!date) return;
    setIsProcessing(true);
    const dateString = getLocalDateString(date);
    
    await addBlockout(dateString, timeSlot);
    await loadBlockouts();
    setIsProcessing(false);
  };

  const handleRemoveBlockout = async (id: string, targetDate: string) => {
    setIsProcessing(true);
    await removeBlockout(id, targetDate);
    await loadBlockouts();
    setIsProcessing(false);
  };

  const dateString = date ? getLocalDateString(date) : "";
  const currentDayBlockouts = activeBlockouts.filter(b => b.targetDate === dateString);
  const isFullDayBlocked = currentDayBlockouts.some(b => b.timeSlot === null);

  const fullBlockDates = activeBlockouts
    .filter(b => b.timeSlot === null)
    .map(b => parseLocalDate(b.targetDate));

  const partialBlockDates = activeBlockouts
    .filter(b => b.timeSlot !== null)
    .map(b => parseLocalDate(b.targetDate));

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-12">
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-medium tracking-tight">Schedule Management</h1>
        <p className="text-muted-foreground mt-1 font-light">
          Select a date to explicitly block out entire days or specific time slots.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 bg-background border border-border p-6 md:p-8">
        <div className="flex flex-col space-y-6">
          <h2 className="font-medium text-lg uppercase tracking-widest text-primary">01. Select Date</h2>
          <div className="border border-border p-4 flex justify-center bg-secondary/20">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-none bg-transparent"
              modifiers={{
                full: fullBlockDates,
                partial: partialBlockDates,
              }}
              modifiersClassNames={{
                full: "!bg-red-600 !text-white font-medium hover:!bg-red-700",
                partial: "!bg-orange-500 !text-white font-medium hover:!bg-orange-600",
              }}
            />
          </div>
        </div>

        <div className="flex flex-col space-y-6">
          <h2 className="font-medium text-lg uppercase tracking-widest text-primary">02. Manage Availability</h2>
          
          {!date ? (
            <div className="h-full flex items-center justify-center border border-dashed border-border text-muted-foreground p-8 text-center font-light">
              Please select a date to manage schedule.
            </div>
          ) : (
            <div className="flex flex-col h-full space-y-8">
              
              <div className="space-y-4">
                <h3 className="font-medium">Active Restrictions</h3>
                {currentDayBlockouts.length === 0 ? (
                  <p className="text-sm text-muted-foreground font-light">All standard slots are currently open.</p>
                ) : (
                  <div className="space-y-2">
                    {currentDayBlockouts.map(block => (
                      <div key={block.id} className="flex justify-between items-center p-3 border border-border bg-secondary/20">
                        <span className="text-sm font-medium">
                          {block.timeSlot === null ? "Entire Day Blocked" : `${block.timeSlot} Blocked`}
                        </span>
                        <button 
                          onClick={() => handleRemoveBlockout(block.id, block.targetDate)}
                          disabled={isProcessing}
                          className="text-xs text-red-600 hover:text-red-700 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-6 border-t border-border">
                <h3 className="font-medium">Add Restriction</h3>
                
                <Button 
                  onClick={() => handleAddBlockout(null)}
                  disabled={isFullDayBlocked || isProcessing}
                  className="w-full bg-foreground text-background hover:bg-foreground/90 h-12"
                >
                  Block Entire Day
                </Button>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                  {STANDARD_TIME_SLOTS.map((time) => {
                    const isBlocked = isFullDayBlocked || currentDayBlockouts.some(b => b.timeSlot === time);
                    return (
                      <button
                        key={time}
                        disabled={isBlocked || isProcessing}
                        onClick={() => handleAddBlockout(time)}
                        className={`h-10 border text-xs transition-colors ${
                          isBlocked 
                            ? "bg-secondary text-muted-foreground border-border cursor-not-allowed opacity-50"
                            : "bg-transparent border-border text-foreground hover:border-primary"
                        }`}
                      >
                        Block {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}