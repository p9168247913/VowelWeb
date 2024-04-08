import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './scss/style.scss';
import Login from './views/pages/login/Login';
import Register from './views/pages/register/Register';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useToast } from '@chakra-ui/react';
import { Suspense } from 'react';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const navigate = useNavigate();
  const [initialLoad, setInitialLoad] = useState(true);
  const toast = useToast()

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login', { replace: true });
     
    } else if (initialLoad) {
      navigate('/', { replace: true });
      setInitialLoad(false);
    }
  }, [navigate, initialLoad, toast]);
  return (
    <div>
      <Suspense fallback={loading}>
        <Routes>
          <Route path="/" element={<DefaultLayout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/404" element={<Page404 />} />
          <Route path="/500" element={<Page500 />} />
          <Route path="*" element={<DefaultLayout />} />
        </Routes>
        <ToastContainer position="top-center" />
      </Suspense>
    </div>
  );
};

export default App
