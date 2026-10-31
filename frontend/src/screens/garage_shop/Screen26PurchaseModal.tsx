import React, { useState } from 'react';
import { X, Coins, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { SvgCar } from '../../components/common/SvgCar';

interface Screen26PurchaseModalProps {
  item: {
    name: string;
    price: number;
    category: string;
    carId?: string;
    desc?: string;
  };
  userCoins: number;
  onClose: () => void;
  onConfirm: (cost: number) => void;
}

export const Screen26PurchaseModal: React.FC<Screen26PurchaseModalProps> = ({
  item,
  userCoins,
  onClose,
  onConfirm
}) => {
  const [success, setSuccess] = useState(false);
  const canAfford = userCoins >= item.price;
  const remainingCoins = userCoins - item.price;

  const handlePurchase = () => {
    if (!canAfford) return;
    setSuccess(true);
    setTimeout(() => {
      onConfirm(item.price);
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {success ? (
          <div className="modal-success-stage text-center py-4">
            <CheckCircle size={56} className="text-green mb-2" />
            <h2>Unlock Successful!</h2>
            <p className="text-secondary mt-1">
              <strong>{item.name}</strong> has been added to your garage fleet!
            </p>
            <div className="mt-4">
              <span className="badge badge-green">Ready to Equip in Garage</span>
            </div>
          </div>
        ) : (
          <div className="modal-body">
            <div className="text-center mb-3">
              <span className="badge badge-orange">Confirm Cosmetic Purchase</span>
              <h2 className="mt-2">{item.name}</h2>
              <span className={`badge badge-${item.category.toLowerCase()}`}>{item.category} Tier</span>
            </div>

            {/* Car Preview */}
            <div className="modal-car-preview card-cream text-center py-3">
              <SvgCar id={(item.carId as any) || 'starter'} size={180} />
            </div>

            {/* Price & Balance Calculation */}
            <div className="price-ledger-box mt-3">
              <div className="ledger-row">
                <span className="text-secondary">Current Balance:</span>
                <span className="font-bold">{userCoins.toLocaleString()} 🪙</span>
              </div>
              <div className="ledger-row">
                <span className="text-secondary">Item Price:</span>
                <span className="font-bold text-orange">- {item.price.toLocaleString()} 🪙</span>
              </div>
              <div className="ledger-divider" />
              <div className="ledger-row total">
                <span>Remaining Balance:</span>
                <span className={`font-bold ${canAfford ? 'text-green' : 'text-red'}`}>
                  {canAfford ? `${remainingCoins.toLocaleString()} 🪙` : 'Insufficient Coins'}
                </span>
              </div>
            </div>

            {/* Warning if cannot afford */}
            {!canAfford && (
              <div className="insufficient-warning card-cream mt-3 flex-center gap-2">
                <AlertTriangle size={18} className="text-orange" />
                <span className="text-xs">
                  You need {(item.price - userCoins).toLocaleString()} more coins. Race in Green Valley to earn more!
                </span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="modal-actions-row mt-4">
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              
              <button 
                className={`btn ${canAfford ? 'btn-primary' : 'btn-secondary'} btn-lg flex-1`}
                disabled={!canAfford}
                onClick={handlePurchase}
              >
                <Coins size={18} />
                <span>{canAfford ? 'Confirm Unlock' : 'Need More Coins'}</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
