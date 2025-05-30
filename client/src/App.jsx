import { useContext, useState } from 'react'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import ProfilePage from './pages/ProfilePage'
import {Toaster}  from 'react-hot-toast'
import { AuthContext } from './context/AuthContext'

function App() {
  const {authUser} = useContext(AuthContext);
  return (
      <div className="bg-[url('/bgImage.svg')] bg-contain">
       <Toaster/> 
      <Routes>
      <Route path='/' element={authUser ? <HomePage/> : <Navigate to='/login'/>}/>
      <Route path='/login' element={!authUser ? <Login/> : <Navigate to='/'/>}/>
      <Route path='/profile' element={ authUser ? <ProfilePage/> :  <Navigate to='/login'/> }/>
      </Routes>
    </div>
  )
}

export default App
