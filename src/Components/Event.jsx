import { useEffect, useEffectEvent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../content/ThemeContext.jsx';
import eventimg1 from '../assets/eventimg1.avif';
import eventimg2 from '../assets/eventimg2.avif';
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
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const resolveImage = (event) => {
  const rawImage = Array.isArray(event?.images) ? event.images[0] : event?.images;

  if (typeof rawImage === 'string' && rawImage.trim() && rawImage !== 'string') {
    if (rawImage.startsWith('http')) return rawImage;
    return `https://event-hub-olive-six.vercel.app${rawImage.startsWith('/') ? rawImage : `/${rawImage}`}`;
  }

  return fallbackImages[event?.category] ?? fallbackImages.Default;
};

export default function Event() {
  const { dark } = useTheme();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    let active = true;

    const fetchEvents = async () => {
      try {
        const response = await fetch('https://event-hub-olive-six.vercel.app/api/v1/events/');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (active) {
          setEvents(data);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Unable to load events right now.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchEvents();

    return () => {
      active = false;
    };
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isSubmitting,setIsSubmitting] = useState(false);
  const [formData,setFormData] = useState({
    name: '',
    date: '',
    category: '',
    location: '',
    description: '',
    organizer: '',
    event_time: '',
    imageUrl: '',
    capacity: '',
    registered: '',
    price: '',
    status: '',
  });

  
  const API_URL = 'https://event-hub-olive-six.vercel.app/api/v1/events/';

  const getEvents = async () => {
    try{
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch events')
        const data = await response.json();

      setEvents(data);
    }catch (err) {
      setError(err.message);
    }finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    getEvents();
  },[]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(API_URL,{
        method:'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok)throw new error('Failed to create event');

      const newEvent = await response.json();

      setEvents((prevEvents) => [newEvent, ...prevEvents]);

      setFormData({
    name: '',
    date: '',
    category: '',
    location: '',
    description: '',
    organizer: '',
    event_time: '',
    imageUrl: '',
    capacity: '',
    registered: '',
    price: '',
    status: '',
      });
      setIsModalOpen(false);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }finally{
      setIsSubmitting(false);
    }
  };

  const categories = useMemo(
    () => ['All', ...new Set(events.map((event) => event.category).filter(Boolean))],
    [events],
  );

  const filteredEvents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return events.filter((event) => {
      const matchesCategory =
        selectedCategory === 'All' || event.category === selectedCategory;

      const haystack = [
        event.name,
        event.location,
        event.organizer,
        event.description,
        event.category,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch = !term || haystack.includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [events, searchTerm, selectedCategory]);

  const totalTicketsLeft = events.reduce(
    (total, event) => total + Math.max((event.capacity ?? 0) - (event.registered ?? 0), 0),
    0,
  );

  const featuredEvent = filteredEvents[0] ?? events[0];

  if (loading) {
    return (
      <main className={`${dark ? 'bg-white text-slate-950' : 'bg-slate-950 text-slate-100'} min-h-screen px-4 py-10`}>
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse space-y-6">
            <div className="h-48 rounded-[30px] bg-slate-300/20" />
            <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
              <div className="h-[420] rounded-[28px] bg-slate-300/20" />
              <div className="grid gap-6 md:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-80 rounded-[28px] bg-slate-300/20" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={`${dark ? 'bg-slate-100 text-white' : 'bg-slate-950 text-slate-100'} min-h-screen px-4 py-12`}>
        <div className="mx-auto max-w-xl rounded-[30px] border border-red-200 bg-red-50 p-8 text-center text-red-700 shadow-sm">
          <h2 className="text-2xl font-bold">Something went wrong</h2>
          
        </div>
      </main>
    );
  }

  return (
    <main className={`${dark ? 'bg-slate-100 text-slate-950' : 'bg-slate-950 text-slate-100'} min-h-screen px-4 py-8 sm:px-6 lg:px-8`}>
      <div className="mx-auto max-w-7xl pb-8">
        <header className="overflow-hidden rounded-[30px] bg-linear-to-r from-slate-900 via-cyan-900 to-blue-700 p-6 shadow-2xl shadow-cyan-900/20 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-200">EventHub calendar</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                Discover unforgettable experiences
              </h1>
              <p className="mt-4 max-w-xl text-sm text-cyan-50/90 sm:text-base">
                Explore expert-led sessions, community gatherings, and high-impact events built to help you learn, connect, and grow.
              </p>
            </div>

            <div className="grid w-full max-w-xl grid-cols-3 gap-3 text-white">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-100">Events</p>
                <p className="mt-3 text-3xl font-bold">{events.length}</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-100">Categories</p>
                <p className="mt-3 text-3xl font-bold">{categories.length - 1}</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-100">Open seats</p>
                <p className="mt-3 text-3xl font-bold">{totalTicketsLeft}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="mt-8 grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className={`${dark ? 'border-slate-200 bg-slate-100' : 'border-slate-800 bg-slate-900'} rounded-[28px] border p-5 shadow-sm`}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Filters</h2>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchTerm('');
                }}
                className="text-sm font-medium text-cyan-600 hover:text-cyan-500"
              >
                Clear
              </button>
            </div>

            <div className="mt-5 space-y-2">
              {categories.map((category) => {
                const isActive = selectedCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm font-medium transition ${
                      isActive
                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20'
                        : dark
                          ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{category}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] ${isActive ? 'bg-white/15 text-white' : dark ? 'bg-slate-700 text-slate-300' : 'bg-white text-slate-500'}`}>
                      {category === 'All' ? events.length : events.filter((event) => event.category === category).length}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className={`mt-6 rounded-[24] border p-4 ${dark ? 'border-slate-200 bg-slate-50' : 'border-slate-700 bg-slate-800/70'}`}>
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Featured</p>
              <h3 className="mt-3 text-lg font-bold text-inherit">
                {featuredEvent ? featuredEvent.name : 'No featured event'}
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {featuredEvent ? `${formatDate(featuredEvent.date)} • ${featuredEvent.location || 'Location TBD'}` : 'Check back soon for new additions.'}
              </p>
            </div>
          </aside>

          <section className="space-y-5">
            <div className={`${dark ? 'border-slate-200 bg-slate-100' : 'border-slate-800 bg-slate-900'} rounded-[28px] border p-4 shadow-sm sm:p-5`}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan-500">Explore</p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight">
                    {selectedCategory === 'All' ? 'All upcoming events' : selectedCategory}
                  </h2>
                </div>
                <button
                 onClick={() => setIsModalOpen(true)} 
                 className='px-1 py-3 bg-cyan-400 text-white font-medium text-sm rounded-2xl hover:bg-cyan-500 transition flex items-center gap-2 cursor-pointer'
                >
                  <span className='text-lg leading-none'>+</span>Create New Event
                </button>

                {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative overflow-y-auto animate-in fade-in zoom-in-95 duration-150 max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Create New Event</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Event Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Tech Summit 2026"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Tech, Music, etc."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>
              
             <div className='grid grid-cols-2 gap-3'>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="San Francisco, CA or Online"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
      
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Event Time</label>
                <input
                  type="time"
                  name="event_time"
                  value={formData.event_time}
                  onChange={handleChange}
                  placeholder="02-11-2027"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
           </div>

           <div className='grid grid-cols-2 gap-3'>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Registered</label>
                <input
                  type="text"
                  name="registered"
                  value={formData.registered}
                  onChange={handleChange}
                  placeholder="3429"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                />
              </div>
      
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Status</label>
                <input
                  type="text"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  placeholder="upcoming"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
           </div>

              <div>
                <label className="block text-xs font-semibold text-slate-950 uppercase mb-1">Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Organizer</label>
                <input
                  type="text"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleChange}
                  placeholder="San Francisco, CA or Online"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
               
            <div className='grid grid-cols-2 gap-3'>
              <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Price</label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="$1200"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
  
              <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Capacity</label>
                  <input
                    type="text"
                    name="Capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="5000"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                  />
                </div>

           </div>
              <div>
                <label className="block text-xs font-semibold text-slate-900 uppercase mb-1">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Event details..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-slate-950 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg text-sm font-medium hover:bg-cyan-500 transition disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Event'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
                <label
                  htmlFor="event-search"
                  className={`flex w-full max-w-md items-center gap-3 rounded-2xl border px-4 py-3 ${
                    dark ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-slate-700 bg-slate-800 text-slate-200'
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-cyan-500">
                    <circle cx="11" cy="11" r="6" />
                    <path d="M16 16L21 21" />
                  </svg>
                  <input
                    id="event-search"
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search events or places"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                </label>
              </div>
            </div>

            {featuredEvent && selectedCategory === 'All' && !searchTerm && (
              <div className={`${dark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'} overflow-hidden rounded-[28px] border shadow-sm`}>
                <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
                  <div className="relative min-h-[250]">
                    <img
                      src={resolveImage(featuredEvent)}
                      alt={featuredEvent.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = fallbackImages[featuredEvent.category] ?? fallbackImages.Default;
                      }}
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-slate-950/90 via-slate-950/50 to-slate-900/10" />
                    <span className="absolute left-4 top-4 rounded-full bg-cyan-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                      {featuredEvent.category || 'Event'}
                    </span>
                  </div>

                  <div className="p-5 sm:p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-500">Featured event</p>
                    <h3 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">{featuredEvent.name}</h3>
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-300">
                      {featuredEvent.description || 'A curated event for professionals, creators, and curious minds.'}
                    </p>

                    <div className="mt-5 space-y-3 text-sm">

                      <div className="flex items-center justify-between rounded-2xl bg-slate-100 px-3 py-2.5 dark:bg-slate-800">
                        <span className="text-slate-500 dark:text-slate-300">Date</span>
                        <span className="font-semibold">{formatDate(featuredEvent.date)}</span>
                      </div>

                      <div className="flex items-center justify-between rounded-2xl bg-slate-100 px-3 py-2.5 dark:bg-slate-800">
                        <span className="text-slate-500 dark:text-slate-300">Location</span>
                        <span className="font-semibold">{featuredEvent.location || 'TBA'}</span>
                      </div>

                      <div className="flex items-center justify-between rounded-2xl bg-slate-100 px-3 py-2.5 dark:bg-slate-800">
                        <span className="text-slate-500 dark:text-slate-300">Price</span>
                        <span className="font-semibold text-cyan-600">${Number(featuredEvent.price ?? 0).toLocaleString()}</span>
                      </div>

                    </div>

                    <div className="mt-6 flex gap-3">
                      <Link
                        to={`/event/${featuredEvent.uid}`}
                        className="flex-1 rounded-full border border-cyan-600 px-4 py-2.5 text-center text-sm font-semibold text-cyan-600 transition hover:bg-cyan-600 hover:text-white"
                      >
                        View details
                      </Link>
                      <Link
                        to={`/register/${featuredEvent.uid}`}
                        className="flex-1 rounded-full bg-cyan-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-cyan-500"
                      >
                        Register
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {filteredEvents.length ? (
              <div className="grid gap-5 md:grid-cols-2">
                {filteredEvents.map((event) => {
                  const imageUrl = resolveImage(event);
                  const seatsLeft = Math.max((event.capacity ?? 0) - (event.registered ?? 0), 0);

                  return (
                    <article
                      key={event.uid || event.name}
                      className={`${dark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'} overflow-hidden rounded-[28px] border shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl`}
                    >
                      <div className="relative h-52 overflow-hidden">
                      
                        <img
                          src={imageUrl}
                          alt={event.name}
                          className="h-full w-full object-cover transition duration-500 hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = fallbackImages[event.category] ?? fallbackImages.Default;
                          }}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-900/20 to-transparent" />
                        <div className="absolute left-4 top-4 flex gap-2">
                          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-700">
                            {event.category || 'Event'}
                          </span>
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${event.status === 'ongoing' ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-slate-900'}`}>
                            {event.status || 'Upcoming'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4 p-5">
                        <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                          <span>{formatDate(event.date)}</span>
                          <span>{event.event_time || 'Time TBD'}</span>
                        </div>

                        <div>
                          <h3 className="text-2xl font-bold tracking-tight">{event.name}</h3>
                          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            {event.description || 'No description available for this event yet.'}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-3 text-sm text-slate-600 dark:text-slate-300">
                          <span className="inline-flex items-center gap-2">
                            <span>📍</span>
                            {event.location || 'Location TBD'}
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <span>👥</span>
                            {seatsLeft} left
                          </span>
                        </div>

                        <div className="flex items-end justify-between gap-4 border-t border-slate-200 pt-4 dark:border-slate-700">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Hosted by</p>
                            <p className="mt-1 font-semibold">{event.organizer || 'EventHub Team'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">From</p>
                            <p className="mt-1 text-2xl font-black text-cyan-600">${Number(event.price ?? 0).toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-1">
                          <Link
                            to={`/event/${event.uid}`}
                            className="flex-1 rounded-full border border-cyan-600 px-4 py-2.5 text-center text-sm font-semibold text-cyan-600 transition hover:bg-cyan-600 hover:text-white"
                          >
                            Details
                          </Link>
                          <Link
                            to={`/register/${event.uid}`}
                            className="flex-1 rounded-full bg-cyan-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-cyan-500"
                          >
                            Register
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className={`${dark ? 'border-slate-300 bg-white' : 'border-slate-700 bg-950'} rounded-[28px] border border-dashed p-12 text-center`}>
                <p className="text-lg font-semibold">No events match your search.</p>
                <p className="mt-2 text-sm text-slate-500">Try another keyword or switch to a different category.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
