import * as React from 'react';
import { useState } from 'react';
import { X, Coins, CheckCircle, AlertTriangle, Sparkles, Loader2 } from 'lucide-react';
import { SvgCar, CarModelId } from '../../components/common/SvgCar';

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
  onConfirm: (cost: number) => Promise<void> | void;
}

export const Screen26PurchaseModal: React.FC<Screen26PurchaseModalProps> = ({
  item,
  userCoins,
  onClose,
  onConfirm
}: Screen26PurchaseModalProps) => {
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canAfford = userCoins >= item.price;
  const remainingCoins = userCoins - item.price;

  const handlePurchase = async () => {
    if (!canAfford || isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await onConfirm(item.price);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Transaction failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} disabled={isSubmitting}>
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
              <SvgCar id={(item.carId as CarModelId) || 'starter'} size={180} />
            </div>

            {/* Error Message if Any */}
            {errorMessage && (
              <div className="insufficient-warning card-cream mt-3 flex-center gap-2 text-red">
                <AlertTriangle size={18} />
                <span className="text-xs">{errorMessage}</span>
              </div>
            )}

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
                  You need {(item.price - userCoins).toLocaleString()} more coins. Race to earn podium bounties!
                </span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="modal-actions-row mt-4">
              <button className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </button>
              
              <button 
                className={`btn ${canAfford ? 'btn-primary' : 'btn-secondary'} btn-lg flex-1`}
                disabled={!canAfford || isSubmitting}
                onClick={handlePurchase}
              >
                {isSubmitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Coins size={18} />
                )}
                <span>{isSubmitting ? 'Processing...' : canAfford ? 'Confirm Unlock' : 'Need More Coins'}</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
