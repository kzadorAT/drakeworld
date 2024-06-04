import React, { useState } from "react";
import { registerUser } from "../../api/users";

const RegisterUser = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setName] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await registerUser({ username, password, email });
            if (response.success) {
                setMessage('User registered successfully');
            } else {
                setMessage('Registration failed: ' + response.message);
            }
        } catch (error) {
            console.error('Error during registration:', error);
            setMessage('Registration failed. Please try again.');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Nombre de Usuario:
                    <input type="text" value={username} onChange={(e) => setName(e.target.value)} required />
                </label>
                <br />
                <label>
                    Email:
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <br />
                <label>
                    Contraseña:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                <br />
                <button type="submit">Registrar</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default RegisterUser;