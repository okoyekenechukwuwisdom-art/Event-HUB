
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTheme } from '../content/ThemeContext.jsx';
import eventimg1 from '../assets/eventimg1.avif';
import eventimg2 from '../assets/eventimg2.avif';
import eventimg3 from '../assets/eventimg3.avif';
import commuimg from '../assets/commuimg.avif';
import businessimg from '../assets/businessimg.avif';
import musicimg from '../assets/musicimg.avif';
import techimg2 from '../assets/techimg2.avif';
import workshopimg from '../assets/workshopimg.avif';

const fallbackImages = {
  Technology: techimg2,
  Music: musicimg,
  Workshop: workshopimg,
  Business: businessimg,
  Community: commuimg,
  Other: eventimg2,
  Default: eventimg1,
};

const formatDate = (value) => {
  if (!value) return 'Date to be announced';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export default function EventDetails() {
  const { id } = useParams();
  const { dark } = useTheme();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchEvent = async () => {
      try {
        const response = await fetch(`https://event-hub-olive-six.vercel.app/api/v1/events/${id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (active) {
          setEvent(data);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Unable to load this event.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchEvent();
    }

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className={`${dark ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-900'} min-h-screen px-4 py-12`}>
        <div className="mx-auto max-w-5xl animate-pulse rounded-[32] bg-slate-300/10 p-6">
          <div className="h-80 rounded-3xl bg-slate-300/20" />
          <div className="mt-6 h-6 w-32 rounded-full bg-slate-300/20" />
          <div className="mt-4 h-12 w-2/3 rounded bg-slate-300/20" />
          <div className="mt-6 h-24 rounded bg-slate-300/20" />
        </div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className={`${dark ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-900'} min-h-screen px-4 py-12`}>
        <div className="mx-auto max-w-xl rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-2xl font-bold">Event not found</h2>
          <p className="mt-3 text-slate-500">{error || 'This event could not be loaded right now.'}</p>
          <Link to="/events" className="mt-6 inline-flex rounded-full bg-cyan-600 px-5 py-2.5 font-semibold text-white">
            Back to events
          </Link>
        </div>
      </main>
    );
  }

  const rawImage = Array.isArray(event.images) ? event.images[0] : event.images;
  const imageUrl =
    typeof rawImage === 'string' && rawImage.trim() && rawImage !== 'string'
      ? rawImage.startsWith('http')
        ? rawImage
        : `https://event-hub-olive-six.vercel.app${rawImage.startsWith('/') ? rawImage : `/${rawImage}`}`
      : fallbackImages[event.category] ?? fallbackImages.Default;

  const seatsLeft = Math.max((event.capacity ?? 0) - (event.registered ?? 0), 0);

  return (
    <main className={`${dark ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-white'} min-h-screen px-4 py-8 sm:px-6 lg:px-8`}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center gap-2 text-sm text-cyan-600">
          <Link to="/events" className="font-medium hover:underline">Events</Link>
          <span>›</span>
          <span className="text-slate-500 dark:text-slate-400">{event.name}</span>
        </div>

        <div className={`overflow-hidden rounded-[32] border shadow-sm ${dark ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900'}`}>
          <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="relative min-h-[300]">
              <img
                src={imageUrl}
                alt={event.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = fallbackImages[event.category] ?? fallbackImages.Default;
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-900/20 to-transparent" />
              <div className="absolute left-6 top-6 flex gap-2">
                <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-700">
                  {event.category || 'Event'}
                </span>
                <span className="rounded-full bg-amber-400 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-900">
                  {event.status || 'Upcoming'}
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-between p-6 sm:p-8">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-cyan-500">Event overview</p>
                <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">{event.name}</h1>
                <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-300">{event.description}</p>
              </div>

              <div className="mt-8 space-y-4 text-sm">
                <div className="flex items-center justify-between rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
                  <span className="text-slate-500 dark:text-slate-300">Date</span>
                  <span className="font-semibold">{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
                  <span className="text-slate-500 dark:text-slate-300">Time</span>
                  <span className="font-semibold">{event.event_time || 'To be announced'}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
                  <span className="text-slate-500 dark:text-slate-300">Location</span>
                  <span className="font-semibold">{event.location || 'TBA'}</span>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Ticket</p>
                  <p className="mt-2 text-3xl font-black text-cyan-600">${Number(event.price ?? 0).toLocaleString()}</p>
                </div>
                <Link
                  to={`/register/${event.uid}`}
                  className="rounded-full bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500"
                >
                  Register now
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className={`rounded-[28px] border p-6 ${dark ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900'}`}>
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Organizer</p>
            <h3 className="mt-3 text-xl font-bold">{event.organizer || 'EventHub Team'}</h3>
          </div>
          <div className={`rounded-[28px] border p-6 ${dark ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900'}`}>
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Capacity</p>
            <h3 className="mt-3 text-xl font-bold">{event.capacity ?? 0}</h3>
          </div>
          <div className={`rounded-[28px] border p-6 ${dark ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900'}`}>
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Seats left</p>
            <h3 className="mt-3 text-xl font-bold">{seatsLeft}</h3>
          </div>
        </div>
      </div>
    </main>
  );
}
