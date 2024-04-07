import React from 'react'
import { Routes, Route } from "react-router-dom"
import Home from './Pages/Home'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import PrivateRoute from './Pages/PrivateRoute';


const Allroutes = () => {

  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <PrivateRoute exact path="/" element={<Home/>} />
      </Routes>

      {/* {
        !token ?
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            
          </Routes> :
          <div>
            <Sidebar />
            <div>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
              </Routes>
            </div>
          </div>
      } */}
    </div>
  )
}

export default Allroutes