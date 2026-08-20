import { db } from "@/db";
import { appointments } from "@/db/schema";
import { asc } from "drizzle-orm";
import { format } from "date-fns";
import { PendingRequestCard } from "./PendingRequestCard";
import { ConfirmedBookingRow } from "./ConfirmedBookingRow";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const allAppointments = await db.query.appointments.findMany({
    orderBy: [asc(appointments.startTime)],
  });

  const pendingRequests = allAppointments.filter(app => app.status === "pending_consultation");
  const confirmedBookings = allAppointments.filter(app => app.status === "confirmed");
  const completedBookings = allAppointments.filter(app => app.status === "completed").reverse();

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-medium tracking-tight">Appointments</h1>
          <p className="text-muted-foreground mt-1 font-light">
            Manage your upcoming schedule and pending consultation requests.
          </p>
        </div>

        <section>
          <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
            Pending Requests 
            <span className="bg-primary text-primary-foreground text-xs py-1 px-2 rounded-full">
              {pendingRequests.length}
            </span>
          </h2>
          
          {pendingRequests.length === 0 ? (
            <div className="p-8 border border-dashed border-border text-center text-muted-foreground font-light bg-background">
              No pending requests at the moment.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingRequests.map((appointment) => (
                <PendingRequestCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-medium mb-6">Upcoming Appointments</h2>
          
          {confirmedBookings.length === 0 ? (
            <div className="p-8 border border-dashed border-border text-center text-muted-foreground font-light bg-background">
              No confirmed appointments.
            </div>
          ) : (
            <div className="bg-background border border-border overflow-hidden">
              <table className="w-full text-left text-sm font-light">
                <thead className="bg-secondary/50 font-medium">
                  <tr>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Party Size</th>
                    <th className="px-6 py-4">Agreed Price</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {confirmedBookings.map((appointment) => (
                    <ConfirmedBookingRow key={appointment.id} appointment={appointment} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-medium mb-6">Completed Bookings</h2>
          
          {completedBookings.length === 0 ? (
            <div className="p-8 border border-dashed border-border text-center text-muted-foreground font-light bg-background">
              No completed appointments yet.
            </div>
          ) : (
            <div className="bg-background border border-border overflow-hidden opacity-75">
              <table className="w-full text-left text-sm font-light">
                <thead className="bg-secondary/50 font-medium">
                  <tr>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Party Size</th>
                    <th className="px-6 py-4">Final Price</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {completedBookings.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium">{appointment.clientName}</p>
                        <p className="text-xs text-muted-foreground">{appointment.clientPhone}</p>
                      </td>
                      <td className="px-6 py-4">{format(new Date(appointment.startTime), "MMM do, yyyy")}</td>
                      <td className="px-6 py-4">{format(new Date(appointment.startTime), "h:mm a")}</td>
                      <td className="px-6 py-4">{appointment.numberOfPeople}</td>
                      <td className="px-6 py-4">
                        ${(appointment.agreedPriceInCents! / 100).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right text-muted-foreground font-medium">
                        Completed
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}