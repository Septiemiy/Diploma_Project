import { Routes, Route } from 'react-router-dom'
import  Landing  from './pages/Landing/Landing.tsx'
import Login from './pages/Login/Login.tsx'
import Registration from './pages/Registration/Registration.tsx'
import PickStreamerPage from './pages/PickStreamers/PickStreamers.tsx'
import DashboardLayout from './components/DashboardLayout/DashboardLayout.tsx'
import { DashboardProvider } from './context/DashboardContext.tsx'

import './assests/styles/normalize.css'
import './assests/styles/global.scss'
import DashboardTopBar from './components/DashboardTopBar/DashboardTopBar.tsx'


const App = () => {

  return (
    <>
      <DashboardProvider>
        <Routes>
          <Route path="/" element={ <Landing /> } />
          <Route path="login" element={ <Login /> } />
          <Route path="register" element={ <Registration /> } />
          <Route 
            path="/dashboard" 
            element={
              <>
                <DashboardTopBar />
                <DashboardLayout /> 
              </>
            }
          >
            <Route index element={<PickStreamerPage />} />
          </Route>
          <Route path="*" element={ <Landing /> } />
        </Routes>
      </DashboardProvider>
    </>
  )
}

export default App
