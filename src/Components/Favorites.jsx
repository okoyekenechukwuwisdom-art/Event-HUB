import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../content/ThemeContext.jsx';

const FAVORITES_KEY = 'eventhub-favorites';

const sampleFavorites = [
  {
    uid: 'sample-1',
    name: 'Tech Summit 2026',
    category: 'Technology',
    date: '2026-10-12',
    location: 'Lagos',
    event_time: '09:00',
    price: 250,
    organizer: 'EventHub Studio',
    status: 'upcoming',
  },
  {
    uid: 'sample-2',
    name: 'City Music Night',
    category: 'Music',
    date: '2026-10-18',
    location: 'Abuja',
    event_time: '19:30',
    price: 180,
    organizer: 'Pulse Live',
    status: 'upcoming',
  },
];

const formatDate = (value) => {
  if (!value) return 'Date to be announced';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export default function Favorites() {
  const { dark } = useTheme();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);

    if (!saved) {
      setFavorites([]);
      return;
    }

    try {
      const parsed = JSON.parse(saved);
      setFavorites(Array.isArray(parsed) ? parsed : []);
    } catch {
      setFavorites([]);
    }
  }, []);

  const removeFavorite = (uid) => {
    const nextFavorites = favorites.filter((event) => event.uid !== uid);
    setFavorites(nextFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(nextFavorites));
  };

  const hasFavorites = favorites.length > 0;

  return (
    <main className={`${dark ? 'bg-slate-100 text-slate-800' : 'bg-slate-950 text-slate-100'} min-h-screen px-4 py-10 sm:px-6 lg:px-8`}>
      <div className="mx-auto max-w-6xl">
        <div className={`rounded-[30px] border p-6 shadow-sm sm:p-8 ${dark ? 'border-slate-200 bg-white' : 'border-slate-700 bg-slate-900'}`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-500">Saved events</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Your favorite events</h1>
            </div>

            <div className={`rounded-full px-3 py-1.5 text-sm font-medium ${dark ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-200'}`}>
              {favorites.length} saved
            </div>
          </div>
        </div>

        {!hasFavorites ? (
          <div className={`mt-8 rounded-[30px] border border-dashed p-10 text-center shadow-sm ${dark ? 'border-slate-300 bg-white' : 'border-slate-700 bg-slate-900/70'}`}>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-500">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8">
                <path d="M12 21s-8.5-5.4-10-9.8C1.2 8.5 3.2 4 7.5 4c2 0 3.3 1 4.5 2.3C13.2 5 14.5 4 16.5 4 20.8 4 22.8 8.5 22 11.2 20.5 15.6 12 21 12 21Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="mt-5 text-2xl font-black">No favorites yet</h2>
            <p className={`mx-auto mt-3 max-w-xl text-sm ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
              Save the events you like and they’ll appear here so you can revisit them anytime.
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
            {favorites.map((event) => (
              <article
                key={event.uid}
                className={`overflow-hidden rounded-[28px] border shadow-sm ${dark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={event.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80'}
                    alt={event.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-900/20 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-cyan-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                    {event.category || 'Event'}
                  </span>
                </div>

                <div className="space-y-4 p-5">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                    <span>{formatDate(event.date)}</span>
                    <span>{event.event_time || 'Time TBD'}</span>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold tracking-tight">{event.name}</h2>
                    <p className={`mt-2 text-sm ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {event.location || 'Location TBD'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">From</p>
                      <p className="mt-1 text-xl font-black text-cyan-600">${Number(event.price ?? 0).toLocaleString()}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${event.status === 'ongoing' ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-slate-900'}`}>
                      {event.status || 'upcoming'}
                    </span>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Link
                      to={`/event/${event.uid}`}
                      className="flex-1 rounded-full border border-cyan-600 px-4 py-2.5 text-center text-sm font-semibold text-cyan-600 transition hover:bg-cyan-600 hover:text-white"
                    >
                      Details
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeFavorite(event.uid)}
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