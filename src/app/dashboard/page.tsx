import { db } from "@/db";
import { appointments } from "@/db/schema";
import { asc } from "drizzle-orm";
import { format } from "date-fns";
import { PendingRequestCard } from "./PendingRequestCard";
import { ConfirmedBookingRow } from "./ConfirmedBookingRow";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const allAppointments = await db.query.appointments.findMany({
    orderBy: [asc(appointments.startTime)],
  });

  const pendingRequests = allAppointments.filter(app => app.status === "pending_consultation");
  const confirmedBookings = allAppointments.filter(app => app.status === "confirmed");
  const completedBookings = allAppointments.filter(app => app.status === "completed").reverse();

  return (
    <div className="min-h-screen bg-cream p-6 md:p-10">
      <div className="max-w-[1180px] mx-auto space-y-10 pb-20">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <p className="text-[12px] font-extrabold tracking-[0.16em] uppercase text-emerald-deep mb-1">Owner access</p>
            <h1 className="text-[30px] font-bold font-fraunces text-wine-deep">Studio dashboard</h1>
            <p className="text-ink-soft text-[14px] mt-1">Manage your calendar and every booking request in one place.</p>
          </div>
          <Link href="/" className="bg-emerald text-[#EFF6F2] font-bold text-[14px] px-6 py-3 rounded-full hover:-translate-y-0.5 transition-transform shadow-sm">
            View public site
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-[18px] p-6 border border-border flex flex-col gap-2">
            <b className="font-fraunces text-[32px] text-emerald-deep">{pendingRequests.length}</b>
            <span className="text-[12.5px] font-bold text-ink-soft uppercase tracking-[0.05em]">Pending requests</span>
          </div>
          <div className="bg-white rounded-[18px] p-6 border border-border flex flex-col gap-2">
            <b className="font-fraunces text-[32px] text-emerald-deep">{confirmedBookings.length}</b>
            <span className="text-[12.5px] font-bold text-ink-soft uppercase tracking-[0.05em]">Upcoming appointments</span>
          </div>
          <div className="bg-white rounded-[18px] p-6 border border-border flex flex-col gap-2">
            <b className="font-fraunces text-[32px] text-emerald-deep">{completedBookings.length}</b>
            <span className="text-[12.5px] font-bold text-ink-soft uppercase tracking-[0.05em]">Completed jobs</span>
          </div>
        </div>

        <section className="bg-white rounded-[20px] border border-border p-6 md:p-8">
          <h2 className="text-[18px] font-bold font-fraunces text-wine-deep mb-1">Booking requests</h2>
          <p className="text-[13px] text-ink-soft mb-6">New requests from the website land here first.</p>
          
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8 text-ink-soft text-[13.5px]">
              No pending requests right now.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingRequests.map((appointment) => (
                <PendingRequestCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          )}
        </section>

        <section className="bg-white rounded-[20px] border border-border p-6 md:p-8">
          <h2 className="text-[18px] font-bold font-fraunces text-wine-deep mb-1">Upcoming appointments</h2>
          <p className="text-[13px] text-ink-soft mb-6">Accepted bookings. Mark a job done once you have finished the service.</p>
          
          {confirmedBookings.length === 0 ? (
            <div className="text-center py-8 text-ink-soft text-[13.5px]">
              Nothing on the books yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody>
                  {confirmedBookings.map((appointment) => (
                    <ConfirmedBookingRow key={appointment.id} appointment={appointment} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="bg-white rounded-[20px] border border-border p-6 md:p-8">
          <h2 className="text-[18px] font-bold font-fraunces text-wine-deep mb-1">Completed</h2>
          <p className="text-[13px] text-ink-soft mb-6">Your service history.</p>
          
          {completedBookings.length === 0 ? (
            <div className="text-center py-8 text-ink-soft text-[13.5px]">
              Completed jobs will show up here.
            </div>
          ) : (
            <div className="overflow-x-auto opacity-70">
              <table className="w-full text-left">
                <tbody>
                  {completedBookings.map((appointment) => (
                    <tr key={appointment.id} className="border-b border-border/50 last:border-0">
                      <td className="px-6 py-4">
                        <p className="font-bold text-[14.5px] text-wine-deep">{appointment.clientName}</p>
                        <p className="text-[12.5px] font-semibold text-ink-soft">{appointment.clientPhone}</p>
                      </td>
                      <td className="px-6 py-4 text-[14px] text-ink-soft">{format(new Date(appointment.startTime), "MMM do, yyyy")}</td>
                      <td className="px-6 py-4 text-[14px] text-ink-soft">{format(new Date(appointment.startTime), "h:mm a")}</td>
                      <td className="px-6 py-4">
                        <span className="bg-[#e7e2df] text-[#6b5c55] text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-[0.03em]">
                          Done
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-[14px] text-ink-soft">
                        ${(appointment.agreedPriceInCents! / 100).toFixed(2)}
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