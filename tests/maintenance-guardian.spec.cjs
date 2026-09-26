<<<<<<< HEAD
const { test, expect } = require('@playwright/test');

const URL = 'http://localhost:3000/';

test.describe('Maintenance Guardian V1 - Core Tests', () => {

  test('01 - Dashboard loads correctly', async ({ page }) => {
    await page.goto(URL);

    await expect(
      page.getByRole('banner').getByText('Maintenance Guardian')
    ).toBeVisible();
    await expect(page.getByText('TOTAL ÉQUIPEMENTS')).toBeVisible();
    await expect(page.getByText('EFFECTIF / COLLABORATEURS')).toBeVisible();
    await expect(page.getByText('TAUX DE CONFORMITÉ GLOBAL')).toBeVisible();
  });

  test('02 - Equipment section opens', async ({ page }) => {
    await page.goto(URL);

    await page.getByRole('button', {
      name: 'Équipements & Métrologie'
    }).click();

    await expect(
      page.getByText('Mesureur d’épaisseur ultrasonique 38DL Plus').first()
    ).toBeVisible();
  });

  test('03 - Equipment details open', async ({ page }) => {
    await page.goto(URL);

    await page.getByRole('button', {
      name: 'Équipements & Métrologie'
    }).click();

    await page.getByText(
      'Mesureur d’épaisseur ultrasonique 38DL Plus'
    ).first().click();

    await expect(page.getByRole('button', {
      name: 'Modifier'
    })).toBeVisible();

    await expect(page.getByRole('button', {
      name: 'Supprimer'
    })).toBeVisible();

    await expect(page.getByText('Historique Étalonnages & Inspections'))
      .toBeVisible();

    await expect(page.getByText('Historique Maintenances'))
      .toBeVisible();
  });

  test('04 - Employee section opens', async ({ page }) => {
    await page.goto(URL);

    await page.getByRole('button', {
      name: 'Collaborateurs & Habilitations'
    }).click();

    await expect(page.getByText('Jean-Pierre Laurent')).toBeVisible();
    await expect(page.getByText('Sophie Marchand')).toBeVisible();
    await expect(page.getByText('Alexandre Dumas')).toBeVisible();
  });

  test('05 - Alerts section opens', async ({ page }) => {
    await page.goto(URL);

    await page.getByRole('complementary').getByRole('button', {
      name: 'Alertes & Échéances'
    }).click();

    await expect(page.getByText('Échu / En retard').first())
      .toBeVisible();

    await expect(page.getByText('Échéance < 30j').first())
      .toBeVisible();

    await expect(page.getByText('Échéance < 90j').first())
      .toBeVisible();
  });

  test('06 - Add equipment and persistence', async ({ page }) => {
    await page.goto(URL);

    await page.getByRole('button', {
      name: 'Ajouter un équipement'
    }).click();

    await page.getByRole('textbox', {
      name: "ex: Mesureur d'épaisseur 38DL"
    }).fill('TEST-AUTOMATED-EQUIPMENT');

    await page.getByRole('textbox', {
      name: 'ex: EQ-CND-'
    }).fill('AUTO-001');

    await page.getByRole('textbox', {
      name: 'ex: CND-US-38DL'
    }).fill('AUTO-SERIAL');

    await page.getByRole('textbox', {
      name: 'ex: Evident / Olympus, Fluke'
    }).fill('TEST');

    await page.getByRole('textbox', {
      name: 'ex: 38DL Plus High-Precision'
    }).fill('AUTO-MODEL');

    await page.getByRole('textbox', {
      name: 'ex: 38DL-'
    }).fill('AUTO-001');

    await page.locator('input[type="date"]').nth(1)
      .fill('2027-09-15');

    await page.getByRole('textbox', {
      name: 'ex: Apave, Bureau Veritas,'
    }).fill('AUTO-ORG');

    await page.locator('input[type="date"]').nth(2)
      .fill('2026-09-15');

    await page.locator('input[type="date"]').nth(3)
      .fill('2027-09-15');

    await page.getByRole('textbox', {
      name: 'ex: FDV-2024-CND-'
    }).fill('AUTO-FICHE');

    await page.getByRole('textbox', {
      name: 'Accessoires inclus,'
    }).fill('AUTO');

    await page.getByRole('button', {
      name: 'Enregistrer'
    }).click();

    await page.getByRole('button', {
      name: 'Équipements & Métrologie'
    }).click();

    await expect(
      page.getByText('TEST-AUTOMATED-EQUIPMENT')
    ).toBeVisible();

    await page.reload();

    await page.getByRole('button', {
      name: 'Équipements & Métrologie'
    }).click();

    await expect(
      page.getByText('TEST-AUTOMATED-EQUIPMENT')
    ).toBeVisible();
  });

=======
const { test, expect } = require('@playwright/test');

const URL = 'http://localhost:3000/';

test.describe('Maintenance Guardian V1 - Core Tests', () => {

  test('01 - Dashboard loads correctly', async ({ page }) => {
    await page.goto(URL);

    await expect(
      page.getByRole('banner').getByText('Maintenance Guardian')
    ).toBeVisible();
    await expect(page.getByText('TOTAL ÉQUIPEMENTS')).toBeVisible();
    await expect(page.getByText('EFFECTIF / COLLABORATEURS')).toBeVisible();
    await expect(page.getByText('TAUX DE CONFORMITÉ GLOBAL')).toBeVisible();
  });

  test('02 - Equipment section opens', async ({ page }) => {
    await page.goto(URL);

    await page.getByRole('button', {
      name: 'Équipements & Métrologie'
    }).click();

    await expect(
      page.getByText('Mesureur d’épaisseur ultrasonique 38DL Plus').first()
    ).toBeVisible();
  });

  test('03 - Equipment details open', async ({ page }) => {
    await page.goto(URL);

    await page.getByRole('button', {
      name: 'Équipements & Métrologie'
    }).click();

    await page.getByText(
      'Mesureur d’épaisseur ultrasonique 38DL Plus'
    ).first().click();

    await expect(page.getByRole('button', {
      name: 'Modifier'
    })).toBeVisible();

    await expect(page.getByRole('button', {
      name: 'Supprimer'
    })).toBeVisible();

    await expect(page.getByText('Historique Étalonnages & Inspections'))
      .toBeVisible();

    await expect(page.getByText('Historique Maintenances'))
      .toBeVisible();
  });

  test('04 - Employee section opens', async ({ page }) => {
    await page.goto(URL);

    await page.getByRole('button', {
      name: 'Collaborateurs & Habilitations'
    }).click();

    await expect(page.getByText('Jean-Pierre Laurent')).toBeVisible();
    await expect(page.getByText('Sophie Marchand')).toBeVisible();
    await expect(page.getByText('Alexandre Dumas')).toBeVisible();
  });

  test('05 - Alerts section opens', async ({ page }) => {
    await page.goto(URL);

    await page.getByRole('complementary').getByRole('button', {
      name: 'Alertes & Échéances'
    }).click();

    await expect(page.getByText('Échu / En retard').first())
      .toBeVisible();

    await expect(page.getByText('Échéance < 30j').first())
      .toBeVisible();

    await expect(page.getByText('Échéance < 90j').first())
      .toBeVisible();
  });

  test('06 - Add equipment and persistence', async ({ page }) => {
    await page.goto(URL);

    await page.getByRole('button', {
      name: 'Ajouter un équipement'
    }).click();

    await page.getByRole('textbox', {
      name: "ex: Mesureur d'épaisseur 38DL"
    }).fill('TEST-AUTOMATED-EQUIPMENT');

    await page.getByRole('textbox', {
      name: 'ex: EQ-CND-'
    }).fill('AUTO-001');

    await page.getByRole('textbox', {
      name: 'ex: CND-US-38DL'
    }).fill('AUTO-SERIAL');

    await page.getByRole('textbox', {
      name: 'ex: Evident / Olympus, Fluke'
    }).fill('TEST');

    await page.getByRole('textbox', {
      name: 'ex: 38DL Plus High-Precision'
    }).fill('AUTO-MODEL');

    await page.getByRole('textbox', {
      name: 'ex: 38DL-'
    }).fill('AUTO-001');

    await page.locator('input[type="date"]').nth(1)
      .fill('2027-09-15');

    await page.getByRole('textbox', {
      name: 'ex: Apave, Bureau Veritas,'
    }).fill('AUTO-ORG');

    await page.locator('input[type="date"]').nth(2)
      .fill('2026-09-15');

    await page.locator('input[type="date"]').nth(3)
      .fill('2027-09-15');

    await page.getByRole('textbox', {
      name: 'ex: FDV-2024-CND-'
    }).fill('AUTO-FICHE');

    await page.getByRole('textbox', {
      name: 'Accessoires inclus,'
    }).fill('AUTO');

    await page.getByRole('button', {
      name: 'Enregistrer'
    }).click();

    await page.getByRole('button', {
      name: 'Équipements & Métrologie'
    }).click();

    await expect(
      page.getByText('TEST-AUTOMATED-EQUIPMENT')
    ).toBeVisible();

    await page.reload();

    await page.getByRole('button', {
      name: 'Équipements & Métrologie'
    }).click();

    await expect(
      page.getByText('TEST-AUTOMATED-EQUIPMENT')
    ).toBeVisible();
  });

>>>>>>> 50d1aa0bd2c3351527141f5b149600c77539cc3c
});