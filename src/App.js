
import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './App.css';

function App() {
  const [modo, setModo] = useState('login'); 

  return (
    <div className="App">
      {modo === 'login' ? <Login /> : <Register />}
      <div>
        {modo === 'login' ? (
          <>
            <p>¿No tienes cuenta?</p>
            <button onClick={() => setModo('register')}>Registrarse</button>
          </>
        ) : (
          <>
            <p>¿Ya tienes cuenta?</p>
            <button onClick={() => setModo('login')}>Iniciar Sesión</button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
