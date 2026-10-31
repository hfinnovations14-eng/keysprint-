import * as React from 'react';
import { useState, useEffect } from 'react';
import { Search, ShieldAlert, CheckCircle, Ban, RotateCcw, Filter, Eye, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export const Admin02UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAdminUsers();
      if (res.users) {
        const mapped = res.users.map((u: any) => ({
          id: u.id,
          name: u.profile?.nickname || 'Anonymous',
          email: u.email || 'Guest Session',
          country: u.profile?.countryCode || 'US',
          level: u.stats?.level || 1,
          wpm: u.stats?.verifiedBestWpm || 0,
          coins: u.stats?.coins || 0,
          inventoryCount: u.inventory?.length || 0,
          status: u.status ? u.status.charAt(0).toUpperCase() + u.status.slice(1) : 'Active',
          verified: u.isVerified,
          role: u.role
        }));
        setUsers(mapped);
      }
    } catch (err) {
      console.error('Failed to load admin users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user: any) => {
    const newStatus = user.status.toLowerCase() === 'suspended' ? 'active' : 'suspended';
    try {
      await api.updateUserStatus(user.id, newStatus);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1) } : u));
      if (selectedUser?.id === user.id) {
        setSelectedUser((prev: any) => ({ ...prev, status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1) }));
      }
    } catch (err) {
      console.error('Failed to update user status:', err);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page-view">
      <div className="section-header-row mb-4">
        <div>
          <h2>User & Driver Management (SRS FR-D02)</h2>
          <p className="text-secondary text-sm">Search registered drivers, inspect accounts, verify country identity, or apply sanctions.</p>
        </div>

        <button className="btn btn-outline btn-sm flex-center gap-1" onClick={fetchUsers}>
          <RotateCcw size={14} className={isLoading ? 'animate-spin' : ''} />
          <span>Refresh Users</span>
        </button>
      </div>

      <div className="admin-table-controls card mb-4">
        <div className="input-icon-wrap flex-1">
          <Search size={18} className="input-field-icon" />
          <input 
            type="text" 
            placeholder="Search driver by nickname, email, or account ID..."
            className="input-field with-icon"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        {isLoading ? (
          <div className="text-center py-5">
            <Loader2 size={36} className="animate-spin text-orange mx-auto mb-2" />
            <p className="text-secondary">Loading driver directory from database...</p>
          </div>
        ) : (
          <div className="races-table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Driver Identity</th>
                  <th>Country</th>
                  <th>Level</th>
                  <th>Best WPM</th>
                  <th>Status</th>
                  <th>Verification</th>
                  <th>Moderation Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <strong>{u.name}</strong>
                      <div className="text-xs text-secondary">{u.email}</div>
                    </td>
                    <td><span className="badge badge-secondary">{u.country}</span></td>
                    <td>Lv. {u.level}</td>
                    <td><strong>{u.wpm}</strong> WPM</td>
                    <td>
                      <span className={`badge ${u.status === 'Active' ? 'badge-green' : u.status === 'Flagged' ? 'badge-orange' : 'badge-red'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td>
                      {u.verified ? (
                        <span className="text-green text-xs flex-center gap-1"><CheckCircle size={14} /> Verified</span>
                      ) : (
                        <span className="text-secondary text-xs">Standard</span>
                      )}
                    </td>
                    <td>
                      <div className="table-actions flex-center gap-2">
                        <button 
                          className="btn btn-outline btn-sm"
                          onClick={() => setSelectedUser(u)}
                        >
                          Inspect
                        </button>
                        {u.status === 'Suspended' ? (
                          <button 
                            className="btn btn-secondary btn-sm text-green"
                            onClick={() => handleToggleStatus(u)}
                          >
                            Restore
                          </button>
                        ) : (
                          <button 
                            className="btn btn-outline btn-sm text-red"
                            onClick={() => handleToggleStatus(u)}
                          >
                            Suspend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="modal-backdrop" onClick={() => setSelectedUser(null)}>
          <div className="modal-dialog card" onClick={(e) => e.stopPropagation()}>
            <span className="badge badge-orange">Driver Audit Inspector</span>
            <h2 className="mt-2">{selectedUser.name}</h2>
            <div className="audit-details-list card-cream mt-3">
              <div className="audit-row"><span>Account UUID:</span> <code className="text-xs">{selectedUser.id}</code></div>
              <div className="audit-row"><span>Email Address:</span> <strong>{selectedUser.email}</strong></div>
              <div className="audit-row"><span>System Role:</span> <strong>{selectedUser.role}</strong></div>
              <div className="audit-row"><span>Driver Level:</span> <strong>Level {selectedUser.level}</strong></div>
              <div className="audit-row"><span>Verified Peak WPM:</span> <strong>{selectedUser.wpm} WPM</strong></div>
              <div className="audit-row"><span>Coin Balance:</span> <strong>{selectedUser.coins.toLocaleString()} 🪙</strong></div>
              <div className="audit-row"><span>Garage Inventory:</span> <strong>{selectedUser.inventoryCount} Vehicles</strong></div>
              <div className="audit-row"><span>Current Status:</span> <strong>{selectedUser.status}</strong></div>
            </div>
            <div className="mt-4 flex-center gap-2">
              <button className="btn btn-primary btn-sm flex-1" onClick={() => setSelectedUser(null)}>Close</button>
              <button 
                className={`btn btn-outline btn-sm ${selectedUser.status === 'Suspended' ? 'text-green' : 'text-red'}`}
                onClick={() => handleToggleStatus(selectedUser)}
              >
                {selectedUser.status === 'Suspended' ? 'Restore Account' : 'Suspend Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
