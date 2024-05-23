import React, { useState, useEffect, useRef } from 'react';
import './Roulette.css';

const Roulette = ({ userId, onSpinResult }) => {
  const [prizes, setPrizes] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const rouletteRef = useRef(null);

  useEffect(() => {
    const fetchPrizes = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/prizes/');
        const data = await response.json();
        setPrizes(data);
      } catch (error) {
        console.error('Error fetching prizes:', error);
      }
    };

    fetchPrizes();
  }, []);

  const spinRoulette = async () => {
    if (isSpinning) return;

    setIsSpinning(true);

    try {
      const response = await fetch('http://localhost:3000/api/spins/spinWheel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });

      const result = await response.json();
      const selectedPrize = result.prize;
      const selectedPrizeIndex = prizes.findIndex(prize => prize.id === selectedPrize.id);
      const prizeRotation = (360 / prizes.length) * selectedPrizeIndex;
      const rotations = 5; // Number of full rotations before stopping
      const finalRotation = rotations * 360 - prizeRotation;

      // Reset the animation by removing and re-adding the style
      rouletteRef.current.style.transition = 'none';
      rouletteRef.current.style.transform = `rotate(0deg)`;

      // Force reflow to apply the new transformation
      rouletteRef.current.offsetHeight;

      rouletteRef.current.style.transition = 'transform 5s cubic-bezier(0.33, 1, 0.68, 1)';
      rouletteRef.current.style.transform = `rotate(${finalRotation+45}deg)`;

      setTimeout(() => {
        alert(`Ah pero...! Ganaste el ${selectedPrize.name} de ${selectedPrize.points} puntos!`);
        setIsSpinning(false);
        if (onSpinResult) {
          onSpinResult(result);
        }
      }, 5000);
    } catch (error) {
      console.error('Error spinning the wheel:', error);
      setIsSpinning(false);
    }
  };

  return (
    <div className="box-roulette">
      <div className="markers"></div>
      <button type="button" id="btn-start" onClick={spinRoulette} disabled={isSpinning}>
        Girar ruleta
      </button>
      <div className="roulette" ref={rouletteRef}>
        {prizes.map((prize, index) => (
          <div
            key={prize.id}
            className="item"
            style={{
              transform: `rotate(${(360 / prizes.length) * index}deg)`,
              backgroundColor: getColorByIndex(index),
            }}
          >
            <div className="label">
              <span className="text">{prize.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const getColorByIndex = (index) => {
  const colors = ['#3f297e', '#169ed8', '#209b6c', '#60b236'];
  return colors[index % colors.length];
};

export default Roulette;
