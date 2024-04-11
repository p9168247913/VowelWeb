import React, { useState } from 'react'
// import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useToast } from '@chakra-ui/react';
import baseUrl from 'src/URL/baseUrl';
import axios from 'axios'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/v1/auth/login`, { email, password });
      if (response.data.code === 200) {
        toast({
          title: 'Login Successful',
          status: 'success',
          duration: 4000,
          isClosable: true,
          position: "top"
        });
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
        localStorage.setItem("accessToken", response.data.data.tokens.access.token)
        localStorage.setItem("refreshToken", response.data.data.tokens.refresh.token)
        localStorage.setItem("user", JSON.stringify(response.data.data.user))

        setEmail('');
        setPassword('');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response.data.data,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: "top"
      });
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center" >
      <CContainer>
        <CRow className="justify-content-center" style={{ backgroundColor: "blue", }}>
          <CCol md={8} style={{ backgroundColor: "transperent " }}>
            <CCardGroup style={{ width: "75%", margin: "auto", }}>
              <CCard className="p-4" style={{ margin: "auto", marginRight: '20px', backgroundColor: "rgb(61,84,84)" }}>
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1 style={{ color: "rgb(199,205,215)", }}>Login</h1>
                    <p style={{ color: "white", }}>Sign In to your account</p>
                    <CInputGroup className="mb-3" style={{ marginTop: "30px" }}>
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput type="email" required placeholder="Email" value={email} onChange={handleEmailChange} autoComplete="username" />
                    </CInputGroup>
                    <CInputGroup className="mb-4" style={{ marginTop: "30px" }}>
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password} onChange={handlePasswordChange}
                      />
                    </CInputGroup>
                    <CRow >
                      <CCol xs={6} style={{ marginTop: "40px" }}>
                        <CButton type='submit' style={{ backgroundColor: 'black', border: '2px solid black', fontWeight: "600" }} className="px-4">
                          Login
                        </CButton>
                      </CCol>
                      {/* <CCol xs={6} className="text-right" style={{ marginTop: "40px", }}>
                        <CButton color="link" style={{ color: "white", fontWeight: "400" }}>
                          Forgot password?
                        </CButton>
                      </CCol> */}
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
