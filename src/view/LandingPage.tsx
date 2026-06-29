import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Logo from '../assets/logo.png'
import Hero from '../assets/hero.png'

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
    title: 'Submit Complaints',
    desc: 'Report issues in your neighborhood directly to the municipality and track their resolution in real time.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    title: 'Municipal Services',
    desc: 'Apply for building permits, trade licenses, and more — all without leaving your home.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
        <path d="M9 21V12h6v9"/>
      </svg>
    ),
    title: 'Damage Assessment',
    desc: 'Document and report property damage with photos and get an official evaluation from the municipality.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: 'Track Your Requests',
    desc: 'Stay updated on the status of every service request and complaint through your personal dashboard.',
  },
]

const stats = [
  { value: '12,000+', label: 'Registered Citizens' },
  { value: '30+',     label: 'Available Services'  },
  { value: '98%',     label: 'Satisfaction Rate'   },
  { value: '24/7',    label: 'Support Available'   },
]

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
}

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="Logo" className="h-9 w-9 object-contain" />
            <span className="font-bold text-lg">
              <span className="text-teal-600">Techno </span>
              <span className="text-gray-800">Amar</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2 text-sm font-semibold text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50 transition"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-5 py-2 text-sm font-semibold text-white rounded-lg hover:opacity-90 transition"
              style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
            >
              Create Account
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-16 min-h-screen flex items-center" style={{ background: 'linear-gradient(135deg, #0d3a47 0%, #0d9488 100%)' }}>
        <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-white">
            <motion.span variants={fadeUp}
              className="inline-block px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm font-medium text-teal-200 mb-6"
            >
              Smart Municipality Platform
            </motion.span>
            <motion.h1 variants={fadeUp} className="text-4xl lg:text-5xl font-bold leading-tight mb-5">
              Your City Services,{' '}
              <span className="text-teal-300">One Click Away</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-white/75 leading-relaxed mb-8">
              Techno Amar brings all municipal services to your fingertips —
              submit complaints, request permits, assess property damage, and track
              everything from a single platform.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/register')}
                className="px-7 py-3 bg-white text-teal-700 font-bold rounded-xl text-sm hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                Get Started — It's Free
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-7 py-3 border border-white/40 text-white font-semibold rounded-xl text-sm hover:bg-white/10 transition"
              >
                Sign In
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="hidden lg:flex justify-center"
          >
            <img src={Hero} alt="" className="w-full max-w-md drop-shadow-2xl rounded-2xl" />
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-teal-600 py-10">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={stagger}
          className="max-w-6xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map(s => (
            <motion.div key={s.label} variants={fadeUp} className="text-center text-white">
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-teal-200 text-sm mt-1">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Everything You Need</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              A complete digital platform designed to make municipal services faster,
              simpler, and more transparent for every citizen.
            </p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map(f => (
              <motion.div key={f.title} variants={fadeUp}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-white">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeUp}
          className="max-w-2xl mx-auto px-6 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to get started?</h2>
          <p className="text-gray-500 mb-8">
            Join thousands of citizens already using Techno Amar to connect with their municipality.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3 text-white font-bold rounded-xl text-sm hover:opacity-90 transition shadow-lg"
              style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
            >
              Create a Free Account
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 text-teal-600 font-semibold border border-teal-600 rounded-xl text-sm hover:bg-teal-50 transition"
            >
              Sign In
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="" className="h-6 w-6 object-contain opacity-70" />
            <span className="text-white font-semibold">Techno Amar</span>
          </div>
          <p>© 2026 Techno Amar Municipality Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
