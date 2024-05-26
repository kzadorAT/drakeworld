import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import UserData from './components/UserData';
import Home from './components/Home';

function App() {
  
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1 className="Title-header">Drake World v2.0</h1>
          <nav>
            <Link to="/">Inicio</Link> /
            <a>Proyectos</a> /
            <a>Youtube</a> /
            <a>Discord</a>
          </nav>
        </header>
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <Home />
                </div>
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
