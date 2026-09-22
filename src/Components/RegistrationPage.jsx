import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTheme } from '../content/ThemeContext.jsx';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  ticketType: 'Standard',
};

const ticketOptions = ['Standard', 'VIP', 'Premium', 'Group'];

export default function RegistrationPage() {
  const { id } = useParams();
  const { dark } = useTheme();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    if (status.type) setStatus({ type: '', message: '' });
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = 'Full name is required.';
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!form.phone.trim()) {
      nextErrors.phone = 'Phone number is required.';
    } else if (!/^[0-9+()\-\s]{7,}$/.test(form.phone)) {
      nextErrors.phone = 'Please enter a valid phone number.';
    }

    if (!form.ticketType) {
      nextErrors.ticketType = 'Please choose a ticket category.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      setStatus({
        type: 'error',
        message: 'Please fix the highlighted fields and try again.',
      });
      return;
    }

    setStatus({
      type: 'success',
      message: `Registration submitted successfully for event ${id || 'selected event'}.`,
    });

    setForm(initialForm);
  };

  return (
    <main className={`${dark ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'} min-h-screen px-4 py-10 sm:px-6 lg:px-8`}>
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center gap-2 text-sm text-cyan-600">
          <Link to="/events" className="font-medium hover:underline">Events</Link>
          <span>›</span>
          <span className={dark ? 'text-slate-600' : 'text-slate-300'}>Registration</span>
        </div>

        <div className={`grid gap-6 overflow-hidden rounded-4xl border shadow-sm lg:grid-cols-[0.9fr_1.1fr] ${dark ? 'border-slate-200 bg-white' : 'border-slate-700 bg-slate-950'}`}>
          <div className="relative overflow-hidden bg-linear-to-br from-cyan-700 via-cyan-600 to-blue-700 p-6 sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.2),transparent_30%)]" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">Reserve your seat</p>
              <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">Register for this event</h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-cyan-50/90">
                Complete your details to secure your ticket and receive event updates and reminders.
              </p>

              <div className="mt-8 space-y-4">
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-100">Event ID</p>
                  <p className="mt-2 text-lg font-semibold text-white">{id || 'pending'}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-100">Ticket access</p>
                  <p className="mt-2 text-lg font-semibold text-white">Instant confirmation</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-8">
            <div className="space-y-5">
              <div>
                <label htmlFor="fullName" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Full name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${errors.fullName ? 'border-red-400 focus:ring-1 focus:ring-red-200' : 'border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200'} ${dark ? 'bg-white text-slate-900' : 'bg-slate-800 text-white'}`}
                />
                {errors.fullName && <p className="mt-1.5 text-sm text-red-500">{errors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${errors.email ? 'border-red-400 focus:ring-1 focus:ring-red-200' : 'border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200'} ${dark ? 'bg-white text-slate-900' : 'bg-slate-800 text-white'}`}
                />
                {errors.email && <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Phone number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+234 800 000 0000"
                  className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${errors.phone ? 'border-red-400 focus:ring-1 focus:ring-red-200' : 'border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200'} ${dark ? 'bg-white text-slate-900' : 'bg-slate-800 text-white'}`}
                />
                {errors.phone && <p className="mt-1.5 text-sm text-red-500">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="ticketType" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Ticket category
                </label>
                <select
                  id="ticketType"
                  name="ticketType"
                  value={form.ticketType}
                  onChange={handleChange}
                  className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${errors.ticketType ? 'border-red-400 focus:ring-1 focus:ring-red-200' : 'border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200'} ${dark ? 'bg-white text-slate-900' : 'bg-slate-800 text-white'}`}
                >
                  {ticketOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.ticketType && <p className="mt-1.5 text-sm text-red-500">{errors.ticketType}</p>}
              </div>

              {status.message && (
                <div className={`rounded-2xl border px-4 py-3 text-sm ${status.type === 'success' ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                  {status.message}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-full bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500"
              >
                Submit registration
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
