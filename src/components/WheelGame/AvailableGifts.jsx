import React, { useState, useEffect } from "react";

const AvailableGifts = ({ userId, userPoints, onRedeemSuccess, reloadData }) => {
    const [gifts, setGifts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGifts = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/gifts`);
                const data = await response.json();
                setGifts(data);
            } catch (error) {
                setError('Error al obtener los regalos disponibles');
                console.error('Error fetching gifts:', error);
            }
        };

        fetchGifts();
    }, [reloadData]);
    
    const redeemGift = async (giftId, pointsRequired) => {
        if (userPoints < pointsRequired) {
            setError('No tienes suficientes puntos para canjear este regalo');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/redeems`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, giftId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message === "Gift is out of stock" ? 'El regalo está agotado' : 'No tienes suficientes puntos para canjear este regalo');
                return;
            }
            
            const result = await response.json();
            onRedeemSuccess(result);
        } catch (error) {
            setError('Error al canjear el regalo');
            console.error('Error redeeming gift:', error);
        }
    };

    return (
        <div>
            <h2>Regalos disponibles</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Puntos Requerido</th>
                        <th>Disponibilidad</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {gifts.map(gift => (
                        <tr key={gift.id}>
                            <td>{gift.name}</td>
                            <td>{gift.points_required}</td>
                            <td>{gift.quantity_available > 0 ? 'Disponible' : 'Agotado'}</td>
                            <td>
                                <button
                                    onClick={() => redeemGift(gift.id, gift.points_required)}
                                    disabled={userPoints < gift.points_required || gift.quantity_available === 0}
                                >
                                    Canjear
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AvailableGifts;