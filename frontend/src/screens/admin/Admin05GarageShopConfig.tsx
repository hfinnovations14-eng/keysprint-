import React, { useState } from 'react';
import { Warehouse, Plus, Edit2, Coins, Check } from 'lucide-react';
import { CARS_DATA, CarItem } from '../../data/carsData';
import { SvgCar } from '../../components/common/SvgCar';

export const Admin05GarageShopConfig: React.FC = () => {
  const [catalog, setCatalog] = useState<CarItem[]>(CARS_DATA);

  return (
    <div className="admin-page-view">
      <div className="section-header-row mb-4">
        <div>
          <h2>Vehicle Catalog & Shop SKUs (SRS FR-D05)</h2>
          <p className="text-secondary text-sm">Manage vehicle models, virtual currency pricing, rarity classifications, and cosmetic assets.</p>
        </div>

        <button className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>Add Vehicle SKU</span>
        </button>
      </div>

      <div className="card">
        <div className="races-table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Vehicle Model</th>
                <th>Category Tier</th>
                <th>Coin Price</th>
                <th>Speed / Accel Tiers</th>
                <th>Cosmetics Only Check</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {catalog.map((car) => (
                <tr key={car.id}>
                  <td>
                    <div className="flex-center gap-2">
                      <SvgCar id={car.id} size={50} />
                      <div>
                        <strong>{car.name}</strong>
                        <div className="text-xs text-secondary font-mono">id: {car.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${car.category.toLowerCase()}`}>
                      {car.category}
                    </span>
                  </td>
                  <td>
                    <strong>{car.price === 0 ? 'Free Starter' : `🪙 ${car.price.toLocaleString()}`}</strong>
                  </td>
                  <td>
                    <span className="text-xs">Speed: {car.topSpeedTier} • Acc: {car.accelerationTier}</span>
                  </td>
                  <td>
                    <span className="badge badge-green flex-center gap-1">
                      <Check size={12} /> Strictly Cosmetic
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-blue">Active in Shop</span>
                  </td>
                  <td>
                    <button className="btn btn-outline btn-sm">Edit Price</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
