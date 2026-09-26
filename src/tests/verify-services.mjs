/**
 * Service Layer Unit Tests (simulated without browser)
 * Tests CRUD operations logic in isolation
 */

// Simulate minimal localStorage
const store = {};
const localStorage = {
  getItem: (key) => store[key] ?? null,
  setItem: (key, val) => { store[key] = val; },
  removeItem: (key) => { delete store[key]; },
  get length() { return Object.keys(store).length; },
  key: (i) => Object.keys(store)[i] || null,
};
global.localStorage = localStorage;

// --- Inline minimal implementations ---
const PREFIX = 'mg_v1_';
const DEFAULT_COMPANY_ID = 'default-company';

const storage = {
  get(key, defaultValue) {
    try {
      const item = localStorage.getItem(`${PREFIX}${key}`);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch { return defaultValue; }
  },
  set(key, value) {
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
  },
};

function generateId(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
}

// Equipment service simulation
const equipmentService = {
  getAll() {
    return storage.get('equipment', []).filter(eq => eq.companyId === DEFAULT_COMPANY_ID);
  },
  getById(id) {
    return storage.get('equipment', []).find(eq => eq.id === id);
  },
  create(data) {
    const all = storage.get('equipment', []);
    const now = new Date().toISOString();
    const newItem = { ...data, id: generateId('eq'), companyId: DEFAULT_COMPANY_ID, createdAt: now, updatedAt: now };
    all.unshift(newItem);
    storage.set('equipment', all);
    return newItem;
  },
  update(id, updates) {
    const all = storage.get('equipment', []);
    const index = all.findIndex(eq => eq.id === id);
    if (index === -1) throw new Error(`Not found: ${id}`);
    const updated = { ...all[index], ...updates, updatedAt: new Date().toISOString() };
    all[index] = updated;
    storage.set('equipment', all);
    return updated;
  },
  delete(id) {
    const all = storage.get('equipment', []);
    const filtered = all.filter(eq => eq.id !== id);
    if (filtered.length !== all.length) {
      storage.set('equipment', filtered);
      return true;
    }
    return false;
  },
};

let passed = 0; let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.log(`❌ FAIL: ${name} - ${err.message}`);
    failed++;
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'Assertion failed');
}

console.log('\n========== MAINTENANCE GUARDIAN SERVICE LAYER TESTS ==========\n');

// 1. Initial state
test('Equipment list starts empty', () => {
  assert(equipmentService.getAll().length === 0, 'Should be empty');
});

// 2. Create equipment
let created;
test('Equipment can be created', () => {
  created = equipmentService.create({
    name: 'Multimètre Fluke 87V',
    category: 'Électricité',
    assetId: 'EQ-TEST-001',
    manufacturer: 'Fluke',
    model: '87V',
    serialNumber: 'SN-001',
    location: 'Atelier Principal',
    availability: 'IN_SERVICE',
    nextCalibrationDate: '2027-01-15',
  });
  assert(created.id, 'Should have an ID');
  assert(created.name === 'Multimètre Fluke 87V', 'Should have the correct name');
});

// 3. Read all
test('Equipment can be retrieved', () => {
  const all = equipmentService.getAll();
  assert(all.length === 1, `Should have 1 item, got ${all.length}`);
  assert(all[0].assetId === 'EQ-TEST-001', 'Should match asset ID');
});

// 4. Get by ID
test('Equipment can be fetched by ID', () => {
  const item = equipmentService.getById(created.id);
  assert(item !== undefined, 'Should find the item');
  assert(item.serialNumber === 'SN-001', 'Should have the correct serial number');
});

// 5. Update
test('Equipment can be updated', () => {
  const updated = equipmentService.update(created.id, { location: 'Atelier CND' });
  assert(updated.location === 'Atelier CND', 'Should have updated location');
  const fetched = equipmentService.getById(created.id);
  assert(fetched.location === 'Atelier CND', 'Should persist updated location');
});

// 6. Create second item
let created2;
test('Multiple equipment can be created', () => {
  created2 = equipmentService.create({
    name: 'Pince multimètre 376',
    category: 'Électricité',
    assetId: 'EQ-TEST-002',
    manufacturer: 'Fluke',
    model: '376 FC',
    serialNumber: 'SN-002',
    location: 'Atelier Électrique',
    availability: 'IN_SERVICE',
    nextCalibrationDate: '2025-06-01',
  });
  const all = equipmentService.getAll();
  assert(all.length === 2, `Should have 2 items, got ${all.length}`);
});

// 7. Delete
test('Equipment can be deleted', () => {
  const result = equipmentService.delete(created2.id);
  assert(result === true, 'Should return true on delete');
  const all = equipmentService.getAll();
  assert(all.length === 1, `Should have 1 item after delete, got ${all.length}`);
});

// 8. Delete non-existent
test('Deleting non-existent ID returns false', () => {
  const result = equipmentService.delete('non_existent_id_xyz');
  assert(result === false, 'Should return false');
});

// 9. Data persists across service calls (simulated)
test('Data survives multiple reads (persistence simulation)', () => {
  const first = equipmentService.getAll();
  const second = equipmentService.getAll();
  assert(first.length === second.length, 'Both reads should return same count');
  assert(first[0].id === second[0].id, 'Both reads should return same IDs');
});

// 10. Update syncs to storage
test('Update is reflected in subsequent reads', () => {
  equipmentService.update(created.id, { notes: 'Testé et conforme' });
  const fetched = equipmentService.getById(created.id);
  assert(fetched.notes === 'Testé et conforme', 'Notes should be updated');
  assert(fetched.name === 'Multimètre Fluke 87V', 'Name should be unchanged');
});

console.log('\n========== RESULTS ==========');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📊 Total: ${passed + failed}`);
if (failed === 0) {
  console.log('\n🎉 ALL SERVICE TESTS PASSED!\n');
}
