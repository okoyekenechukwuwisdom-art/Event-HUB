
import { NavLink } from 'react-router-dom';
import { useTheme } from '../content/ThemeContext.jsx';

const footerLinks = [
  { label: 'Explore events', to: '/' },
  { label: 'Your favorites', to: '/favorites' },
  { label: 'My Bookings', to: '/registration' },

];

export default function Footer() {


  const { dark } = useTheme();
  return (
    <footer className={`relative overflow-hidden  text-slate-300 ${dark ? 'bg-slate-100 ' : 'bg-slate-950'}`}>
      <div className='absolute -right-24 -top-28 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl' aria-hidden='true' />
      <div className='absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl' aria-hidden='true' />

      <div className='relative mx-auto max-w-6xl px-6 pb-8 pt-14 sm:px-8 lg:px-10'>
        <div className='grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-[1.4fr_0.7fr_1.1fr] lg:gap-20'>
          <div>
            <p className='mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300'>EventHub</p>
            <h2 className={`max-w-md text-3xl font-bold tracking-tight  sm:text-4xl ${dark ? 'text-slate-950' : 'text-white'}`}>
              Make room for moments worth remembering.
            </h2>
            <p className='mt-5 max-w-md text-sm leading-6 text-slate-400'>
              Find your next great experience, keep the good ones close, and show up ready.
            </p>
          </div>

          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-[0.18em]  ${dark ? 'text-slate-500' : 'text-slate-100'}`}>Navigate</h3>
            <nav className='mt-5 flex flex-col items-start gap-3 text-sm' aria-label='Footer navigation'>
              {footerLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className='transition-colors hover:text-cyan-300 focus-visible:text-cyan-300 focus-visible:outline-none'
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-[0.18em]  ${dark ? 'text-slate-500' : 'text-slate-100'}`}>Stay in the loop</h3>
            <p className='mt-5 text-sm leading-6 text-slate-400'>Get a short list of standout events in your inbox.</p>
            <form className='mt-5 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row' onSubmit={(event) => event.preventDefault()}>
              <label className='sr-only' htmlFor='footer-email'>Email address</label>
              <input
                id='footer-email'
                type='email'
                placeholder='you@example.com'
                className='min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20'
              />
              <button
                type='submit'
                className='rounded-lg bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 cursor-pointer'
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className='flex flex-col gap-4 pt-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between'>
          <p>&copy; 2026 EventHub. All rights reserved.</p>
          <div className='flex gap-5'>
            <a href='mailto:okoyekenechukwu678@gmail.com' className='transition-colors hover:text-slate-200'>Contact</a>
            <a href='#privacy' className='transition-colors hover:text-slate-200'>Privacy</a>
            <a href='#terms' className='transition-colors hover:text-slate-200'>Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
