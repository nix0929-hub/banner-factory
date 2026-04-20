import { useState } from 'react'
import { LandingPage } from './pages/LandingPage'
import { HomePage } from './pages/HomePage'

function App() {
  const [started, setStarted] = useState(false)

  if (!started) {
    return <LandingPage onStart={() => setStarted(true)} />
  }

  return <HomePage />
}

export default App
