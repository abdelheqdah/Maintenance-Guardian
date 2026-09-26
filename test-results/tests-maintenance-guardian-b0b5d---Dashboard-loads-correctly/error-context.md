# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\maintenance-guardian.spec.cjs >> Maintenance Guardian V1 - Core Tests >> 01 - Dashboard loads correctly
- Location: tests\maintenance-guardian.spec.cjs:7:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('banner').getByText('Maintenance Guardian')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('banner').getByText('Maintenance Guardian') with timeout 5000ms
  - waiting for getByRole('banner').getByText('Maintenance Guardian')

```

```yaml
- text: "[plugin:vite:react-babel] C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\src\\components\\equipment\\EquipmentList.tsx: Identifier 'Trash2' has already been declared. (14:2) 17 | Download, C:/Users/ELITEBOOK/Desktop/Maintenance Guardian/src/components/equipment/EquipmentList.tsx:14:2 12 | Edit2, 13 | Trash2, 14 | Trash2, | ^ 15 | Cpu, 16 | RotateCcw, at constructor (C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\@babel\\parser\\lib\\index.js:369:19) at TypeScriptParserMixin.raise (C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\@babel\\parser\\lib\\index.js:6620:19) at TypeScriptScopeHandler.declareName (C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\@babel\\parser\\lib\\index.js:4882:21) at TypeScriptParserMixin.declareNameFromIdentifier (C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\@babel\\parser\\lib\\index.js:7588:16) at TypeScriptParserMixin.checkIdentifier (C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\@babel\\parser\\lib\\index.js:7584:12) at TypeScriptParserMixin.checkLVal (C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\@babel\\parser\\lib\\index.js:7521:12) at TypeScriptParserMixin.finishImportSpecifier (C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\@babel\\parser\\lib\\index.js:14295:10) at TypeScriptParserMixin.parseImportSpecifier (C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\@babel\\parser\\lib\\index.js:14448:17) at TypeScriptParserMixin.parseImportSpecifier (C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\@babel\\parser\\lib\\index.js:10169:18) at TypeScriptParserMixin.parseNamedImportSpecifiers (C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\@babel\\parser\\lib\\index.js:14427:36) at TypeScriptParserMixin.parseImportSpecifiersAndAfter (C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\@babel\\parser\\lib\\index.js:14271:37) at TypeScriptParserMixin.parseImport (C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\@babel\\parser\\lib\\index.js:14264:17) at TypeScriptParserMixin.parseImport (C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\@babel\\parser\\lib\\index.js:9374:26) at TypeScriptParserMixin.parseStatementContent (C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\@babel\\parser\\lib\\index.js:12905:27) at TypeScriptParserMixin.parseStatementContent (C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\@babel\\parser\\lib\\index.js:9529:18) at TypeScriptParserMixin.parseStatementLike (C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\@babel\\parser\\lib\\index.js:12796:17) at TypeScriptParserMixin.parseModuleItem (C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\@babel\\parser\\lib\\index.js:12773:17) at TypeScriptParserMixin.parseBlockOrModuleBlockBody (C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\@babel\\parser\\lib\\index.js:13345:36) at TypeScriptParserMixin.parseBlockBody (C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\@babel\\parser\\lib\\index.js:13338:10) at TypeScriptParserMixin.parseProgram (C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\@babel\\parser\\lib\\index.js:12651:10) at TypeScriptParserMixin.parseTopLevel (C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\@babel\\parser\\lib\\index.js:12641:25) at TypeScriptParserMixin.parse (C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\@babel\\parser\\lib\\index.js:14517:25) at TypeScriptParserMixin.parse (C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\@babel\\parser\\lib\\index.js:10147:18) at parse (C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\@babel\\parser\\lib\\index.js:14551:38) at parser (C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\@babel\\core\\lib\\parser\\index.js:41:34) at parser.next (<anonymous>) at normalizeFile (C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\@babel\\core\\lib\\transformation\\normalize-file.js:51:37) at normalizeFile.next (<anonymous>) at run (C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\@babel\\core\\lib\\transformation\\index.js:22:50) at run.next (<anonymous>) at transform (C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\@babel\\core\\lib\\transform.js:22:33) at transform.next (<anonymous>) at step (C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\gensync\\index.js:261:32) at C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\gensync\\index.js:273:13 at async.call.result.err.err (C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\gensync\\index.js:223:11) at C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\gensync\\index.js:189:28 at C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\@babel\\core\\lib\\gensync-utils\\async.js:67:7 at C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\gensync\\index.js:113:33 at step (C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\gensync\\index.js:287:14) at C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\gensync\\index.js:273:13 at async.call.result.err.err (C:\\Users\\ELITEBOOK\\Desktop\\Maintenance Guardian\\node_modules\\gensync\\index.js:223:11 Click outside, press Esc key, or fix the code to dismiss. You can also disable this overlay by setting"
- code: server.hmr.overlay
- text: to
- code: "false"
- text: in
- code: vite.config.ts
- text: .
```

# Test source

```ts
  1   | const { test, expect } = require('@playwright/test');
  2   | 
  3   | const URL = 'http://localhost:3000/';
  4   | 
  5   | test.describe('Maintenance Guardian V1 - Core Tests', () => {
  6   | 
  7   |   test('01 - Dashboard loads correctly', async ({ page }) => {
  8   |     await page.goto(URL);
  9   | 
  10  |     await expect(
  11  |   page.getByRole('banner').getByText('Maintenance Guardian')
> 12  | ).toBeVisible();
      |   ^ Error: expect(locator).toBeVisible() failed
  13  |     await expect(page.getByText('TOTAL ÉQUIPEMENTS')).toBeVisible();
  14  |     await expect(page.getByText('EFFECTIF / COLLABORATEURS')).toBeVisible();
  15  |     await expect(page.getByText('TAUX DE CONFORMITÉ GLOBAL')).toBeVisible();
  16  |   });
  17  | 
  18  |   test('02 - Equipment section opens', async ({ page }) => {
  19  |     await page.goto(URL);
  20  | 
  21  |     await page.getByRole('button', {
  22  |       name: 'Équipements & Métrologie'
  23  |     }).click();
  24  | 
  25  |     await expect(
  26  |       page.getByText('Mesureur d’épaisseur ultrasonique 38DL Plus').first()
  27  |     ).toBeVisible();
  28  |   });
  29  | 
  30  |   test('03 - Equipment details open', async ({ page }) => {
  31  |     await page.goto(URL);
  32  | 
  33  |     await page.getByRole('button', {
  34  |       name: 'Équipements & Métrologie'
  35  |     }).click();
  36  | 
  37  |     await page.getByText(
  38  |       'Mesureur d’épaisseur ultrasonique 38DL Plus'
  39  |     ).first().click();
  40  | 
  41  |     await expect(page.getByRole('button', {
  42  |       name: 'Modifier'
  43  |     })).toBeVisible();
  44  | 
  45  |     await expect(page.getByRole('button', {
  46  |       name: 'Supprimer'
  47  |     })).toBeVisible();
  48  | 
  49  |     await expect(page.getByText('Historique Étalonnages & Inspections'))
  50  |       .toBeVisible();
  51  | 
  52  |     await expect(page.getByText('Historique Maintenances'))
  53  |       .toBeVisible();
  54  |   });
  55  | 
  56  |   test('04 - Employee section opens', async ({ page }) => {
  57  |     await page.goto(URL);
  58  | 
  59  |     await page.getByRole('button', {
  60  |       name: 'Collaborateurs & Habilitations'
  61  |     }).click();
  62  | 
  63  |     await expect(page.getByText('Jean-Pierre Laurent')).toBeVisible();
  64  |     await expect(page.getByText('Sophie Marchand')).toBeVisible();
  65  |     await expect(page.getByText('Alexandre Dumas')).toBeVisible();
  66  |   });
  67  | 
  68  |   test('05 - Alerts section opens', async ({ page }) => {
  69  |     await page.goto(URL);
  70  | 
  71  |     await page.getByRole('complementary').getByRole('button', {
  72  |   name: 'Alertes & Échéances'
  73  | }).click();
  74  | 
  75  |     await expect(page.getByText('Échu / En retard').first())
  76  |       .toBeVisible();
  77  | 
  78  |     await expect(page.getByText('Échéance < 30j').first())
  79  |       .toBeVisible();
  80  | 
  81  |     await expect(page.getByText('Échéance < 90j').first())
  82  |       .toBeVisible();
  83  |   });
  84  | 
  85  |   test('06 - Add equipment and persistence', async ({ page }) => {
  86  |     await page.goto(URL);
  87  | 
  88  |     await page.getByRole('button', {
  89  |       name: 'Ajouter un équipement'
  90  |     }).click();
  91  | 
  92  |     await page.getByRole('textbox', {
  93  |       name: "ex: Mesureur d'épaisseur 38DL"
  94  |     }).fill('TEST-AUTOMATED-EQUIPMENT');
  95  | 
  96  |     await page.getByRole('textbox', {
  97  |       name: 'ex: EQ-CND-'
  98  |     }).fill('AUTO-001');
  99  | 
  100 |     await page.getByRole('textbox', {
  101 |       name: 'ex: CND-US-38DL'
  102 |     }).fill('AUTO-SERIAL');
  103 | 
  104 |     await page.getByRole('textbox', {
  105 |       name: 'ex: Evident / Olympus, Fluke'
  106 |     }).fill('TEST');
  107 | 
  108 |     await page.getByRole('textbox', {
  109 |       name: 'ex: 38DL Plus High-Precision'
  110 |     }).fill('AUTO-MODEL');
  111 | 
  112 |     await page.getByRole('textbox', {
```