import './App.css'
import './styles/typography-motion.css'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Services from './components/Services.jsx'
import WorkPreview from './components/WorkPreview.jsx'
import ClientStories from './components/ClientStories.jsx'
import Process from './components/Process.jsx'
import Experts from './components/Experts.jsx'
import Pricing from './components/Pricing.jsx'
import CtaBand from './components/CtaBand.jsx'
import Footer from './components/Footer.jsx'
import Orb from './components/Orb.jsx'
import IntroMurmuration from './components/IntroMurmuration.jsx'
import StarryNight from './components/StarryNight.jsx'
import './styles/cosmic.css'
import './styles/liquid-glass.css'
import usePauseOffscreen from './motion/usePauseOffscreen.js'

export default function App() {
  usePauseOffscreen()
  return (
    <>
      <StarryNight />
      <a className="skip" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <Hero />
        <WorkPreview />
        <ClientStories />
        <Services />
        <Process />
        <Experts />
        <Pricing />
        <CtaBand />
      </main>
      <Footer />
      <Orb />
      <IntroMurmuration />
    </>
  )
}
