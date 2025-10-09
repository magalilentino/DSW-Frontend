import React, { useEffect, useState } from "react";
// import "../../styles/Atencion.css";

interface Atencion {
    idAtencion: number;
    cliente: {
        nombre: string;
    };

}

const Atencion: React.FC = () => {
    const [atenciones, setAtenciones] = useState<Atencion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");



    
    useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3000/api/atencion/pendientes", {
    method: "GET",
    headers: {
        Authorization: `Bearer ${token}`,
    },
    })
        .then((res) => {
            if (!res.ok) throw new Error("No autorizado");
            return res.json();
    })
        .then((data) => {
            console.log("Respuesta de atenciones:", data);
            setAtenciones(data.data); 
            setLoading(false);
    })
        .catch(() => {
            setError("No se pudo cargar la lista de atenciones.");
            setLoading(false);
    });
    }, []);


    const handleFinalizar = (idAtencion: number) => {
        window.location.href = `/atencion/finalizar/${idAtencion}`;
    };

    const handleCancelar = (idAtencion: number) => {
        window.location.href = `/atencion/cancelar/${idAtencion}`;
    };


    return (
        <div className="atencion-page">
        <div className="atencion-header">
            <h2>Listado de Atenciones pendientes</h2>
        </div>

        {loading ? (
            <p>Cargando...</p>
        ) : error ? (
            <p className="error">{error}</p>
        ) : (
            <table className="atencion-table">
            <thead>
                <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {atenciones.map((a) => (
                <tr key={a.idAtencion}>
                    <td>{a.idAtencion}</td>
                    <td>{a.cliente.nombre}</td>
                    <td>
                    <button className="action-button update" onClick={() => handleFinalizar(a.idAtencion)}>
                        Finalizar
                    </button>
                    <button className="action-button update" onClick={() => handleCancelar(a.idAtencion)}>
                        Cancelar
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
        </div>
    );
};

export default Atencion;

