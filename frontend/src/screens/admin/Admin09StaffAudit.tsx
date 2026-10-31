import React from 'react';
import { ShieldCheck, Lock, UserCheck, Clock } from 'lucide-react';

export const Admin09StaffAudit: React.FC = () => {
  const auditLogs = [
    { id: 'LOG-9921', actor: 'SuperAdmin (Hamza)', action: 'UPDATE_CONFIG', target: 'Room Countdown set to 3s', time: '10 mins ago', ip: '192.168.1.1' },
    { id: 'LOG-9920', actor: 'Mod_Elena', action: 'QUARANTINE_BAN', target: 'User MacroRacer99 banned for burst speed', time: '25 mins ago', ip: '10.0.4.88' },
    { id: 'LOG-9919', actor: 'ContentEditor_Dan', action: 'PUBLISH_PASSAGE', target: 'PSG-103 approved into race pool', time: '1 hour ago', ip: '10.0.2.14' },
    { id: 'LOG-9918', actor: 'SuperAdmin (Hamza)', action: 'CATALOG_PRICE_CHANGE', target: 'Golden Flash SKU price confirmed 1,800 coins', time: '3 hours ago', ip: '192.168.1.1' },
  ];

  const staffMembers = [
    { name: 'Hamza Khan', role: 'SuperAdministrator', mfa: true, lastLogin: 'Just now' },
    { name: 'Elena Rostova', role: 'Lead Moderator', mfa: true, lastLogin: '25 mins ago' },
    { name: 'Dan Thorne', role: 'Passage Content Editor', mfa: true, lastLogin: '1 hour ago' },
  ];

  return (
    <div className="admin-page-view">
      <div className="admin-page-header mb-4">
        <h2>Staff Access & Immutable Audit Logs (SRS FR-D07)</h2>
        <p className="text-secondary text-sm">Role-based access control (RBAC), multi-factor status, and tamper-evident administrative records.</p>
      </div>

      {/* Staff Table */}
      <div className="card mb-4">
        <h3 className="mb-3">Authorized Personnel</h3>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Staff Member</th>
              <th>RBAC Permission Group</th>
              <th>MFA Hardened</th>
              <th>Last Active</th>
            </tr>
          </thead>
          <tbody>
            {staffMembers.map((s, idx) => (
              <tr key={idx}>
                <td><strong>{s.name}</strong></td>
                <td><span className="badge badge-orange">{s.role}</span></td>
                <td>
                  <span className="text-green text-xs flex-center gap-1">
                    <ShieldCheck size={14} /> Hardware MFA Active
                  </span>
                </td>
                <td className="text-secondary text-sm">{s.lastLogin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Audit Log Table */}
      <div className="card">
        <h3 className="mb-3">Immutable Administrative Audit Trail</h3>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Log Event ID</th>
              <th>Operator</th>
              <th>Action Code</th>
              <th>Target & Payload</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id}>
                <td><code>{log.id}</code></td>
                <td><strong>{log.actor}</strong></td>
                <td><span className="badge badge-blue">{log.action}</span></td>
                <td className="text-sm">{log.target}</td>
                <td className="text-secondary text-xs">{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
