import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import Forge from './pages/Forge'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/forge-checker' element={<Forge />} />
      </Routes>
    </Router>
  )
}

export default App
