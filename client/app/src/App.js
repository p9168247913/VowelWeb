import logo from './logo.svg';
import { Router } from "react-router-dom"
import './App.css';
import Routes from './Allroutes';
import AuthContextProvider from './Pages/AuthContext';

function App() {
  return (
    <div className="App">
       <Router>
      <AuthContextProvider>
        <Routes />
      </AuthContextProvider>
    </Router>
    </div>
  );
}

export default App;
