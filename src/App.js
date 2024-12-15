import React from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Register from "./pages/Register"
import Login from './pages/Login'
import Chat from './pages/Chat'
import Avatar from './pages/Avatar'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/register' element={<Register />}  />
      <Route path='/login'  element={<Login />} />
      <Route path='/avatar' element={<Avatar />} />
      <Route path='/' element={<Chat />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App