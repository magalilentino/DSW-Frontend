import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import "../../styles/Atencion.css";

interface Servicio {
    codServicio: number;
    nombreServicio: string;
    descripcion: string;
    precio: number; 

}

interface AtencionParams {
    idAtencion: string; // React Router siempre devuelve el valor como string
}


const Servicio: React.FC = () => {
    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { idAtencion } = useParams();  // Hook para obtener parámetros de ruta

    useEffect(() => {
        // Validación preliminar si falta el ID
        if (!idAtencion) {
            setError("Error: El ID de la Atención no se encontró en la ruta.");
            setLoading(false);
            return;
        }

        const token = localStorage.getItem("token");

        fetch(`http://localhost:3000/api/atenciones/${idAtencion}/serviciosDeAtencion`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
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
            setServicios(data.data || []); 
            setLoading(false);
        })
        .catch((err) => {
            console.error("Error al cargar servicios:", err);
            setError("No se pudo cargar la lista de servicios. Revise la consola.");
            setLoading(false);
        });
    // Agregar idAtencion como dependencia
    }, [idAtencion]); 


    const handleModificar = (codServicio: number) => {
        window.location.href = `/atencion/modificarServicio/${codServicio}`;
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
                <th>Descripción</th>
                <th>Precio</th>
                </tr>
            </thead>
            <tbody>
                {servicios.map((s) => (
                <tr key={s.codServicio}>
                    <td>{s.codServicio}</td>
                    <td>{s.nombreServicio}</td>
                    <td>{s.descripcion}</td>
                    <td>{s.precio}</td>
                    <td>
                    <button className="action-button update" onClick={() => handleModificar(s.codServicio)}>
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
};

export default Servicio;