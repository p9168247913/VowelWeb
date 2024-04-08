import React, { useContext, Navigate } from 'react';
import { Route } from 'react-router-dom';
import { AuthContext } from './AuthContext';

function PrivateRoute({ component: Component, ...rest }) {
  const { user } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? <Component {...props} /> : <Navigate to="/login" />
      }
    />
  );
}

export default PrivateRoute;
