import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import RegisterAdmin from './components/User/RegisterAdmin';
import RegisterUser from './components/User/RegisterUser';
import LoginUser from './components/User/LoginUser';
import UserProfile from './components/User/UserProfile';
import UserData from './components/WheelGame/UserData';
import PrivateRoute from './components/ExpenseApp/PrivateRoute';
import CreditCardList from './components/CreditCards/CreditCardList';
import ExpenseList from './components/ExpenseApp/ExpenseList';
import './App.css';
import EditCreditCard from './components/CreditCards/EditCreditCard';

function App() {
  const [isLoggedin, setIsLoggedIn] = useState(false);
  const [roleId, setRoleId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token) {
      setIsLoggedIn(true);
      setRoleId(role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setRoleId(null);
    navigate('/'); // Redirigir a la página de inicio después de cerrar la sesión
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="Title-header">Drake World v2.0</h1>
        <nav>
          <Link to="/">Inicio</Link> /
          {isLoggedin && roleId === '1' && (
            <>
             <Link to="/register-admin">Admin</Link> /
            </>
          ) }
          <Link to="/register-user">Registrarse</Link> /
          {!isLoggedin && <Link to="/login">Iniciar Sesión</Link>}
          {isLoggedin && (
            <>
            <Link to="/profile">Perfil</Link> /
            <Link to="/expenses">Gastos</Link> /
            <Link to="/expenses/new">Crear</Link> /
            <Link to="/expenses/:id">Detalle</Link> /
            <Link to="/credit-cards">Tarjetas de Crédito</Link> /
            <button onClick={handleLogout}>Cerrar Sesión</button>
            </>
          )}
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/register-admin" 
            element={
              <PrivateRoute role="1">
                <RegisterAdmin />
              </PrivateRoute>
            }
          />
          <Route path="/register-user" element={<RegisterUser />} />
          <Route 
            path="/login"
            element={
              <div>
                <LoginUser setIsLoggedIn={setIsLoggedIn} setRoleId={setRoleId} />
              </div>
            }
          />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/hidden-wheel" element={<UserData userId="1" />} />
          <Route path="/credit-cards" element={<CreditCardList />} />
          <Route path="/expenses" element={<ExpenseList />} />
          <Route path="/credit-cards/:id" element={<EditCreditCard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
