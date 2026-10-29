import React, { useState } from 'react';
import { Search, ShieldAlert, CheckCircle, Ban, RotateCcw, Filter, Eye } from 'lucide-react';

export const Admin02UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const users = [
    { id: 'usr_101', name: 'AlexPro', email: 'alex@example.com', country: 'US', level: 12, wpm: 142, status: 'Active', verified: true },
    { id: 'usr_102', name: 'TypeMaster', email: 'master@berlin.de', country: 'DE', level: 18, wpm: 175, status: 'Active', verified: true },
    { id: 'usr_103', name: 'MacroRacer99', email: 'cheater@tempmail.io', country: 'RU', level: 6, wpm: 218, status: 'Flagged', verified: false },
    { id: 'usr_104', name: 'SpeedyGirl', email: 'sarah@rogers.ca', country: 'CA', level: 14, wpm: 170, status: 'Active', verified: true },
    { id: 'usr_105', name: 'OffensiveDude', email: 'badname@mail.com', country: 'UK', level: 2, wpm: 88, status: 'Suspended', verified: false },
  ];

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page-view">
      <div className="admin-page-header mb-4">
        <h2>User & Driver Management (SRS FR-D02)</h2>
        <p className="text-secondary text-sm">Search registered drivers, inspect accounts, verify country identity, or apply sanctions.</p>
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
        <div className="races-table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Driver Identity</th>
                <th>Country</th>
                <th>Level</th>
                <th>Best WPM</th>
                <th>Status</th>
                <th>Email Verification</th>
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
                  <td>{u.country}</td>
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
                      <span className="text-muted text-xs">Unverified</span>
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
                        <button className="btn btn-secondary btn-sm text-green">Restore</button>
                      ) : (
                        <button className="btn btn-outline btn-sm text-red">Suspend</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="modal-backdrop" onClick={() => setSelectedUser(null)}>
          <div className="modal-dialog card" onClick={(e) => e.stopPropagation()}>
            <span className="badge badge-orange">Driver Audit Inspector</span>
            <h2 className="mt-2">{selectedUser.name} ({selectedUser.id})</h2>
            <div className="audit-details-list card-cream mt-3">
              <div className="audit-row"><span>Email:</span> <strong>{selectedUser.email}</strong></div>
              <div className="audit-row"><span>Verified Peak WPM:</span> <strong>{selectedUser.wpm}</strong></div>
              <div className="audit-row"><span>Current Status:</span> <strong>{selectedUser.status}</strong></div>
              <div className="audit-row"><span>Country Code:</span> <strong>{selectedUser.country}</strong></div>
            </div>
            <div className="mt-4 flex-center gap-2">
              <button className="btn btn-primary btn-sm" onClick={() => setSelectedUser(null)}>Close</button>
              <button className="btn btn-outline btn-sm text-red">Sanction Account</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
