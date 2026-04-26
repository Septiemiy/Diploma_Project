import { Routes, Route } from 'react-router-dom'
import  Landing  from './pages/Landing/Landing.tsx'

import './assests/styles/normalize.css'
import './assests/styles/global.scss'

const App = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={ <Landing /> } />
      </Routes>
    </>
  )
}

export default App
