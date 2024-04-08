import React, { Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { CContainer, CSpinner } from '@coreui/react';
import routes from '../routes';

const AppContent = () => {
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('currentRoute', location.pathname);
  }, [location]);

  const storedRoute = localStorage.getItem('currentRoute') || '/';

  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              )
            );
          })}
          {/* Use the stored route as the default route */}
          <Route path="/" element={<Navigate to={storedRoute} />} />
        </Routes>
      </Suspense>
    </CContainer>
  );
};

export default React.memo(AppContent);
