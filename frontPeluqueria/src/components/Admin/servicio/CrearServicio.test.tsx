import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import CrearServicio from './CrearServicio'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => <div {...props} />,
  },
}))

const fetchMock = vi.fn()
global.fetch = fetchMock as any

describe('CrearServicio', () => {
  beforeEach(() => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    })
  })

  test('muestra error si nombre o precio son inválidos', async () => {
  render(
    <MemoryRouter>
      <CrearServicio />
    </MemoryRouter>
  )

  const form = document.querySelector('form')!
  fireEvent.submit(form)

  expect(
    await screen.findByText(/obligatorios y válidos/i)
  ).toBeInTheDocument()
})

  test('envía el formulario correctamente', async () => {
    render(
      <MemoryRouter>
        <CrearServicio />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText(/Nombre del Servicio/i), {
      target: { value: 'Corte de pelo' },
    })

    fireEvent.change(screen.getByLabelText(/Precio/i), {
      target: { value: '1500' },
    })

    fireEvent.change(screen.getByLabelText(/Duración/i), {
      target: { value: '2' },
    })

    fireEvent.click(screen.getByRole('button', { name: /crear servicio/i }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })
  })
})

// para correr este test, pnpm vitest