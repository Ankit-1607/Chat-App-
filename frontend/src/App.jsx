import { useEffect } from 'react'

import Navbar from './components/Navbar'

import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'

import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'

import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect( () => {
    checkAuth();
  }, [checkAuth]);

  console.log( { authUser });

  if(isCheckingAuth && !authUser) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Loader className='size-10 animate-spin' />
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <Toaster />
      {/* If user is not authorized take them to login page - Route Protection mechanism */}
      <div className='mt-10'>
      <Routes>
        <Route path='/' element= { authUser ? <HomePage /> : <Navigate to = '/login' /> } />
        {/* If user is logged in they shouldn't see signup page */}
        <Route path='/signup' element= { !authUser ? <SignUpPage /> : <Navigate to = '/' /> } /> 
        <Route path='/login' element= { !authUser ? <LoginPage /> : <Navigate to = '/' /> } />
        <Route path='/settings' element= { <SettingsPage /> } />
        <Route path='/profile' element= { authUser ? <ProfilePage />  : <Navigate to = '/login' /> } />
      </Routes>
      </div>
    </div>
  )
}

export default App;