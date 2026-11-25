# Evidencia de ejecución de los tests — Frontend

**Fecha de ejecución:** 15/11/2026 (unitario) y 25/11/2026 (end-to-end)
**Entorno:** Windows 11, Node.js 24.15.0, pnpm 10.10.0, Playwright con Chromium, backend y MySQL locales

## Resumen

| Tipo | Comando | Tests | Resultado |
|---|---|---|---|
| Unitario de componente | `pnpm test` | 2 | ✅ 2 pasan, 0 fallan |
| End-to-end | `pnpm e2e` | 1 | ✅ 1 pasa, 0 fallan |

## Qué prueba cada test

### Unitario de componente

Renderiza el componente aislado con Vitest y Testing Library. No necesita el backend: las llamadas
a la API se reemplazan por un mock.

| Archivo | Test | Qué verifica |
|---|---|---|
| `CrearServicio.test.tsx` | muestra error si nombre o precio son inválidos | Al enviar el formulario vacío, se muestra el mensaje de que el nombre y el precio son obligatorios. |
| `CrearServicio.test.tsx` | envía el formulario correctamente | Con nombre, precio y duración válidos, el formulario hace la llamada a la API. |

### End-to-end

Abre la aplicación real en un navegador con Playwright, contra el backend y la base de datos.
Necesita el backend levantado y un usuario `peluquero` con email `email1@gmail.com` y contraseña
`12345`.

| Archivo | Test | Qué verifica |
|---|---|---|
| `crear-servicio.spec.ts` | permitir crear un nuevo servicio | Un peluquero inicia sesión, completa el formulario de alta de servicio y, al guardarlo, la aplicación lo lleva al listado de servicios. |

## Salida de la ejecución

### Test unitario de componente

```
$ pnpm exec vitest run --reporter=verbose

 RUN  v4.1.5

 ✓ src/components/Admin/servicio/CrearServicio.test.tsx > CrearServicio > muestra error si nombre o precio son inválidos 44ms
 ✓ src/components/Admin/servicio/CrearServicio.test.tsx > CrearServicio > envía el formulario correctamente 71ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Duration  3.09s
```

### Test end-to-end

Con el backend levantado en `http://localhost:3000` (Playwright levanta el frontend con `pnpm dev`):

```
$ pnpm e2e --reporter=list

> front-peluqueria@0.0.0 e2e
> playwright test "--reporter=list"

Running 1 test using 1 worker

  ok 1 e2e\crear-servicio.spec.ts:3:1 › permitir crear un nuevo servicio (19.7s)

  1 passed (36.1s)
```
