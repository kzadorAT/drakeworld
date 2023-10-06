import tahmRot from '/tahm.png'
import './App.css'

function App() {
  const today = new Date();
  const startDate = new Date('2023-10-06');
  const diff = today - startDate;
  
  return (
    <>
      <div>
        <a href="https://smitesmalos.com.ar" target="_blank">
          <img src={tahmRot} className="logo react" alt="Tahm Rotando" />
        </a>
      </div>
      <h1>Un nuevo episodio comienza</h1>
      <div className="card">
        <button>
          Boton de no hacer nada.
        </button>
        <p>
          DrakeWorld aka Smites Malos aka Drake regresó!
        </p>
      </div>
      <p className="read-the-docs">
        Se está reconstruyendo este sitio. Solo esperen un poco. Dias {Math.floor(diff/(1000 * 60 * 60 * 24))}.
      </p>
    </>
  )
}

export default App
