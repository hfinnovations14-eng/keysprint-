// Unit & Integration Tests for KeySprint Phase 3: Garage, Inventory, Car Selection & Economy
import test from 'node:test';
import assert from 'node:assert/strict';

// Authoritative Catalog Model (Mirroring userController.ts ITEM_CATALOG)
export const ITEM_CATALOG = {
  // Vehicles
  starter: { id: 'starter', name: 'Starter Car', price: 0, itemType: 'car', category: 'Common' },
  blaze: { id: 'blaze', name: 'Blaze Runner', price: 1200, itemType: 'car', category: 'Rare' },
  golden: { id: 'golden', name: 'Golden Flash', price: 1800, itemType: 'car', category: 'Epic' },
  neon: { id: 'neon', name: 'Neon Rider', price: 2000, itemType: 'car', category: 'Epic' },
  shadow: { id: 'shadow', name: 'Shadow X', price: 2500, itemType: 'car', category: 'Legendary' },
  ice: { id: 'ice', name: 'Ice Drift', price: 1400, itemType: 'car', category: 'Rare' },
  forest: { id: 'forest', name: 'Forest Beast', price: 1500, itemType: 'car', category: 'Rare' },
  rose: { id: 'rose', name: 'Rose Racer', price: 1900, itemType: 'car', category: 'Epic' },
  retro: { id: 'retro', name: 'Retro Classic', price: 2200, itemType: 'car', category: 'Epic' },
  jeep: { id: 'jeep', name: 'Jeep Pioneer', price: 1600, itemType: 'car', category: 'Common' },

  // Nitro Trails
  'trail-nitro-cyan': { id: 'trail-nitro-cyan', name: 'Frostbite Vapor Trail', price: 600, itemType: 'trail', category: 'Rare' },
  'trail-solar-gold': { id: 'trail-solar-gold', name: 'Hypernova Golden Flare', price: 900, itemType: 'trail', category: 'Epic' },
  'trail-void-purple': { id: 'trail-void-purple', name: 'Singularity Drift Smoke', price: 1200, itemType: 'trail', category: 'Legendary' },

  // Special Bundles
  'bundle-racing-legend': {
    id: 'bundle-racing-legend',
    name: 'Racing Legend Pack (Bundle)',
    price: 3500,
    itemType: 'bundle',
    category: 'Legendary',
    bundledItems: [
      { itemId: 'blaze', itemType: 'car' },
      { itemId: 'golden', itemType: 'car' },
      { itemId: 'shadow', itemType: 'car' },
      { itemId: 'trail-void-purple', itemType: 'trail' }
    ]
  }
};

/**
 * Simulates server-side purchaseItem business logic
 */
export function simulatePurchaseItem(userId, body, userStats, userInventory) {
  const { itemId, cost: clientCost } = body;

  if (!itemId || typeof itemId !== 'string') {
    return { status: 400, error: 'Valid itemId required' };
  }

  const catalogItem = ITEM_CATALOG[itemId];
  if (!catalogItem) {
    return { status: 404, error: `Item '${itemId}' not found in catalog` };
  }

  // Security Check: Authoritative price from catalog ALWAYS overrides client-supplied cost
  const authoritativePrice = catalogItem.price;

  // Balance Check
  if (userStats.coins < authoritativePrice) {
    return { status: 400, error: 'Insufficient KeySprint coins' };
  }

  // Ownership Check for single items
  if (catalogItem.itemType !== 'bundle') {
    const alreadyOwned = userInventory.some(i => i.itemId === itemId);
    if (alreadyOwned) {
      return { status: 400, error: 'Item is already owned' };
    }
  } else if (catalogItem.bundledItems) {
    // Check if user already owns everything in the bundle
    const ownedCount = userInventory.filter(i => 
      catalogItem.bundledItems.some(b => b.itemId === i.itemId)
    ).length;
    if (ownedCount === catalogItem.bundledItems.length) {
      return { status: 400, error: 'Item is already owned' };
    }
  }

  // Atomic deduction
  const updatedCoins = userStats.coins - authoritativePrice;
  const newInventory = [...userInventory];

  if (catalogItem.itemType === 'bundle') {
    for (const b of catalogItem.bundledItems) {
      if (!newInventory.some(i => i.itemId === b.itemId)) {
        newInventory.push({ itemId: b.itemId, itemType: b.itemType, isEquipped: false });
      }
    }
  } else {
    newInventory.push({ itemId, itemType: catalogItem.itemType, isEquipped: false });
  }

  return {
    status: 200,
    message: 'Purchase successful',
    coins: updatedCoins,
    inventory: newInventory
  };
}

/**
 * Simulates server-side equipItem business logic with starter reconciliation
 */
export function simulateEquipItem(userId, body, userInventory) {
  const { itemId, itemType = 'car' } = body;

  if (!itemId || typeof itemId !== 'string') {
    return { status: 400, error: 'Valid itemId required' };
  }

  let inventory = [...userInventory];
  let item = inventory.find(i => i.itemId === itemId);

  // Free starter car auto-reconciliation
  if (!item) {
    if (itemId === 'starter') {
      item = { itemId: 'starter', itemType: 'car', isEquipped: true };
      inventory.push(item);
    } else {
      return { status: 400, error: 'You do not own this vehicle' };
    }
  }

  if (item.itemType !== itemType) {
    return { status: 400, error: 'Item cannot be equipped in this slot' };
  }

  // Un-equip previous and equip target
  inventory = inventory.map(i => {
    if (i.itemType === itemType) {
      return { ...i, isEquipped: i.itemId === itemId };
    }
    return i;
  });

  return {
    status: 200,
    message: 'Item equipped successfully',
    itemId,
    itemType,
    inventory
  };
}

// ----------------------------------------------------------------------
// Tests: 1. Authoritative Catalog & Price Tampering Security
// ----------------------------------------------------------------------

test('Security: Catalog prices are authoritative; client price tampering is rejected', () => {
  const stats = { coins: 1000 };
  const inventory = [{ itemId: 'starter', itemType: 'car', isEquipped: true }];

  // Malicious client attempts to buy 'blaze' (costs 1200) for 0 coins
  const resTamperZero = simulatePurchaseItem('user_1', { itemId: 'blaze', cost: 0 }, stats, inventory);
  assert.equal(resTamperZero.status, 400);
  assert.equal(resTamperZero.error, 'Insufficient KeySprint coins');

  // Malicious client attempts to send negative cost to mint coins
  const resTamperNeg = simulatePurchaseItem('user_1', { itemId: 'blaze', cost: -5000 }, stats, inventory);
  assert.equal(resTamperNeg.status, 400);
  assert.equal(resTamperNeg.error, 'Insufficient KeySprint coins');
});

test('Security: Non-existent item IDs and invalid inputs return 404/400', () => {
  const stats = { coins: 10000 };
  const inventory = [];

  const resNotFound = simulatePurchaseItem('user_1', { itemId: 'super_hacked_car_99' }, stats, inventory);
  assert.equal(resNotFound.status, 404);
  assert.match(resNotFound.error, /not found in catalog/);

  const resEmpty = simulatePurchaseItem('user_1', {}, stats, inventory);
  assert.equal(resEmpty.status, 400);
});

// ----------------------------------------------------------------------
// Tests: 2. Purchases & Wallet Integrity
// ----------------------------------------------------------------------

test('Shop Purchases: Successfully deducts exact catalog price and grants inventory', () => {
  const stats = { coins: 3000 };
  const inventory = [{ itemId: 'starter', itemType: 'car', isEquipped: true }];

  // Purchase 'golden' (costs 1800)
  const res = simulatePurchaseItem('user_1', { itemId: 'golden' }, stats, inventory);
  assert.equal(res.status, 200);
  assert.equal(res.coins, 1200); // 3000 - 1800 = 1200
  assert.equal(res.inventory.length, 2);
  assert.ok(res.inventory.some(i => i.itemId === 'golden' && i.itemType === 'car'));
});

test('Shop Purchases: Rejects purchase when user balance is insufficient', () => {
  const stats = { coins: 500 }; // Needs 1800 for 'golden'
  const inventory = [{ itemId: 'starter', itemType: 'car', isEquipped: true }];

  const res = simulatePurchaseItem('user_1', { itemId: 'golden' }, stats, inventory);
  assert.equal(res.status, 400);
  assert.equal(res.error, 'Insufficient KeySprint coins');
});

test('Shop Purchases: Rejects duplicate purchase of already owned item', () => {
  const stats = { coins: 5000 };
  const inventory = [{ itemId: 'blaze', itemType: 'car', isEquipped: true }];

  const res = simulatePurchaseItem('user_1', { itemId: 'blaze' }, stats, inventory);
  assert.equal(res.status, 400);
  assert.equal(res.error, 'Item is already owned');
});

test('Shop Purchases: Bundle purchase grants all unowned bundled items atomically', () => {
  const stats = { coins: 5000 };
  // User already owns 'blaze', but not 'golden', 'shadow', or 'trail-void-purple'
  const inventory = [{ itemId: 'blaze', itemType: 'car', isEquipped: true }];

  const res = simulatePurchaseItem('user_1', { itemId: 'bundle-racing-legend' }, stats, inventory);
  assert.equal(res.status, 200);
  assert.equal(res.coins, 1500); // 5000 - 3500 = 1500
  assert.ok(res.inventory.some(i => i.itemId === 'golden'));
  assert.ok(res.inventory.some(i => i.itemId === 'shadow'));
  assert.ok(res.inventory.some(i => i.itemId === 'trail-void-purple'));
});

test('Shop Purchases: Trail purchase correctly registers as trail itemType', () => {
  const stats = { coins: 1000 };
  const inventory = [];

  const res = simulatePurchaseItem('user_1', { itemId: 'trail-nitro-cyan' }, stats, inventory);
  assert.equal(res.status, 200);
  assert.equal(res.coins, 400); // 1000 - 600 = 400
  const trailItem = res.inventory.find(i => i.itemId === 'trail-nitro-cyan');
  assert.ok(trailItem);
  assert.equal(trailItem.itemType, 'trail');
});

// ----------------------------------------------------------------------
// Tests: 3. Garage Car Selection & Starter Reconciliation
// ----------------------------------------------------------------------

test('Equip Logic: Successfully equips owned car and un-equips previous car', () => {
  const inventory = [
    { itemId: 'blaze', itemType: 'car', isEquipped: true },
    { itemId: 'golden', itemType: 'car', isEquipped: false }
  ];

  const res = simulateEquipItem('user_1', { itemId: 'golden', itemType: 'car' }, inventory);
  assert.equal(res.status, 200);
  assert.equal(res.itemId, 'golden');

  const golden = res.inventory.find(i => i.itemId === 'golden');
  const blaze = res.inventory.find(i => i.itemId === 'blaze');
  assert.equal(golden.isEquipped, true);
  assert.equal(blaze.isEquipped, false);
});

test('Equip Logic: Auto-reconciles free starter car for users who do not have it in DB', () => {
  // Registered user seeded with only 'blaze'
  const inventory = [
    { itemId: 'blaze', itemType: 'car', isEquipped: true }
  ];

  // User attempts to equip 'starter'
  const res = simulateEquipItem('user_1', { itemId: 'starter', itemType: 'car' }, inventory);
  assert.equal(res.status, 200);
  assert.equal(res.itemId, 'starter');

  const starter = res.inventory.find(i => i.itemId === 'starter');
  const blaze = res.inventory.find(i => i.itemId === 'blaze');
  assert.ok(starter, 'Starter car should be auto-reconciled');
  assert.equal(starter.isEquipped, true);
  assert.equal(blaze.isEquipped, false);
});

test('Equip Logic: Rejects attempt to equip unowned vehicle', () => {
  const inventory = [
    { itemId: 'starter', itemType: 'car', isEquipped: true }
  ];

  const res = simulateEquipItem('user_1', { itemId: 'shadow', itemType: 'car' }, inventory);
  assert.equal(res.status, 400);
  assert.equal(res.error, 'You do not own this vehicle');
});

test('Equip Logic: Rejects equipping item into mismatched slot type', () => {
  const inventory = [
    { itemId: 'trail-nitro-cyan', itemType: 'trail', isEquipped: false }
  ];

  // Attempting to equip a trail as a 'car'
  const res = simulateEquipItem('user_1', { itemId: 'trail-nitro-cyan', itemType: 'car' }, inventory);
  assert.equal(res.status, 400);
  assert.equal(res.error, 'Item cannot be equipped in this slot');
});

