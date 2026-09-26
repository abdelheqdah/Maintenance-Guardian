/**
 * Maintenance Guardian - Date Status Logic Verification
 * Run with: node src/tests/verify-status-logic.mjs
 */

function normalizeDate(dateInput) {
  if (typeof dateInput === 'string') {
    const parts = dateInput.split('T')[0].split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return new Date(year, month, day, 0, 0, 0, 0);
    }
  }
  return new Date(dateInput.getFullYear(), dateInput.getMonth(), dateInput.getDate(), 0, 0, 0, 0);
}

function getDaysRemaining(targetDateInput) {
  if (!targetDateInput) return 9999;
  const target = normalizeDate(targetDateInput);
  const ref = normalizeDate(new Date());
  const diffMs = target.getTime() - ref.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

function calculateComplianceStatus(dueDateInput) {
  if (!dueDateInput) return 'VALID';
  const daysRemaining = getDaysRemaining(dueDateInput);
  
  if (daysRemaining < 0) return 'OVERDUE';
  if (daysRemaining <= 30) return 'DUE_30';
  if (daysRemaining <= 90) return 'DUE_90';
  return 'VALID';
}

function getDateOffset(dayOffset) {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

let passed = 0;
let failed = 0;

function test(name, expected, actual) {
  if (expected === actual) {
    console.log(`✅ PASS: ${name} -> ${actual}`);
    passed++;
  } else {
    console.log(`❌ FAIL: ${name} -> Expected: ${expected}, Got: ${actual}`);
    failed++;
  }
}

console.log('\n========== MAINTENANCE GUARDIAN STATUS LOGIC TESTS ==========\n');

// Test 1: Past dates = OVERDUE
test('Past 1 day = OVERDUE', 'OVERDUE', calculateComplianceStatus(getDateOffset(-1)));
test('Past 15 days = OVERDUE', 'OVERDUE', calculateComplianceStatus(getDateOffset(-15)));
test('Past 380 days = OVERDUE', 'OVERDUE', calculateComplianceStatus(getDateOffset(-380)));

// Test 2: 0-30 days = DUE_30
test('Today (0 days) = DUE_30', 'DUE_30', calculateComplianceStatus(getDateOffset(0)));
test('12 days = DUE_30', 'DUE_30', calculateComplianceStatus(getDateOffset(12)));
test('24 days = DUE_30', 'DUE_30', calculateComplianceStatus(getDateOffset(24)));
test('30 days = DUE_30', 'DUE_30', calculateComplianceStatus(getDateOffset(30)));

// Test 3: 31-90 days = DUE_90
test('31 days = DUE_90', 'DUE_90', calculateComplianceStatus(getDateOffset(31)));
test('55 days = DUE_90', 'DUE_90', calculateComplianceStatus(getDateOffset(55)));
test('78 days = DUE_90', 'DUE_90', calculateComplianceStatus(getDateOffset(78)));
test('90 days = DUE_90', 'DUE_90', calculateComplianceStatus(getDateOffset(90)));

// Test 4: >90 days = VALID
test('91 days = VALID', 'VALID', calculateComplianceStatus(getDateOffset(91)));
test('180 days = VALID', 'VALID', calculateComplianceStatus(getDateOffset(180)));
test('365 days = VALID', 'VALID', calculateComplianceStatus(getDateOffset(365)));

// Test 5: Verify seed data statuses (approx offsets from seedData.ts)
console.log('\n--- Seed Data Verification ---');
test('EQ-CND-001 (cal -15 days) = OVERDUE', 'OVERDUE', calculateComplianceStatus(getDateOffset(-15)));
test('EQ-OPT-002 (cal -42 days) = OVERDUE', 'OVERDUE', calculateComplianceStatus(getDateOffset(-42)));
test('EQ-CND-003 (cal +12 days) = DUE_30', 'DUE_30', calculateComplianceStatus(getDateOffset(12)));
test('EQ-ELEC-004 (cal +24 days) = DUE_30', 'DUE_30', calculateComplianceStatus(getDateOffset(24)));
test('EQ-INST-005 (cal +55 days) = DUE_90', 'DUE_90', calculateComplianceStatus(getDateOffset(55)));
test('EQ-INST-006 (cal +78 days) = DUE_90', 'DUE_90', calculateComplianceStatus(getDateOffset(78)));
test('EQ-ELEC-007 (cal +180 days) = VALID', 'VALID', calculateComplianceStatus(getDateOffset(180)));
test('EQ-ELEC-008 (cal +240 days) = VALID', 'VALID', calculateComplianceStatus(getDateOffset(240)));

// Employee certs
test('EMP-001 (cert -18 days) = OVERDUE', 'OVERDUE', calculateComplianceStatus(getDateOffset(-18)));
test('EMP-002 (cert +14 days) = DUE_30', 'DUE_30', calculateComplianceStatus(getDateOffset(14)));
test('EMP-003 (cert +62 days) = DUE_90', 'DUE_90', calculateComplianceStatus(getDateOffset(62)));
test('EMP-004 (cert +290 days) = VALID', 'VALID', calculateComplianceStatus(getDateOffset(290)));
test('EMP-005 (cert +365 days) = VALID', 'VALID', calculateComplianceStatus(getDateOffset(365)));

// Test 6: undefined/null dates default to VALID
test('undefined date = VALID', 'VALID', calculateComplianceStatus(undefined));

console.log('\n========== RESULTS ==========');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📊 Total: ${passed + failed}`);
if (failed === 0) {
  console.log('\n🎉 ALL TESTS PASSED - Status logic is correct!\n');
} else {
  console.log('\n⚠️  Some tests failed - review logic.\n');
}
