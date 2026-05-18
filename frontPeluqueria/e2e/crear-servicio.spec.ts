import { test, expect } from '@playwright/test';

test('permitir crear un nuevo servicio', async ({ page }) => {
  await page.goto('http://localhost:5173/auth'); 
  await page.getByPlaceholder('Email').fill('email1@gmail.com'); 
  await page.getByPlaceholder('Contraseña').fill('12345');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(page).toHaveURL('http://localhost:5173/admin'); 
  await page.goto('http://localhost:5173/servicio/crear');
  await page.getByLabel('Nombre del Servicio').fill('Corte Clásico');
  await page.getByLabel('Descripción (Opcional)').fill('Un corte clásico con navaja');
  await page.locator('#cantTurnos').fill('2');
  await page.locator('#precio').fill('5000');
  const durationText = page.locator('small.text-muted');
  await expect(durationText).toContainText('1 h 30 min');
  await page.getByLabel('Requiere Tono').check();
  await page.getByRole('button', { name: 'Crear Servicio' }).click();
  await expect(page).toHaveURL('http://localhost:5173/servicios', { timeout:10000});
});


// para correr crear una terminal y ejecutar pnpm dev, y en otra terminal ejecutar pnpm e2e

