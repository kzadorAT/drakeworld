import React, { useState, useEffect } from "react";
import Roulette from "./Roulette";
import AvailableGifts from "./AvailableGifts";
import RedeemHistory from "./RedeemHistory";
import './UserData.css';

const UserData = ({ userId }) => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [reloadData, setReloadData] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, [userId, reloadData]);

    const fetchUserData = async () => {
        try {
            const response = await fetch(`https://drakeworld-backend.vercel.app/api/spinUsers/${userId}`);
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
            canSpinAgainIn: 8 // o el valor correcto según tu lógica
        }));
    };

    const handleRedeemSuccess = () => {
        fetchUserData(); // Actualiza los datos del usuario
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
            <div className="gift-section">
                <AvailableGifts userId={userId} userPoints={userData ? userData.points : 0} onRedeemSuccess={handleRedeemSuccess} reloadData={reloadData} />
                <RedeemHistory userId={userId} reloadData={reloadData} />
            </div>
        </div>
    );
};

export default UserData;