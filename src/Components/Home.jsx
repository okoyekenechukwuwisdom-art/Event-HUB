import { useTheme } from '../content/ThemeContext.jsx';
import { NavLink } from 'react-router-dom';
import eventimg from '../assets/eventimg1.avif';





export default function Home() {

  const { dark } = useTheme();
  return (
    <>
    <div className={`${dark ? 'bg-slate-950 text-black' : 'bg-white text-white'} min-h-screen flex flex-row items-center justify-center  -mt-10 md`}>
      <div className=' text-sm mb-4 tracking-[0.24em] text-cyan-300 rounded-2xl w-200 h-80   mr-4 ml-20 pt-10 pl-10 bg-slate-900' >SMART PLANNING
        <p className='text-4xl text-slate-300 tracking-widest font-bold mt-4'>Discover events that moves your world forward.</p>
        <h4 className='text-lg text-slate-400 mt-4'>Join us and make a difference!</h4>
        <ul className='flex flex-row gap-6 mt-10'>
          <NavLink to="/registration" className='p-2  bg-cyan-600 text-white rounded-full font-semibold tracking-normal hover:bg-cyan-600 transition cursor-pointer hover:font-semi-bold '>View My Bookings</NavLink>
          <NavLink to="/events" className='p-2  bg-cyan-700 text-white rounded-full font-bold tracking-normal hover:bg-cyan-300 transition cursor-pointer hover:font-bold '>Explore Events</NavLink>
        </ul>
     </div>
     <div className='text-4xl w-150 h-80 bg-slate-300 rounded-2xl  mr-20 ml-4 mb-4 pt-10 pl-10 box-border '>

      <div className=' border-b border-[gray]   h-20  w-95 '>
       <div className='text-sm mb-4 tracking-[0.24em] text-cyan-600'>ACTIVE</div>
       <p className='flex flex-row gap-4  w-95 h-10 -mt-2'>
         <span className='text-slate-900 font-bold'>6</span>
         <button className=''></button>
       </p>
      </div>

      <div className='bg-amber-100 h-30 w-95 mt-5'></div>

     </div>
      
    </div>


    <div className={`${dark ? 'bg-slate-950 text-black' : 'bg-white text-white'} min-h-screen flex flex-row items-center justify-center  -mt-15 md `}>
      <img
        src={eventimg} 
        alt="Event Image"
        className='h-70 w-275 object-cover -mt-76 rounded-2xl'>
        </img>
    </div>

    
  </>
  );
}