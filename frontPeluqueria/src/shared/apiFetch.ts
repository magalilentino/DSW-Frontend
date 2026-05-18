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

    if (res.status === 401 || res.status === 403) {
            localStorage.clear();
            alert("Tu sesión ha expirado o no tienes permisos. Por favor, vuelve a iniciar sesión.");
            window.location.href = "/auth?mode=login";  
            throw new Error("Sesión expirada");
        }

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.mensaje || "Error en la petición");
        }

        return res.json();
};
