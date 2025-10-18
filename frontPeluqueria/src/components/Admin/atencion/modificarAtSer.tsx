
// export default modificarAtSer;
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
// importamos la entidad ProdUt (Producto Utilizado) para tipado si es necesario


// 1. INTERFACES

// Interfaz del producto tal como viene de /api/productos
interface ProdMar {
    idPM: number;
    producto: {
        descripcion: string};
    marca: {
        nombre: string};
}
// Interfaz para el estado de los productos seleccionados (Incluye la cantidad)
interface ProductoSeleccionado {
    idPM: number;
    cantidad: number; 
}

// Interfaz para la entidad Tono
interface Tono {
    idTono: number;
    nombre: string;
}

interface Marca {
    idMarca: number;
    nombre: string;
}

interface Categoria {
    idCategoria: number;
    nombreCategoria: string;
}

const ModificarAtSer: React.FC = () => {
    const { idAtSer } = useParams<{ idAtSer: string }>(); 
    const navigate = useNavigate();

    // Estados
    const [productosDisponibles, setProductosDisponibles] = useState<ProdMar[]>([]);
    const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoSeleccionado[]>([]);
    const [filtroMarca, setFiltroMarca] = useState("");
    const [filtroCategoria, setFiltroCategoria] = useState("");
    const [tonosDisponibles, setTonosDisponibles] = useState<Tono[]>([]);
    const [tonoSeleccionadoId, setTonoSeleccionadoId] = useState<number | null>(null);
    const [marcas, setMarcas] = useState<Marca[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [idAtencion, setIdAtencion] = useState<string | null>(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    
    // 2. FETCH de PRODUCTOS DISPONIBLES (con filtros)
        //  NUEVO FETCH para Marcas
    const fetchMarcas = useCallback(async () => {
        try {
            const res = await fetch('http://localhost:3000/api/marca', { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            if (!res.ok) throw new Error("Fallo la carga de marcas.");
            const responseData = await res.json();
        // CAMBIO CLAVE: Acceder a la propiedad 'data' que contiene el array.
        // Se añade una verificación de seguridad (|| []) por si 'data' no existe.
            const marcasArray = responseData.data || []; 
            
            if (Array.isArray(marcasArray)) {
                setMarcas(marcasArray); 
            } else {
                // Esto captura si 'data' existe pero NO es un array
                console.error("La propiedad 'data' de la API de marcas no es un array.");
                setMarcas([]);
            }

        } catch (err) {
            console.error(err);
        }
    }, [token]);
    
    //  NUEVO FETCH para Categorías
    const fetchCategorias = useCallback(async () => {
        try {
            const res = await fetch('http://localhost:3000/api/categoria', { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            if (!res.ok) throw new Error("Fallo la carga de categorías.");
             const responseData = await res.json();
        //  CAMBIO CLAVE: Acceder a la propiedad 'data' que contiene el array.
        // Se añade una verificación de seguridad (|| []) por si 'data' no existe.
            const categoriaArray = responseData.data || []; 
            
            if (Array.isArray(categoriaArray)) {
                setCategorias(categoriaArray); 
            } else {
                // Esto captura si 'data' existe pero NO es un array
                console.error("La propiedad 'data' de la API de categorias no es un array.");
                setCategorias([]);
            }

        } catch (err) {
            console.error(err);
        }
    }, [token]);

    
    // Función para cargar los productos disponibles (ya existente)
    const fetchProductos = useCallback(async () => {
        // ... (Lógica de fetchProductos existente)
        const query = new URLSearchParams();
        if (filtroMarca) query.append('idMarca', filtroMarca);
        if (filtroCategoria) query.append('idCategoria', filtroCategoria);
        
        try {
            const url = `http://localhost:3000/api/prodMar/listarProductos?${query.toString()}`;
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

    const fetchAtencionId = async () => {
        try {
            //  AJUSTA ESTA URL a tu endpoint para obtener el detalle de AtSer
            const res = await fetch(`http://localhost:3000/api/atSer/${idAtSer}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Fallo la carga del AtSer.");
            const data = await res.json();
            // 🛑 AJUSTA 'data.idAtencion' si el campo se llama diferente en tu backend
            if (data.idAtencion) {
                setIdAtencion(data.idAtencion.toString()); 
            } else {
                console.error("No se encontró idAtencion en la respuesta del AtSer.");
            }
        } catch (err) {
            console.error("Error al obtener el idAtencion:", err);
            // Si falla, el botón de "Volver" no funcionará, o usará '#'
        }
    };

    // Ejecuta todos los fetches
    useEffect(() => {
        setLoading(true);
        setError("");
        
        Promise.all([fetchProductos(), fetchTonos(), fetchAtencionId(), fetchMarcas(), fetchCategorias()])
            .catch(err => console.error("Error en Promise.all:", err))
            .finally(() => setLoading(false));
            
    }, [fetchProductos, fetchTonos, fetchMarcas, fetchCategorias]); // Dependencias que disparan los fetches
    
    // 3. MANEJO DE SELECCIÓN Y CANTIDAD
    // Helper para saber si un producto ya está seleccionado
    const isSelected = (idPM: number) => productosSeleccionados.some(p => p.idPM === idPM);
    
    // Función para manejar la cantidad, añadiendo o quitando de la lista de seleccionados
    const handleCantidadChange = (idProducto: number, cantidadStr: string) => {
        const cantidad = parseFloat(cantidadStr.replace(',', '.')); // Soporte para coma/punto
        const productoInfo = productosDisponibles.find(p => p.idPM === idProducto);

        if (!productoInfo) return;

        setProductosSeleccionados(prev => {
            const index = prev.findIndex(p => p.idPM === idProducto);

            if (cantidad > 0 && !isNaN(cantidad)) {
                if (index > -1) {
                    // Actualizar cantidad si ya existe
                    const newArray = [...prev];
                    newArray[index] = { ...newArray[index], cantidad };
                    return newArray;
                } else {
                    // Añadir nuevo producto
                    return [...prev, {
                        idPM: idProducto,
                        cantidad: cantidad,
                    }];
                }
            } else {
                // Si la cantidad es 0 o inválida, eliminar de la lista
                return prev.filter(p => p.idPM !== idProducto);
            }
        });
    };

    const handleTonoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        // Si el valor es una cadena vacía (""), se establece a null (Ninguno)
        const idTono = value === "" ? null : parseInt(value, 10); 
        setTonoSeleccionadoId(idTono);
    };

    const handleBack = () => {
        if (idAtencion) {
            // Construye la URL de destino usando el idAtencion recuperado
            navigate(`/atencion/serviciosDeAtencion/${idAtencion}`);
        } else {
            alert("No se pudo determinar la Atención para regresar.");
            // Alternativa segura: navigate(-1)
        }
    };

    
    // 4. SUBMIT: GUARDAR PRODUCTOS UTILIZADOS
    
    const handleSubmit = async () => {
        const productosAEnviar = productosSeleccionados.map(p => ({
            idPM: p.idPM,
            cantidad: p.cantidad
        }));
        
        if (productosAEnviar.length === 0) {
            alert("Debe seleccionar al menos un producto con cantidad.");
            return;
        }

        // Data a enviar (incluyendo el tono si está seleccionado)
        // Nota: Si el backend espera el tono en el body del PATCH, agrégalo aquí.
        // Si el tono se guarda en una tabla diferente, necesitarás otro fetch.
        const bodyToSend = { 
            prodMars: productosAEnviar,
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

    
    // 5. RENDERIZADO
    

    // Helper para obtener la cantidad actual de un producto
    const getCantidad = (idPM: number) => {
        const item = productosSeleccionados.find(p => p.idPM === idPM);
        return item ? item.cantidad.toString() : '';
    };

    if (loading) return <p>Cargando productos...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="modificar-productos-page">
            <h2>Cargar datos del servicio realizado {idAtSer}</h2>

            <button
                className="reservas-back-button"
                onClick={handleBack} // Llama a la función que usa navigate
                disabled={!idAtencion} // Deshabilitar si aún no tenemos el ID
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </button>
            
             {/*  FILTROS CON DESPLEGABLES */}
            <div className="filtros">
                {/* Desplegable de MARCA */}
                <select
                    value={filtroMarca} 
                    onChange={(e) => setFiltroMarca(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="">Todas las Marcas</option>
                    {marcas && marcas.map((m) => (
                        <option key={m.idMarca} value={m.idMarca.toString()}>
                            {m.nombre}
                        </option>
                    ))}
                </select>

                {/* Desplegable de CATEGORÍA */}
                <select
                    value={filtroCategoria} 
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="">Todas las Categorías</option>
                    {categorias && categorias.map((c) => (
                        <option key={c.idCategoria} value={c.idCategoria.toString()}>
                            {c.nombreCategoria}
                        </option>
                    ))}
                </select>
            </div>

            
            {/* Listado de Productos */}
            <table className="productos-disponibles-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Marca</th>
                        <th>Cantidad Utilizada(en gr)</th>
                    </tr>
                </thead>
                <tbody>
                    {productosDisponibles.map((p) => (
                        <tr key={p.idPM}>
                            <td>{p.producto.descripcion}</td>
                            <td>{p.marca.nombre}</td>
                            <td>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    placeholder="Ingresa cantidad"
                                    value={getCantidad(p.idPM)}
                                    onChange={(e) => handleCantidadChange(p.idPM, e.target.value)}
                                    className={isSelected(p.idPM) ? 'selected-input' : ''}
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