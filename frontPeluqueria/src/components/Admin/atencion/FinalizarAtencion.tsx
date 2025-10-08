// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import "../../styles/ActualizarCategoria.css";

// const FinaliarAtencion: React.FC = () => {
//     const { idAtencion } = useParams();
//     const navigate = useNavigate();
//     const [estado, setEstado] = useState("");
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");

//     useEffect(() => {
//         fetch(`http://localhost:3000/api/atencion/${idAtencion}`)
//         .then((res) => res.json())
//         .then((data) => {
//             setEstado(data.data.estado);
//             setLoading(false);
//         })
//         .catch(() => {
//             setError("No se pudo ");
//             setLoading(false);
//         });
//     }, [idAtencion]);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError("");
//         setSuccess("");
//         setLoading(true);

//         try {
//         const res = await fetch(`http://localhost:3000/api/atencion/${idAtencion}`, {
//             method: "PUT",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ estado }),
//         });

//         const data = await res.json();

//         if (!res.ok) {
//             throw new Error(data.message || "Error al actualizar el estado");
//         }

//         setSuccess("atencion finalizada");
//         setTimeout(() => navigate("/atencion"), 1500);
//         } catch (err: any) {
//         setError(err.message);
//         } finally {
//         setLoading(false);
//         }
//     };

//     return (
//         <div className="finalizar-atencion-container">
//         <h2>Finalizar atencion</h2>
//         {loading ? (
//             <p>Cargando datos...</p>
//         ) : (
//             <table className="atencion-table">
//             <thead>
//                 <tr>
//                 <th>ID</th>
//                 <th>Cliente</th>
//                 <th>Acciones</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {atenciones.map((a) => (
//                 <tr key={a.idAtencion}>
//                     <td>{a.idAtencion}</td>
//                     <td>{a.cliente.nombre}</td>
//                     <td>
//                     <button className="action-button update" onClick={() => handleFinalizar(a.idAtencion)}>
//                         Finalizar
//                     </button>
//                     <button className="action-button update" onClick={() => handleCancelar(a.idAtencion)}>
//                         Cancelar
//                     </button>
//                     </td>
//                 </tr>
//                 ))}
//             </tbody>
//             </table>

//             {error && <p className="error">{error}</p>}
//             {success && <p className="success">{success}</p>}

//             <button type="submit" disabled={loading}>
//                 {loading ? "Actualizando..." : "Actualizar"}
//             </button>
//             </form>
//         )}
//         </div>
//     );
// };

// export default FinalizarAtencion;