import React, { useState, useEffect } from "react";
import Roulette from "./Roulette";

const UserData = ({ userId }) => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserData();
    }, [userId]);

    const fetchUserData = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/spinUsers/${userId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }
            const data = await response.json();
            setUserData(data);
        } catch (error) {
            setError(error.message);
            console.error('Error fetching user data:', error);
        }
    };

    const handleSpinResult = (result) => {
        // Actualizar los datos del usuario basado en el resultado del giro
        setUserData(prevData => ({
            ...prevData,
            points: prevData.points + result.prize.points,
            freeSpins: prevData.freeSpins - 1,
            lastSpin: new Date().toISOString(),
            canSpinAgainIn: 24 // o el valor correcto según tu lógica
        }));
    };

    return (
        <div className="user-data">
            {error && <p>Error: {error}</p>}
            {userData && (
                <div>
                    <h1>{userData.username}</h1>
                    <h5>Que no se note que nos falta alguien en el equipo, no lo mires en el celu!!!! (o si)</h5>
                    <p>Puntos disponibles: {userData.points}</p>
                    <p>Tus giros gratis: {userData.freeSpins}</p>
                    <p>Última vez que giraste: {userData.lastSpin ? new Date(userData.lastSpin).toLocaleDateString() : "No sé che"}</p>
                    <p>Puedes volver a girar {userData.freeSpins > 0  || userData.canSpinAgainIn === 0 ? '' : `en ${userData.canSpinAgainIn} horas`}</p>
                </div>
            )}
            <div>
                <Roulette userId={userId} onSpinResult={handleSpinResult} />
            </div>
        </div>
    );
};

export default UserData;