import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import moment from 'moment-timezone';
import tahmRot from '/tahm.png';
import smites from '/castigos.png';
import './App.css';
import UserData from './components/UserData';

function App() {
  const [dias, setDias] = useState(0);

  useEffect(() => {
    const calcularDias = () => {
      const hoy = moment().tz("America/Argentina/Buenos_Aires");
      const fechaInicio = moment.tz('2023-10-06', "America/Argentina/Buenos_Aires");
      const diff = hoy.diff(fechaInicio, 'days');
      setDias(diff);
    };

    calcularDias();
    const intervalId = setInterval(calcularDias, 86400000); // Actualiza cada 24 horas

    return () => clearInterval(intervalId); // Limpia el intervalo al desmontar el componente
  }, []);

  const handleButtonClick = () => {
    const logo = document.querySelector('.logo');
    logo.style.animationDuration = '1s';

    setTimeout(() => {
      logo.style.animationDuration = '20s';
    }, 500); // Después de tres segundos, vuelve a la velocidad normal
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1 className="Title-header">Drake World v2.0</h1>
          <nav>
            <a href="#inicio">Inicio</a> /
            <a href="#proyectos">Proyectos</a> /
            <a href="#youtube">Youtube</a> /
            <a href="#discord">Discord</a>
          </nav>
        </header>
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <section id="inicio">
                  <div>
                    <a href="https://smitesmalos.com.ar" target="_blank" rel="noreferrer">
                      <img src={tahmRot} className="logo react" alt="Tahm Rotando" />
                    </a>
                  </div>
                  <h1>Un nuevo episodio comienza</h1>
                  <div className="card">
                    <button onClick={handleButtonClick}>Botón de hacer nada.</button>
                    <p>¡DrakeWorld aka Smites Malos aka Drake ha regresado!</p>
                    <p>Contador muy básico de castigos malos: 1</p>
                    <img src={smites} alt="Smites Malos" />
                  </div>
                  <p className="read-the-docs">
                    Se está reconstruyendo este sitio. Solo esperen un poco. Días en desarrollo: {dias}.
                  </p>
                </section>
              }
            />
            <Route
              path="/hidden-wheel"
              element={
                <div>
                  <UserData userId="1" />
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
