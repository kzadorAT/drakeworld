import React, { useState } from "react";
import { registerAdmin } from "../../api/users";

const RegisterAdmin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [roleId] = useState(1); // 1 = Admin, 2 = User

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await registerAdmin({ username, password, email, roleId });
            console.log(data); // Do something with the response data
        } catch (error) {
            console.error(error);
        };
    };

    return (
        <div>
            <h2>Registrar Admin</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Nombre de usuario:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </label>
                <br />
                <label>
                    Contraseña:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                <br />
                <label>
                    Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <br />
                <button type="submit">Registrar</button>
            </form>
        </div>
    );
};

export default RegisterAdmin;