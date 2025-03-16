import { useState } from 'react'
import './App.css'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Layout from './layout/layout1'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={ <Layout /> } >
            <Route index element={<HomePage />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
