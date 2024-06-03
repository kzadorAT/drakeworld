import React, { useState, useEffect } from "react";
import './Wheel.css';

const prizes = [
    { name: 'Small Prize', points: 10 },
    { name: 'Medium Prize', points: 50 },
    { name: 'Large Prize', points: 100 },
    { name: 'Jackpot', points: 500 },
  ];

const Wheel = ({ userId }) => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const spinWheel = async () => {
        if (isSpinning) return;

        setIsSpinning(true);
        setResult(null);
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/spins/spinWheel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId })
            });

            if (!response.ok) {
                throw new Error('Failed to spin the wheel');
            }

            const data = await response.json();
            const { prize } = data;

            setResult(prize);
        } catch (error) {
            console.error(error);
            setResult('Error al girar la ruleta');
        } finally {
            setIsSpinning(false);
        }
    };

    return (
        <div className="wheel-container">
            <div className={`wheel ${isSpinning ? 'spinning' : ''}`}>
                {prizes.map((prize, index) => (
                    <div key={index} className="segment">
                        {prize.name}
                    </div>
                ))}
            </div>
            <button onClick={spinWheel} disabled={isSpinning}>
                Girar la ruleta
            </button>
            {result && (
                <p>
                    Resultado: {result.name} - {result.points} puntos
                </p>
            )}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default Wheel;