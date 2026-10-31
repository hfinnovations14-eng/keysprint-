import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Coins, ChevronRight, Check, Zap, Flame } from 'lucide-react';
import { SvgCar, CarModelId } from '../../components/common/SvgCar';
import { Screen26PurchaseModal } from './Screen26PurchaseModal';

interface Screen25ShopProps {
  onNavigate: (screenId: string) => void;
  coins?: number;
  onPurchaseItem?: (cost: number) => void;
}

export const Screen25Shop: React.FC<Screen25ShopProps> = ({ 
  onNavigate,
  coins = 2450,
  onPurchaseItem 
}) => {
  const [activeTab, setActiveTab] = useState<'Cars' | 'Wheels' | 'Trails' | 'Effects' | 'Bundles'>('Cars');
  const [selectedItemForPurchase, setSelectedItemForPurchase] = useState<any | null>(null);

  const shopCars = [
    { id: 'starter', name: 'Thunder X', price: 1200, category: 'Rare', carId: 'starter', desc: 'Electric blue aerodynamic chassis with high-intensity headlights.' },
    { id: 'ice', name: 'Sky Racer', price: 1500, category: 'Rare', carId: 'ice', desc: 'Frost cyan body tuned for sharp drift responsiveness.' },
    { id: 'shadow', name: 'Phantom', price: 1800, category: 'Epic', carId: 'shadow', desc: 'Stealth black exterior with crimson underglow.' },
    { id: 'blaze', name: 'Lava Speed', price: 2000, category: 'Epic', carId: 'blaze', desc: 'Fiery red track monster with dual racing stripes.' },
  ];

  const handleOpenPurchase = (item: any) => {
    setSelectedItemForPurchase(item);
  };

  return (
    <div className="screen-page shop-screen">
      <div className="content-wrapper">
        
        {/* HEADER & BALANCE */}
        <div className="shop-header-row mb-4">
          <div>
            <span className="badge badge-orange">Cosmetic Showroom</span>
            <h1 className="page-title">KeySprint Shop</h1>
            <p className="page-subtitle">Spend virtual coins earned by racing. No real-money transactions.</p>
          </div>

          <div className="shop-balance-badge card-cream">
            <Coins size={22} className="text-gold" />
            <div>
              <span className="balance-label">Your Coin Balance</span>
              <span className="balance-amount">{coins.toLocaleString()} 🪙</span>
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
              Unlock 3 Legendary Vehicles (Thunder, Blaze, Golden Flash) + Exclusive Ultraviolet Trails!
            </p>
            <div className="bundle-cta-row mt-3">
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => handleOpenPurchase({
                  name: 'Racing Legend Pack (Bundle)',
                  price: 3500,
                  category: 'Legendary',
                  carId: 'golden',
                  desc: 'Includes 3 top tier cartoon cars and special stadium trail effects.'
                })}
              >
                <span>Get Bundle • 🪙 3,500</span>
              </button>
            </div>
          </div>
        </div>

        {/* FEATURED CARS (Matching Reference Image 08) */}
        <div className="shop-featured-section">
          <div className="section-header-row mb-3">
            <div>
              <span className="badge badge-orange">Individual Vehicles</span>
              <h2>Featured Cars</h2>
            </div>
            <button className="link-bold flex-center gap-1">
              <span>View All</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="shop-cars-grid">
            {shopCars.map((item) => (
              <div key={item.id} className="shop-item-card card">
                <div className="card-top-tags">
                  <span className={`badge badge-${item.category.toLowerCase()}`}>{item.category}</span>
                </div>

                <div className="shop-item-car">
                  <SvgCar id={item.carId as any} size={150} />
                </div>

                <div className="shop-item-body">
                  <h4>{item.name}</h4>
                  <p className="shop-item-desc text-xs text-secondary">{item.desc}</p>
                  
                  <div className="shop-item-footer mt-3">
                    <div className="price-tag">
                      <Coins size={16} className="text-gold" />
                      <span>{item.price.toLocaleString()}</span>
                    </div>

                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleOpenPurchase(item)}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PURCHASE CONFIRMATION MODAL */}
        {selectedItemForPurchase && (
          <Screen26PurchaseModal
            item={selectedItemForPurchase}
            userCoins={coins}
            onClose={() => setSelectedItemForPurchase(null)}
            onConfirm={(cost) => {
              if (onPurchaseItem) onPurchaseItem(cost);
              setSelectedItemForPurchase(null);
            }}
          />
        )}

      </div>
    </div>
  );
};
