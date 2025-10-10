import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import "../../styles/Atencion.css";

interface AtSer {
    idAtSer: number;
    servicio: {
        codServicio: number;
        nombreServicio: string;
    }
}


// interface AtencionParams {
//     idAtencion: string; // React Router siempre devuelve el valor como string
// }


const serviciosDeAtencion: React.FC = () => {
    const [atSers, setAtSer] = useState<AtSer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { idAtencion } = useParams();  // Hook para obtener parámetros de ruta

    useEffect(() => {
    if (!idAtencion) {
        setError("Error: ID de Atención no encontrado.");
        setLoading(false);
        return;
    }

        fetch(`http://localhost:3000/api/atSer/${idAtencion}/serviciosPorAtencion`, {
            method: "GET",
            headers: {
            },
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error(`Error ${res.status}: No autorizado o recurso no encontrado.`);
            }
            return res.json();
        })
        .then((data) => {
            console.log("Respuesta de servicios:", data);
            setAtSer(data.data || []); 
            setLoading(false);
        })
        .catch((err) => {
            console.error("Error al cargar servicios:", err);
            setError("No se pudo cargar la lista de servicios. Revise la consola.");
            setLoading(false);
        });
    // Agregar idAtencion como dependencia
    }, [idAtencion]); 


    const handleModificar = (idAtSer: number) => {
        window.location.href = `/atencion/modificarAtSer/${idAtSer}`;
    };


    return (
        <div className="servicio-page">
        <div className="servicio-header">
            <h2>Listado de servicios</h2>
        </div>

        {loading ? (
            <p>Cargando...</p>
        ) : error ? (
            <p className="error">{error}</p>
        ) : (
            <table className="servicios-table">
            <thead>
                <tr>
                <th>ID</th>
                <th>Nombre</th>
                </tr>
            </thead>
            <tbody>
                {atSers.map((as) => (
                <tr key={as.idAtSer}>
                    <td>{as.servicio.codServicio}</td>
                    <td>{as.servicio.nombreServicio}</td>
                    <td>
                    <button className="action-button update" onClick={() => handleModificar(as.idAtSer)}>
                        modificar
                    </button>
        
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
        </div>
    );
}

export default serviciosDeAtencion;