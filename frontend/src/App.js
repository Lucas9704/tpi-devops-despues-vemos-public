import React, {Fragment, useState, useEffect} from 'react';
import Navbar from './Components/Navbar'
import Lecciones from './Components/Lecciones'

function App() {

  const [lecciones, setLecciones] = useState([])
  
  useEffect(() => {
    const getLecciones = () => {
      fetch('http://localhost:9000/api')
      .then(res => res.json())
      .then(res => setLecciones(res))
    }
    getLecciones()
  }, [])

  return (
    <Fragment>
      <Navbar brand='Prueba App'/>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 style={{textAlign: 'center'}}>Lecciones</h2>
            <Lecciones lecciones={lecciones} />
          </div>
        </div>
      </div>
    </Fragment>
  );

}

export default App;
