export const apiFetch = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("token");
    const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
    };
    const res = await fetch(`http://localhost:3000/api${url}`, {
        ...options,
        headers,
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.mensaje || errorData.message || "Error en la petición");
    }

    return res.json();
};
