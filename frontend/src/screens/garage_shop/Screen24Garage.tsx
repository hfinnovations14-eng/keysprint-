import * as React from 'react';
import { useState, useEffect } from 'react';
import { Warehouse, Check, Sparkles, SlidersHorizontal, Palette, Flame, Shield, Coins } from 'lucide-react';
import { SvgCar, CarModelId } from '../../components/common/SvgCar';
import { CARS_DATA, CarItem } from '../../data/carsData';
import { useAuth } from '../../context/AuthContext';
import { Screen26PurchaseModal } from './Screen26PurchaseModal';

interface Screen24GarageProps {
  onNavigate: (screenId: string) => void;
  equippedCarId?: CarModelId;
  onEquipCar?: (carId: CarModelId) => void;
}

export const Screen24Garage: React.FC<Screen24GarageProps> = ({ 
  onNavigate,
  equippedCarId = 'blaze',
  onEquipCar 
}: Screen24GarageProps) => {
  const { user, equipCar, purchaseCar } = useAuth();
  const [activeCategory, setActiveCategory] = useState<'All' | 'Common' | 'Rare' | 'Epic' | 'Legendary'>('All');
  
  const userEquipped = (user?.inventory?.find(i => i.isEquipped)?.itemId as CarModelId) || equippedCarId;
  const [currentEquipped, setCurrentEquipped] = useState<CarModelId>(userEquipped);
  const [selectedPreview, setSelectedPreview] = useState<CarItem>(
    CARS_DATA.find(c => c.id === userEquipped) || CARS_DATA[0]
  );
  const [selectedItemForPurchase, setSelectedItemForPurchase] = useState<CarItem | null>(null);

  useEffect(() => {
    if (user?.inventory) {
      const eq = user.inventory.find(i => i.isEquipped)?.itemId as CarModelId;
      if (eq) {
        setCurrentEquipped(eq);
      }
    }
  }, [user?.inventory]);

  const isCarOwned = (carId: string): boolean => {
    if (carId === 'starter') return true;
    return !!user?.inventory?.some(i => i.itemId === carId);
  };

  const filteredCars = activeCategory === 'All' 
    ? CARS_DATA 
    : CARS_DATA.filter(c => c.category === activeCategory);

  const handleEquip = async (car: CarItem) => {
    setCurrentEquipped(car.id);
    setSelectedPreview(car);
    if (onEquipCar) onEquipCar(car.id);
    await equipCar(car.id);
  };

  const handleConfirmPurchase = async (cost: number) => {
    if (!selectedItemForPurchase) return;
    await purchaseCar(selectedItemForPurchase.id, cost);
    setSelectedItemForPurchase(null);
  };

  const userCoins = user?.stats?.coins ?? 2450;

  return (
    <div className="screen-page garage-screen">
      <div className="content-wrapper">
        
        {/* HEADER & FILTER TABS (Matching Reference Image 07) */}
        <div className="garage-header-row mb-4">
          <div>
            <span className="badge badge-orange">Fleet Management</span>
            <h1 className="page-title">Garage & Vehicles</h1>
            <p className="page-subtitle">Customize and equip your race-day vehicles. Equal speed across all rides.</p>
          </div>

          <div className="garage-category-tabs">
            {(['All', 'Common', 'Rare', 'Epic', 'Legendary'] as const).map((cat) => (
              <button
                key={cat}
                className={`tab-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* SELECTED CAR INSPECTOR STAGE */}
        <div className="garage-inspector-card card card-cream mb-4">
          <div className="inspector-car-display">
            <SvgCar id={selectedPreview.id} size={280} animatedNitro={true} />
          </div>

          <div className="inspector-specs-panel">
            <div className="inspector-badge-row">
              <span className={`badge badge-${selectedPreview.category.toLowerCase()}`}>
                {selectedPreview.category} Tier
              </span>
              {currentEquipped === selectedPreview.id ? (
                <span className="badge badge-green flex-center gap-1">
                  <Check size={14} /> Currently Equipped
                </span>
              ) : isCarOwned(selectedPreview.id) ? (
                <span className="badge badge-blue">Owned in Garage</span>
              ) : (
                <span className="badge badge-gold">Available in Shop (🪙 {selectedPreview.price})</span>
              )}
            </div>

            <h2 className="inspector-car-title">{selectedPreview.name}</h2>
            <p className="inspector-car-desc">{selectedPreview.description}</p>

            <div className="inspector-ratings-row mt-3">
              <div className="spec-indicator">
                <span className="spec-label">Speed Tier</span>
                <span className="spec-value">{selectedPreview.topSpeedTier}</span>
              </div>
              <div className="spec-indicator">
                <span className="spec-label">Acceleration</span>
                <span className="spec-value">{selectedPreview.accelerationTier}</span>
              </div>
              <div className="spec-indicator">
                <span className="spec-label">Nitrous Trail</span>
                <span className="trail-dot" style={{ backgroundColor: selectedPreview.trailColor }} />
              </div>
            </div>

            <div className="inspector-actions-row mt-4">
              {currentEquipped === selectedPreview.id ? (
                <button className="btn btn-secondary" disabled>
                  <Check size={16} />
                  <span>Equipped as Active Racer</span>
                </button>
              ) : isCarOwned(selectedPreview.id) ? (
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => handleEquip(selectedPreview)}
                >
                  <Check size={18} />
                  <span>Equip This Car</span>
                </button>
              ) : (
                <button 
                  className="btn btn-gold btn-lg"
                  onClick={() => setSelectedItemForPurchase(selectedPreview)}
                >
                  <Coins size={18} />
                  <span>Unlock in Shop (🪙 {selectedPreview.price})</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* CARS INVENTORY GRID (Matching Reference Image 07) */}
        <div className="garage-grid">
          {filteredCars.map((car) => {
            const isEquipped = currentEquipped === car.id;
            const isSelected = selectedPreview.id === car.id;
            const owned = isCarOwned(car.id);

            return (
              <div 
                key={car.id} 
                className={`garage-car-card card card-interactive ${isSelected ? 'active-inspected' : ''}`}
                onClick={() => setSelectedPreview(car)}
              >
                <div className="card-top-tags">
                  <span className={`badge badge-${car.category.toLowerCase()}`}>{car.category}</span>
                  {isEquipped && (
                    <span className="equipped-pill">Equipped</span>
                  )}
                  {!isEquipped && owned && (
                    <span className="badge badge-blue">Owned</span>
                  )}
                </div>

                <div className="car-svg-container">
                  <SvgCar id={car.id} size={150} />
                </div>

                <div className="car-card-body">
                  <h4>{car.name}</h4>
                  <div className="car-meta-line">
                    <span>Speed: <strong>{car.topSpeedTier}</strong></span>
                    <span>Accel: <strong>{car.accelerationTier}</strong></span>
                  </div>

                  <div className="card-action-btn-row mt-3">
                    {isEquipped ? (
                      <span className="status-equipped-text">✓ Active Ride</span>
                    ) : owned ? (
                      <button 
                        className="btn btn-primary btn-sm full-width"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEquip(car);
                        }}
                      >
                        Equip
                      </button>
                    ) : (
                      <button 
                        className="btn btn-outline btn-sm full-width"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItemForPurchase(car);
                        }}
                      >
                        🪙 {car.price}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* PURCHASE CONFIRMATION MODAL IF UNLOCKED FROM GARAGE */}
        {selectedItemForPurchase && (
          <Screen26PurchaseModal
            item={{
              name: selectedItemForPurchase.name,
              price: selectedItemForPurchase.price,
              category: selectedItemForPurchase.category,
              carId: selectedItemForPurchase.id,
              desc: selectedItemForPurchase.description
            }}
            userCoins={userCoins}
            onClose={() => setSelectedItemForPurchase(null)}
            onConfirm={handleConfirmPurchase}
          />
        )}

      </div>
    </div>
  );
};
