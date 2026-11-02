import * as React from 'react';
import { useState } from 'react';
import { ShoppingBag, Sparkles, Coins, ChevronRight, Check, Zap, Flame, ShieldCheck } from 'lucide-react';
import { SvgCar, CarModelId } from '../../components/common/SvgCar';
import { Screen26PurchaseModal } from './Screen26PurchaseModal';
import { CARS_DATA, CarItem } from '../../data/carsData';
import { useAuth } from '../../context/AuthContext';

interface Screen25ShopProps {
  onNavigate: (screenId: string) => void;
  coins?: number;
  onPurchaseItem?: (cost: number) => void;
}

export const Screen25Shop: React.FC<Screen25ShopProps> = ({ 
  onNavigate,
  coins: propCoins,
  onPurchaseItem 
}: Screen25ShopProps) => {
  const { user, purchaseCar, equipCar } = useAuth();
  const [activeTab, setActiveTab] = useState<'Cars' | 'Wheels' | 'Trails' | 'Effects' | 'Bundles'>('Cars');
  const [selectedItemForPurchase, setSelectedItemForPurchase] = useState<any | null>(null);

  const liveCoins = user?.stats?.coins ?? propCoins ?? 0;

  const isCarOwned = (carId: string) => {
    if (carId === 'starter') return true;
    return !!user?.inventory?.some(i => i.itemId === carId);
  };

  const isItemOwned = (itemId: string) => {
    return !!user?.inventory?.some(i => i.itemId === itemId);
  };

  const isCarEquipped = (carId: string) => {
    return !!user?.inventory?.some(i => i.itemId === carId && i.isEquipped);
  };

  const handleOpenPurchase = (item: any) => {
    setSelectedItemForPurchase(item);
  };

  const handleConfirmPurchase = async (cost: number) => {
    if (!selectedItemForPurchase) return;
    const itemId = selectedItemForPurchase.id || selectedItemForPurchase.carId;
    const itemType = selectedItemForPurchase.itemType || selectedItemForPurchase.type || 'car';
    await purchaseCar(itemId, cost, itemType);
    setSelectedItemForPurchase(null);
  };

  const cosmeticTrails = [
    { id: 'trail-nitro-cyan', name: 'Frostbite Vapor Trail', price: 600, category: 'Rare', type: 'trail', desc: 'Sub-zero cryo vapor streaming behind your rear spoilers.' },
    { id: 'trail-solar-gold', name: 'Hypernova Golden Flare', price: 900, category: 'Epic', type: 'trail', desc: 'Solar ionization particle burst tailored for championship sprint runs.' },
    { id: 'trail-void-purple', name: 'Singularity Drift Smoke', price: 1200, category: 'Legendary', type: 'trail', desc: 'Dimensional violet energy that pulsates with every keystroke combo.' }
  ];

  return (
    <div className="screen-page shop-screen">
      <div className="content-wrapper">
        
        {/* HEADER & BALANCE */}
        <div className="shop-header-row mb-4">
          <div>
            <span className="badge badge-orange">Cosmetic Showroom</span>
            <h1 className="page-title">KeySprint Shop</h1>
            <p className="page-subtitle">Spend virtual coins earned by racing. No real-money pay-to-win.</p>
          </div>

          <div className="shop-balance-badge card-cream">
            <Coins size={22} className="text-gold" />
            <div>
              <span className="balance-label">Your Coin Balance</span>
              <span className="balance-amount">{liveCoins.toLocaleString()} 🪙</span>
            </div>
          </div>
        </div>

        {/* SHOP TABS (Matching Reference Image 08) */}
        <div className="shop-tabs-row mb-4">
          <div className="tab-list">
            {(['Cars', 'Wheels', 'Trails', 'Effects', 'Bundles'] as const).map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* SPECIAL BUNDLE PROMO BANNER (Matching Reference Image 08) */}
        <div className="special-bundle-card mb-5">
          <img 
            src="/assets/shop_bundle.jpg" 
            alt="KeySprint Racing Legend Pack Special Bundle with 3 Sports Cars" 
            className="bundle-banner-bg"
          />
          <div className="bundle-content-overlay">
            <span className="bundle-pill">SPECIAL BUNDLE</span>
            <h2 className="bundle-title">Racing Legend Pack</h2>
            <p className="bundle-desc">
              Unlock 3 Legendary Vehicles (Blaze, Golden Flash, Shadow X) + Exclusive Ultraviolet Stadium Trails!
            </p>
            <div className="bundle-cta-row mt-3">
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => handleOpenPurchase({
                  id: 'bundle-racing-legend',
                  name: 'Racing Legend Pack (Bundle)',
                  price: 3500,
                  category: 'Legendary',
                  itemType: 'bundle',
                  carId: 'golden',
                  desc: 'Includes 3 top tier motorsport cars (Blaze, Golden Flash, Shadow X) and stadium trail effects.'
                })}
              >
                <span>Get Bundle • 🪙 3,500</span>
              </button>
            </div>
          </div>
        </div>

        {/* FEATURED CARS (Matching Reference Image 08) */}
        {activeTab === 'Cars' && (
          <div className="shop-featured-section">
            <div className="section-header-row mb-3">
              <div>
                <span className="badge badge-orange">Vehicle Fleet</span>
                <h2>Performance Sports Cars</h2>
              </div>
              <button 
                className="link-bold flex-center gap-1"
                onClick={() => onNavigate('screen-24')}
              >
                <span>Go to Garage</span>
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="shop-cars-grid">
              {CARS_DATA.map((item) => {
                const owned = isCarOwned(item.id);
                const equipped = isCarEquipped(item.id);

                return (
                  <div key={item.id} className="shop-item-card card">
                    <div className="card-top-tags">
                      <span className={`badge badge-${item.category.toLowerCase()}`}>{item.category}</span>
                      {equipped ? (
                        <span className="badge badge-green">Equipped</span>
                      ) : owned ? (
                        <span className="badge badge-blue">Owned</span>
                      ) : null}
                    </div>

                    <div className="shop-item-car">
                      <SvgCar id={item.id} size={150} />
                    </div>

                    <div className="shop-item-body">
                      <h4>{item.name}</h4>
                      <p className="shop-item-desc text-xs text-secondary">{item.description}</p>
                      
                      <div className="shop-item-footer mt-3">
                        <div className="price-tag">
                          <Coins size={16} className="text-gold" />
                          <span>{item.price === 0 ? 'Free Starter' : item.price.toLocaleString()}</span>
                        </div>

                        {equipped ? (
                          <span className="status-equipped-text">✓ Active Ride</span>
                        ) : owned ? (
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={() => equipCar(item.id)}
                          >
                            Equip Now
                          </button>
                        ) : (
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => handleOpenPurchase({
                              ...item,
                              carId: item.id,
                              desc: item.description
                            })}
                          >
                            Buy Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TRAILS / COSMETICS TAB */}
        {activeTab === 'Trails' && (
          <div className="shop-featured-section">
            <div className="section-header-row mb-3">
              <div>
                <span className="badge badge-orange">Exhaust Aerodynamics</span>
                <h2>Nitro Trails</h2>
              </div>
            </div>

            <div className="shop-cars-grid">
              {cosmeticTrails.map((item) => {
                const owned = isItemOwned(item.id);
                return (
                  <div key={item.id} className="shop-item-card card">
                    <div className="card-top-tags">
                      <span className={`badge badge-${item.category.toLowerCase()}`}>{item.category}</span>
                      {owned && <span className="badge badge-blue">Owned</span>}
                    </div>
                    <div className="shop-item-car flex-center py-4">
                      <Flame size={64} className="text-orange" />
                    </div>
                    <div className="shop-item-body">
                      <h4>{item.name}</h4>
                      <p className="shop-item-desc text-xs text-secondary">{item.desc}</p>
                      <div className="shop-item-footer mt-3">
                        <div className="price-tag">
                          <Coins size={16} className="text-gold" />
                          <span>{item.price.toLocaleString()}</span>
                        </div>
                        {owned ? (
                          <span className="status-equipped-text">✓ Owned</span>
                        ) : (
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => handleOpenPurchase({
                              id: item.id,
                              name: item.name,
                              price: item.price,
                              category: item.category,
                              desc: item.desc,
                              itemType: 'trail'
                            })}
                          >
                            Buy Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* OTHER TABS FALLBACK */}
        {(activeTab === 'Wheels' || activeTab === 'Effects' || activeTab === 'Bundles') && (
          <div className="card card-cream text-center py-5">
            <Sparkles size={48} className="text-gold mb-2 mx-auto" />
            <h3>Fresh Stock Arriving in Next Grand Prix Drop</h3>
            <p className="text-secondary max-w-md mx-auto mt-2">
              New aerodynamic wheel spokes, custom underglow neon patterns, and sound horns will be unlocked in Season 2.
            </p>
            <button 
              className="btn btn-primary mt-4"
              onClick={() => setActiveTab('Cars')}
            >
              Browse Available Cars
            </button>
          </div>
        )}

        {/* PURCHASE CONFIRMATION MODAL */}
        {selectedItemForPurchase && (
          <Screen26PurchaseModal
            item={selectedItemForPurchase}
            userCoins={liveCoins}
            onClose={() => setSelectedItemForPurchase(null)}
            onConfirm={handleConfirmPurchase}
          />
        )}

      </div>
    </div>
  );
};
