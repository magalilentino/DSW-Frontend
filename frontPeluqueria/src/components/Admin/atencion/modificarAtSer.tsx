

import { motion } from "framer-motion";
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../../styles/Admin.css";






interface ProdMar {
    idPM: number;
    producto: {
        descripcion: string};
    marca: {
        nombre: string};
}

interface ProductoSeleccionado {
    idPM: number;
    cantidad: number; 
}


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

    
    
        
    const fetchMarcas = useCallback(async () => {
        try {
            const res = await fetch('http://localhost:3000/api/marca', { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            if (!res.ok) throw new Error("Fallo la carga de marcas.");
            const responseData = await res.json();
        
        
            const marcasArray = responseData.data || []; 
            
            if (Array.isArray(marcasArray)) {
                setMarcas(marcasArray); 
            } else {
                
                console.error("La propiedad 'data' de la API de marcas no es un array.");
                setMarcas([]);
            }

        } catch (err) {
            console.error(err);
        }
    }, [token]);
    
    
    const fetchCategorias = useCallback(async () => {
        try {
            const res = await fetch('http://localhost:3000/api/categoria', { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            if (!res.ok) throw new Error("Fallo la carga de categorías.");
             const responseData = await res.json();
        
            const categoriaArray = responseData.data || []; 
            
            if (Array.isArray(categoriaArray)) {
                setCategorias(categoriaArray); 
            } else {
                
                console.error("La propiedad 'data' de la API de categorias no es un array.");
                setCategorias([]);
            }

        } catch (err) {
            console.error(err);
        }
    }, [token]);

    
    
    const fetchProductos = useCallback(async () => {
        
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
        
    }, [filtroMarca, filtroCategoria, token]); 
    
    
    const fetchTonos = useCallback(async () => {
        try {
            const res = await fetch('http://localhost:3000/api/tono', { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            
            if (!res.ok) throw new Error("Fallo la carga de tonos disponibles.");
            const data = await res.json();
            
                        setTonosDisponibles(data.data || data); 

        } catch (err) {
            console.error(err);
            setError(prev => prev + " Error al cargar tonos."); 
        }
    }, [token]);

    const fetchAtencionId = async () => {
        try {
              const res = await fetch(`http://localhost:3000/api/atSer/${idAtSer}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Fallo la carga del AtSer.");
            const data = await res.json();
            
            if (data.idAtencion) {
                setIdAtencion(data.idAtencion.toString()); 
            } else {
                console.error("No se encontró idAtencion en la respuesta del AtSer.");
            }
        } catch (err) {
            console.error("Error al obtener el idAtencion:", err);
            
        }
    };

    
    useEffect(() => {
        setLoading(true);
        setError("");
        
        Promise.all([fetchProductos(), fetchTonos(), fetchAtencionId(), fetchMarcas(), fetchCategorias()])
            .catch(err => console.error("Error en Promise.all:", err))
            .finally(() => setLoading(false));
            
    }, [fetchProductos, fetchTonos, fetchMarcas, fetchCategorias]); 
    
    
        const isSelected = (idPM: number) => productosSeleccionados.some(p => p.idPM === idPM);
    
        const handleCantidadChange = (idProducto: number, cantidadStr: string) => {
        const cantidad = parseFloat(cantidadStr.replace(',', '.')); 
        const productoInfo = productosDisponibles.find(p => p.idPM === idProducto);

        if (!productoInfo) return;

        setProductosSeleccionados(prev => {
            const index = prev.findIndex(p => p.idPM === idProducto);

            if (cantidad >= 0 && !isNaN(cantidad)) {
                if (index > -1) {
                    
                    const newArray = [...prev];
                    newArray[index] = { ...newArray[index], cantidad };
                    return newArray;
                } else {
                    
                    return [...prev, {
                        idPM: idProducto,
                        cantidad: cantidad,
                    }];
                }
            } else {
                
                return prev.filter(p => p.idPM !== idProducto);
            }
        });
    };

    const handleTonoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        
        const idTono = value === "" ? null : parseInt(value, 10); 
        setTonoSeleccionadoId(idTono);
    };

    const handleBack = () => {
        if (idAtencion) {
            
            navigate(`/atencion/serviciosDeAtencion/${idAtencion}`);
        } else {
            alert("No se pudo determinar la Atención para regresar.");
            
        }
    };

    
    
    const handleSubmit = async () => {
        const productosAEnviar = productosSeleccionados.map(p => ({
            idPM: p.idPM,
            cantidad: p.cantidad
        }));
        
        if (productosAEnviar.length === 0) {
            alert("Debe seleccionar al menos un producto con cantidad.");
            return;
        }

        const bodyToSend = { 
            prodMars: productosAEnviar,
            idTono: tonoSeleccionadoId 
        };

        try {
            const response = await fetch(`http://localhost:3000/api/prodUt/registrarProdsUt/${idAtSer}`, { 
                method: 'PATCH', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(bodyToSend),
            });

            if (!response.ok) throw new Error('Error al guardar los productos utilizados y/o el tono.');
            
            alert('Detalles del servicio actualizados exitosamente.');
            navigate(-1);     
            
        } catch (error) {
            console.error(error);
            alert('Error al procesar el guardado');
        }
    };

    
    const getCantidad = (idPM: number) => {
        const item = productosSeleccionados.find(p => p.idPM === idPM);
        return item ? item.cantidad.toString() : '';
    };

    if (loading) return <p>Cargando productos...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
  <div className="admin-servicio my-4 container-fluid">
    <motion.div
      className="card p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Servicio Realizado {idAtSer}</h2>
        <button
          className="btn btn-secondary"
          onClick={handleBack}
          disabled={!idAtencion}
        >
          Volver
        </button>
      </div>

      {/* Filtros */}
      <div className="row mb-4">
        <div className="col-md-6 mb-2">
          <label className="form-label">Filtrar por Marca</label>
          <select
            value={filtroMarca}
            onChange={(e) => setFiltroMarca(e.target.value)}
            className="form-select"
          >
            <option value="">Todas las Marcas</option>
            {marcas.map((m) => (
              <option key={m.idMarca} value={m.idMarca.toString()}>
                {m.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6 mb-2">
          <label className="form-label">Filtrar por Categoría</label>
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="form-select"
          >
            <option value="">Todas las Categorías</option>
            {categorias.map((c) => (
              <option key={c.idCategoria} value={c.idCategoria.toString()}>
                {c.nombreCategoria}
              </option>
            ))}
          </select>
        </div>
      </div>

      
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Producto</th>
            <th>Marca</th>
            <th>Cantidad Utilizada (gr)</th>
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
                  step="0.1"
                  placeholder="Cantidad"
                  value={getCantidad(p.idPM)}
                  onChange={(e) => handleCantidadChange(p.idPM, e.target.value)}
                  className={`form-control ${isSelected(p.idPM) ? 'border-success' : ''}`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      
      <div className="mt-4">
        <label htmlFor="select-tono" className="form-label">
          Seleccionar Tono (Opcional)
        </label>
        <select
          id="select-tono"
          value={tonoSeleccionadoId === null ? "" : tonoSeleccionadoId.toString()}
          onChange={handleTonoChange}
          className="form-select"
        >
          <option value="">Ninguno</option>
          {tonosDisponibles.map((tono) => (
            <option key={tono.idTono} value={tono.idTono}>
              {tono.nombre}
            </option>
          ))}
        </select>
      </div>

      
      <div className="d-flex justify-content-end mt-4">
        <button className="btn btn-primary" onClick={handleSubmit}>
          Guardar Productos Utilizados
        </button>
      </div>
    </motion.div>
  </div>
);
};

export default ModificarAtSer;