import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Projects from './components/sections/Projects'
import Contact from './components/sections/Contact'
import DotField from './components/ui/DotField'
import TargetCursor from './components/ui/TargetCursor'

function App() {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Custom targeting cursor, global. */}
      <TargetCursor spinDuration={2} hideDefaultCursor parallaxOn />

      {/* Fixed full-viewport background layer for the Dot Field. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        id="dot-grid"
      >
        <DotField
          dotRadius={1.8}
          dotSpacing={14}
          bulgeStrength={67}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
        />
      </div>

      {/* Foreground content */}
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default App
