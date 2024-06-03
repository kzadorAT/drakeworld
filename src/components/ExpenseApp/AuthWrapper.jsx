import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthWrapper = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [roleId, setRoleId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (token && role) {
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

    return React.cloneElement(children, { isLoggedIn, roleId, handleLogout });
};

export default AuthWrapper;