import React from 'react';

const Lecciones = ({lecciones}) => {

    return lecciones.length ? (
        <table className="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                </tr>
            </thead>
            <tbody>
                {lecciones?.map(leccion => (
                    <tr key={leccion.IdLeccion}>
                        <th>{leccion.IdLeccion}</th>
                        <th>{leccion.Nombre}</th>
                    </tr>
                ))}
            </tbody>
        </table>
    ): <div>No data.</div>;
}

export default Lecciones;
