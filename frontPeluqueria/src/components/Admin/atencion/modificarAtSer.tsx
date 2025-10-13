
// export default modificarAtSer;
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
// importamos la entidad ProdUt (Producto Utilizado) para tipado si es necesario

// ---------------------------------------------------------------------
// 1. INTERFACES
// ---------------------------------------------------------------------

// Interfaz del producto tal como viene de /api/productos
interface Producto {
    idProducto: number;
    descripcion: string;
}

// Interfaz para el estado de los productos seleccionados (Incluye la cantidad)
interface ProductoSeleccionado {
    idProducto: number;
    descripcion: string;
    cantidad: number; 
}

// Interfaz para la entidad Tono
interface Tono {
    idTono: number;
    nombre: string;
}


const ModificarAtSer: React.FC = () => {
    const { idAtSer } = useParams<{ idAtSer: string }>(); 
    const navigate = useNavigate();

    // Estados
    const [productosDisponibles, setProductosDisponibles] = useState<Producto[]>([]);
    const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoSeleccionado[]>([]);
    const [filtroMarca, setFiltroMarca] = useState("");
    const [filtroCategoria, setFiltroCategoria] = useState("");
    const [tonosDisponibles, setTonosDisponibles] = useState<Tono[]>([]);
    const [tonoSeleccionadoId, setTonoSeleccionadoId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    // ---------------------------------------------------------------------
    // 2. FETCH de PRODUCTOS DISPONIBLES (con filtros)
    // ---------------------------------------------------------------------
    
    // Función para cargar los productos disponibles (ya existente)
    const fetchProductos = useCallback(async () => {
        // ... (Lógica de fetchProductos existente)
        const query = new URLSearchParams();
        if (filtroMarca) query.append('idMarca', filtroMarca);
        if (filtroCategoria) query.append('idCategoria', filtroCategoria);
        
        try {
            const url = `http://localhost:3000/api/producto/listarProductos?${query.toString()}`;
            const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
            
            if (!res.ok) throw new Error("Fallo la carga de productos disponibles.");
            const data = await res.json();
            setProductosDisponibles(data);
            
        } catch (err) {
            console.error(err);
            setError("Error al cargar productos disponibles.");
        } 
        // finally {
        //     // No cambiamos loading aquí, lo dejamos al final de todo
        // }
    }, [filtroMarca, filtroCategoria, token]); 
    
    // FETCH para Tonos
    const fetchTonos = useCallback(async () => {
        try {
            const res = await fetch('http://localhost:3000/api/tono', { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            
            if (!res.ok) throw new Error("Fallo la carga de tonos disponibles.");
            const data = await res.json();
            
            // Asumiendo que la respuesta es { data: Tono[] } o directamente Tono[]
            setTonosDisponibles(data.data || data); 

        } catch (err) {
            console.error(err);
            setError(prev => prev + " Error al cargar tonos."); // Concatenar error
        }
    }, [token]);

    // Ejecuta todos los fetches
    useEffect(() => {
        setLoading(true);
        setError("");
        
        Promise.all([fetchProductos(), fetchTonos()])
            .catch(err => console.error("Error en Promise.all:", err))
            .finally(() => setLoading(false));
            
    }, [fetchProductos, fetchTonos]); // Dependencias que disparan los fetches

    // useEffect(() => {
    //     const fetchProductos = async () => {
    //         setLoading(true);
    //         setError("");
            
    //         // Construye la URL con los filtros de query params
    //         const query = new URLSearchParams();
    //         if (filtroMarca) query.append('idMarca', filtroMarca);
    //         if (filtroCategoria) query.append('idCategoria', filtroCategoria);
            
    //         try {
    //             const url = `http://localhost:3000/api/producto/listarProductos?${query.toString()}`;
    //             const res = await fetch(url, {
    //                 headers: { Authorization: `Bearer ${token}` },
    //             });
                
    //             if (!res.ok) throw new Error("Fallo la carga de productos disponibles.");

    //             const data = await res.json();
    //             setProductosDisponibles(data);
                
    //         } catch (err) {
    //             console.error(err);
    //             setError("Error al cargar productos disponibles.");
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchProductos();
    // }, [filtroMarca, filtroCategoria, token]); 

    
    // ---------------------------------------------------------------------
    // 3. MANEJO DE SELECCIÓN Y CANTIDAD
    // ---------------------------------------------------------------------
    
    // Helper para saber si un producto ya está seleccionado
    const isSelected = (idProducto: number) => productosSeleccionados.some(p => p.idProducto === idProducto);
    
    // Función para manejar la cantidad, añadiendo o quitando de la lista de seleccionados
    const handleCantidadChange = (idProducto: number, cantidadStr: string) => {
        const cantidad = parseFloat(cantidadStr.replace(',', '.')); // Soporte para coma/punto
        const productoInfo = productosDisponibles.find(p => p.idProducto === idProducto);

        if (!productoInfo) return;

        setProductosSeleccionados(prev => {
            const index = prev.findIndex(p => p.idProducto === idProducto);

            if (cantidad > 0 && !isNaN(cantidad)) {
                if (index > -1) {
                    // Actualizar cantidad si ya existe
                    const newArray = [...prev];
                    newArray[index] = { ...newArray[index], cantidad };
                    return newArray;
                } else {
                    // Añadir nuevo producto
                    return [...prev, {
                        idProducto: idProducto,
                        descripcion: productoInfo.descripcion,
                        cantidad: cantidad,
                    }];
                }
            } else {
                // Si la cantidad es 0 o inválida, eliminar de la lista
                return prev.filter(p => p.idProducto !== idProducto);
            }
        });
    };

    const handleTonoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        // Si el valor es una cadena vacía (""), se establece a null (Ninguno)
        const idTono = value === "" ? null : parseInt(value, 10); 
        setTonoSeleccionadoId(idTono);
    };

    // ---------------------------------------------------------------------
    // 4. SUBMIT: GUARDAR PRODUCTOS UTILIZADOS
    // ---------------------------------------------------------------------
    const handleSubmit = async () => {
        const productosAEnviar = productosSeleccionados.map(p => ({
            idProducto: p.idProducto,
            cantidad: p.cantidad
        }));
        
        if (productosAEnviar.length === 0) {
            alert("Debe seleccionar al menos un producto con cantidad.");
            return;
        }

        // 🛑 Data a enviar (incluyendo el tono si está seleccionado)
        // Nota: Si el backend espera el tono en el body del PATCH, agrégalo aquí.
        // Si el tono se guarda en una tabla diferente, necesitarás otro fetch.
        const bodyToSend = { 
            productos: productosAEnviar,
            idTono: tonoSeleccionadoId // Se envía null si no hay tono seleccionado
        };

        try {
            // Usamos el endpoint que definimos previamente
            const response = await fetch(`http://localhost:3000/api/prodUt/registrarProdsUt/${idAtSer}`, { 
                method: 'PATCH', // Para modificar la lista de productos asociados
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(bodyToSend),
            });

            if (!response.ok) throw new Error('Error al guardar los productos utilizados y/o el tono.');
            
            alert('Detalles del servicio actualizados exitosamente.');
            navigate(-1); // Volver a la lista de servicios    
            
        } catch (error) {
            console.error(error);
            alert('Error al procesar el guardado');
        }
    };

    // ---------------------------------------------------------------------
    // 5. RENDERIZADO
    // ---------------------------------------------------------------------

    // Helper para obtener la cantidad actual de un producto
    const getCantidad = (idProducto: number) => {
        const item = productosSeleccionados.find(p => p.idProducto === idProducto);
        return item ? item.cantidad.toString() : '';
    };

    if (loading) return <p>Cargando productos...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="modificar-productos-page">
            <h2>Cargar datos del servicio realizado #{idAtSer}</h2>
            
            {/* Filtros */}
            <div className="filtros">
                <input 
                    type="text" 
                    placeholder="Filtrar por Marca ID" 
                    value={filtroMarca} 
                    onChange={(e) => setFiltroMarca(e.target.value)}
                />
                <input 
                    type="text" 
                    placeholder="Filtrar por Categoría ID" 
                    value={filtroCategoria} 
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                />
            </div>
            
            {/* Listado de Productos */}
            <table className="productos-disponibles-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad Utilizada</th>
                    </tr>
                </thead>
                <tbody>
                    {productosDisponibles.map((p) => (
                        <tr key={p.idProducto}>
                            <td>{p.descripcion}</td>
                            <td>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    placeholder="Ingresa cantidad"
                                    value={getCantidad(p.idProducto)}
                                    onChange={(e) => handleCantidadChange(p.idProducto, e.target.value)}
                                    className={isSelected(p.idProducto) ? 'selected-input' : ''}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {/* Selector de Tonos */}
            <div >
                <label htmlFor="select-tono" >
                    Seleccionar Tono (Opcional):
                </label>
                <select
                    id="select-tono"
                    value={tonoSeleccionadoId === null ? "" : tonoSeleccionadoId.toString()}
                    onChange={handleTonoChange}>
                        
                    {/* Opción para seleccionar NINGUNO */}
                    <option value="">Ninguno</option>
                    
                    {/* Mapeo de la lista de tonos */}
                    {tonosDisponibles.map((tono) => (
                        <option key={tono.idTono} value={tono.idTono}>
                            {tono.nombre}
                        </option>
                    ))}
                </select>
            </div>

            <button onClick={handleSubmit}>
                Guardar Productos Utilizados
            </button>
        </div>
    );
};

export default ModificarAtSer;