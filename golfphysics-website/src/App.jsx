import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProfessionalAPI from './pages/ProfessionalAPI'
import GamingAPI from './pages/GamingAPI'
import Pricing from './pages/Pricing'
import Science from './pages/Science'
import About from './pages/About'
import Docs from './pages/Docs'
import Contact from './pages/Contact'
import Enterprise from './pages/Enterprise'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/professional" element={<ProfessionalAPI />} />
          <Route path="/gaming" element={<GamingAPI />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/science" element={<Science />} />
          <Route path="/about" element={<About />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/enterprise" element={<Enterprise />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
