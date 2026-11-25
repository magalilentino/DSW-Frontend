# Peluquería — Frontend

Aplicación web del sistema de gestión de una peluquería. Los clientes pueden sacar turnos y consultar
su historial; los peluqueros administran el catálogo, la agenda y las atenciones.

Este repositorio contiene solo el frontend. Se comunica por HTTP con la API del backend, que está en
[DSW-Backend](https://github.com/magalilentino/DSW-Backend). El código de la aplicación está en la
carpeta `frontPeluqueria/`.

La documentación del trabajo práctico (propuesta, documentación de la API, evidencia de tests y
demo en video) está en **[docs/README.md](docs/README.md)**.

## Tecnologías

| | |
|---|---|
| Lenguaje | TypeScript |
| Framework | React 19 + Vite |
| Ruteo | React Router |
| Estilos | Bootstrap 5 + Bootstrap Icons + CSS propio |
| Animaciones | Framer Motion |
| Autenticación | JWT emitido por el backend (`jwt-decode` para leer su vencimiento) |
| Tests unitarios | Vitest + Testing Library |
| Tests end-to-end | Playwright |

## Requisitos previos

- **Node.js 22**.
- **pnpm 10**. Si no lo tenés: `npm install -g pnpm`.
- **El backend corriendo** (por defecto en `http://localhost:3000`). Las instrucciones para levantarlo están en el
  [README del backend](https://github.com/magalilentino/DSW-Backend#readme).

## Instalación

```bash
git clone https://github.com/magalilentino/DSW-Frontend.git
cd DSW-Frontend/frontPeluqueria
pnpm install
```

Todos los comandos de las secciones siguientes se ejecutan dentro de `frontPeluqueria/`.

## Configuración

Copiar el archivo de ejemplo de variables de entorno:

```bash
cp .env.example .env
```

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `VITE_API_URL` | URL base de la API del backend, incluyendo `/api` y sin barra final. | `http://localhost:3000/api` |

Si el backend corre en la dirección por defecto, este paso se puede saltear. Para apuntar a un
backend deployado, cambiar el valor (por ejemplo `https://mi-backend.com/api`) y volver a levantar
la aplicación o volver a ejecutar `pnpm build`.

## Ejecución

Con el backend ya levantado:

```bash
pnpm dev
```

La aplicación queda disponible en **http://localhost:5173**.

Otros scripts:

| Comando | Qué hace |
|---|---|
| `pnpm dev` (o `pnpm start`) | Levanta el servidor de desarrollo con recarga automática. |
| `pnpm build` | Verifica los tipos y genera la versión de producción en `dist/`. |
| `pnpm preview` | Sirve localmente la versión generada por `pnpm build`. |
| `pnpm test` | Corre los tests unitarios. |
| `pnpm e2e` | Corre los tests end-to-end. |

## Uso

La aplicación tiene dos tipos de usuario. Al iniciar sesión, cada uno es dirigido a su sección y no
puede entrar a las páginas del otro.

| Rol | Páginas |
|---|---|
| Sin sesión | Inicio, servicios, nosotros y contacto, ingreso y registro. |
| `cliente` | Sacar un turno (`/reserve`) y su perfil con turnos pendientes e historial (`/perfil`). |
| `peluquero` | Panel con el resumen del día (`/admin`); administración de servicios, productos, categorías, marcas, tonos y fórmulas, y descuentos; gestión de atenciones; bloqueo de días en la agenda; alta de peluqueros. |

Cualquier persona puede registrarse desde la pantalla de ingreso, y queda como `cliente`. Los
peluqueros los da de alta otro peluquero desde el panel. Para probar la aplicación, el backend
incluye [datos de prueba](https://github.com/magalilentino/DSW-Backend#datos-de-prueba) con un
peluquero (`peluquero@peluqueria.com` / `peluquero123`) y un cliente (`cliente@peluqueria.com` /
`cliente123`).

La sesión dura 2 horas. Al vencer, la aplicación avisa y vuelve a la pantalla de ingreso.

## Tests

### Unitarios

```bash
pnpm test
```

Prueban el componente de alta de servicio
([`CrearServicio.test.tsx`](frontPeluqueria/src/components/Admin/servicio/CrearServicio.test.tsx)):
que muestre un error si faltan datos obligatorios y que envíe el formulario cuando los datos son
válidos. No necesitan el backend.

### End-to-end

Necesitan el backend levantado y un usuario `peluquero` con email `email1@gmail.com` y contraseña
`12345` en la base.

```bash
pnpm exec playwright install   # solo la primera vez: descarga los navegadores
pnpm e2e
```

Si el frontend no está corriendo, Playwright lo levanta solo. El test
(`e2e/crear-servicio.spec.ts`) inicia sesión como peluquero, crea un servicio y verifica que
aparezca en el listado. Se ejecuta con el navegador visible y en cámara lenta, para poder seguirlo.

El resultado de la última ejecución está en [docs/evidencia-tests.md](docs/evidencia-tests.md).

## Estructura

```
docs/                         Documentación del trabajo práctico
frontPeluqueria/
├── e2e/                      Tests end-to-end (Playwright)
├── public/                   Archivos estáticos
└── src/
    ├── App.tsx               Definición de rutas (públicas, de cliente y de peluquero)
    ├── main.tsx              Punto de entrada
    ├── pages/                Páginas principales (Home, Auth, Reserve, Perfil, Admin, ...)
    ├── components/
    │   ├── Admin/            Pantallas de administración, una carpeta por entidad
    │   ├── Auth/             Formularios de ingreso y registro
    │   ├── general/          Header, Footer, contexto de autenticación y rutas protegidas
    │   ├── home/             Secciones de la página de inicio
    │   └── reserve/          Pasos para sacar un turno
    ├── shared/
    │   ├── apiFetch.ts       Servicio para llamar a la API (agrega el token y maneja errores)
    │   └── config.ts         URL del backend, leída de VITE_API_URL
    ├── styles/               Hojas de estilo
    └── test/                 Configuración de los tests unitarios
```

## Integrantes

| Legajo | Nombre |
|---|---|
| 52234 | Corvi, Jerónimo |
| 52109 | Lentino, Magali |
| 52868 | Lupo, Valeria |
| 53413 | Moramarco, Elias |
