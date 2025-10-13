import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const navigate = useNavigate();

    
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
        window.location.href = `/atencion/serviciosDeAtencion/${idAtencion}`;
    };

    // const handleCancelar = async (idAtencion: number) => {
    //     try {
    //         await fetch(`http://localhost:3000/api/atencion/cancelar/${idAtencion}`, {
    //         method: "UPDATE",
    //     });
    //     setAtenciones((prev) => prev.filter((a) => a.idAtencion !== idAtencion));
    //     } catch {
    //     alert("Error al calcelar la atencion");
    //     }
    // };


    
    // Función para cancelar (actualizada para usar la ruta PATCH)
    const handleCancelar = async (idAtencion: number) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:3000/api/atencion/cancelar/${idAtencion}`, {
                method: "PATCH",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json" }
            });

            if (!response.ok) throw new Error("Error al cancelar la atención.");

            // Si es exitoso, remueve la atención de la lista pendiente
            setAtenciones((prev) => prev.filter((a) => a.idAtencion !== idAtencion));
            alert("Atención cancelada exitosamente.");
            
        } catch (error) {
            console.error(error);
            alert("Error al cancelar la atención.");
        }
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

