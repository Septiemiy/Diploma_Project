import { Routes, Route } from 'react-router-dom'
import  Landing  from './pages/Landing/Landing.tsx'
import Login from './pages/Login/Login.tsx'
import Registration from './pages/Registration/Registration.tsx'

import './assests/styles/normalize.css'
import './assests/styles/global.scss'

const App = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={ <Landing /> } />
        <Route path="login" element={ <Login /> } />
        <Route path="register" element={ <Registration /> } />
        <Route path="*" element={ <Landing /> } />
      </Routes>
    </>
  )
}

export default App
