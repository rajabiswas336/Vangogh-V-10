import './App.css'
import './styles/typography-motion.css'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Services from './components/Services.jsx'
import WorkPreview from './components/WorkPreview.jsx'
import Process from './components/Process.jsx'
import Experts from './components/Experts.jsx'
import Pricing from './components/Pricing.jsx'
import CtaBand from './components/CtaBand.jsx'
import Footer from './components/Footer.jsx'
import Orb from './components/Orb.jsx'

export default function App() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <Hero />
        <WorkPreview />
        <Services />
        <Process />
        <Experts />
        <Pricing />
        <CtaBand />
      </main>
      <Footer />
      <Orb />
    </>
  )
}
