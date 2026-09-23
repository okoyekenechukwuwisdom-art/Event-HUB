import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../content/ThemeContext.jsx';
import { NavLink } from 'react-router-dom';
import eventimg from '../assets/eventimg1.avif';

export default function Home() {
  const { dark } = useTheme();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeEvents = async () => {
      try {
        const response = await fetch('https://event-hub-olive-six.vercel.app/api/v1/events/');

        if (!response.ok) {
          throw new Error('Failed to load events');
        }

        const data = await response.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeEvents();
  }, []);

  const upcomingEvents = useMemo(() => {
    const now = new Date();

    return [...events]
      .filter((event) => {
        if (!event?.date) return true;
        return new Date(event.date) >= now;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3);
  }, [events]);

  const totalUpcoming = upcomingEvents.length;

  return (
    <section
      className={`${
        dark ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-50'
      } min-h-screen px-4 py-10 sm:px-6 lg:px-8`}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="grid items-center gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-slate-900 p-6 shadow-xl shadow-slate-900/10 sm:p-8 lg:p-10">
            <span className="inline-block text-xs font-medium tracking-[0.24em] text-cyan-300">
              SMART PLANNING
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-wide text-slate-100 sm:text-4xl lg:text-5xl">
              Discover events that move your world forward.
            </h1>
            <p className="mt-4 text-base text-slate-300 sm:text-lg">
              Join us and make a difference!
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <NavLink
                to="/registration"
                className="inline-flex items-center justify-center rounded-full bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500"
              >
                View My Bookings
              </NavLink>
              <NavLink
                to="/events"
                className="inline-flex items-center justify-center rounded-full bg-cyan-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600"
              >
                Explore Events
              </NavLink>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-200 p-5 shadow-lg shadow-slate-200/50 sm:p-6">
            <div className="border-b border-slate-300 pb-5">
              <div className="text-xs font-semibold tracking-[0.24em] text-cyan-700">
                ACTIVE
              </div>
              <div className="mt-3 flex items-center gap-4">
                <span className="text-4xl font-bold text-slate-900">{loading ? '...' : totalUpcoming}</span>
                <span className="rounded-full bg-cyan-100 px-3 py-1 text-sm font-medium text-cyan-700">
                  Upcoming
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-2xl p-4 text-slate-900">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">
                Upcoming
              </p>
              <div className="mt-4 space-y-3">
                {upcomingEvents.length ? (
                  upcomingEvents.map((event) => (
                    <div key={event.uid} className="flex items-center justify-between rounded-xl bg-white/60 px-3 py-2">
                      <span className="font-medium">{event.name}</span>
                      <span className="text-sm text-slate-600">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl bg-white/60 px-3 py-2 text-sm text-slate-600">
                    No upcoming events right now.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl shadow-xl shadow-slate-300/20">
          <img
            src={eventimg}
            alt="Event banner"
            className="h-[260] w-full object-cover sm:h-[320] lg:h-[420]"
          />
        </div>
      </div>
    </section>
  );
}