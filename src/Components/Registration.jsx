import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../content/ThemeContext.jsx';

const BOOKINGS_KEY = 'eventhub-registrations';

const formatDate = (value) => {
  if (!value) return 'Date pending';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const formatTime = (value) => {
  if (!value) return 'Time TBD';

  const time = new Date(value);

  if (Number.isNaN(time.getTime())) return value;

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(time);
};

export default function Registration() {
  const { dark } = useTheme();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(BOOKINGS_KEY);

      if (!saved) {
        setBookings([]);
        return;
      }

      const parsed = JSON.parse(saved);
      setBookings(Array.isArray(parsed) ? parsed : []);
    } catch {
      setBookings([]);
    }
  }, []);

  const removeBooking = (id) => {
    const nextBookings = bookings.filter((booking) => booking.id !== id);
    setBookings(nextBookings);

    try {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(nextBookings));
    } catch {
      // Ignore storage issues in restricted browsers.
    }
  };

  const hasBookings = bookings.length > 0;

  return (
    <main className={`${dark ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'} min-h-screen px-4 py-10 sm:px-6 lg:px-8`}>
      <div className="mx-auto max-w-6xl">
        <div className={`rounded-[30px] border p-6 shadow-[0_20px_60px_rgba(14,116,144,0.08)] sm:p-8 ${dark ? 'border-slate-200 bg-white' : 'border-slate-700 bg-slate-900'}`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-500">Bookings</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">My registrations</h1>
            </div>

            <div className={`rounded-full px-3 py-1.5 text-sm font-medium ${dark ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-200'}`}>
              {bookings.length} confirmed
            </div>
          </div>
        </div>

        {!hasBookings ? (
          <div className={`mt-8 rounded-[30px] border border-dashed p-10 text-center shadow-sm ${dark ? 'border-slate-300 bg-white' : 'border-slate-700 bg-slate-900/70'}`}>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-500">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8">
                <path d="M7 3h10a2 2 0 0 1 2 2v16l-7-4-7 4V5a2 2 0 0 1 2-2Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="mt-5 text-2xl font-black">No registrations yet</h2>
            <p className={`mx-auto mt-3 max-w-xl text-sm ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
              Your booked events will appear here once you confirm a registration.
            </p>
            <Link
              to="/events"
              className="mt-6 inline-flex rounded-full bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500"
            >
              Explore events
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {bookings.map((booking) => (
              <article
                key={booking.id}
                className={`overflow-hidden rounded-[28px] border shadow-[0_18px_40px_rgba(15,23,42,0.08)] ${dark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80"
                    alt={booking.eventName}
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-900/20 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                    Confirmed
                  </span>
                </div>

                <div className="space-y-4 p-5">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                    <span>{formatDate(booking.submittedAt)}</span>
                    <span>{formatTime(booking.submittedAt)}</span>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold tracking-tight">{booking.eventName || 'Event booking'}</h2>
                    <p className={`mt-2 text-sm ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {booking.fullName}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Ticket</p>
                    <p className="mt-1 text-base font-bold text-cyan-600">{booking.ticketType || 'Standard'}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p className={dark ? 'text-slate-300' : 'text-slate-600'}>
                      <span className="font-semibold text-slate-500">Email:</span> {booking.email}
                    </p>
                    <p className={dark ? 'text-slate-300' : 'text-slate-600'}>
                      <span className="font-semibold text-slate-500">Phone:</span> {booking.phone}
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Link
                      to={`/event/${booking.eventId}`}
                      className="flex-1 rounded-full border border-cyan-600 px-4 py-2.5 text-center text-sm font-semibold text-cyan-600 transition hover:bg-cyan-600 hover:text-white"
                    >
                      View event
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeBooking(booking.id)}
                      className="rounded-full border border-red-500 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-500 hover:text-white"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
