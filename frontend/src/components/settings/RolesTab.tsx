import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import API_URL from '../../config';
import { PermissionService } from '../../services/PermissionService';

// The display names mapping to backend permission strings
const permissionMap: Record<string, string> = {
  'Create Campaigns': 'campaign.create',
  'Delete Campaigns': 'campaign.delete',
  'Manage Journeys': 'journey.edit',
  'View Analytics': 'ai.access',
  'Workspace Settings': 'workspace.manage'
};

type PermissionDisplay = keyof typeof permissionMap;
type RoleName = 'Admin' | 'Manager' | 'Analyst' | 'Viewer';

interface RoleMatrix {
  permission: string;
  roles: Record<RoleName, boolean>;
}

export default function RolesTab() {
  const [matrix, setMatrix] = useState<RoleMatrix[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const res = await axios.get(`${API_URL}/workspaces/permissions`);
      setMatrix(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const [toast, setToast] = useState<{type: string, message: string} | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const currentUserStr = localStorage.getItem('user');
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
  const isAdmin = currentUser?.role === 'Admin';

  const togglePermission = (backendPermission: string, role: RoleName) => {
    if (!isAdmin) {
      setToast({ type: 'error', message: 'Only Admins can change permissions.' });
      return;
    }
    // Admin permissions cannot be removed in this mock
    if (role === 'Admin') return;
    
    setMatrix(prev => prev.map(row => {
      if (row.permission === backendPermission) {
        return {
          ...row,
          roles: { ...row.roles, [role]: !row.roles[role] }
        };
      }
      return row;
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.put(`${API_URL}/workspaces/permissions`, matrix);
      // Re-init local permissions so the admin sees the change immediately
      PermissionService.initPermissions();
      setHasChanges(false);
      setToast({ type: 'success', message: 'Permissions saved successfully.' });
    } catch (e) {
      setToast({ type: 'error', message: 'Failed to save permissions.' });
    }
    setIsSaving(false);
    setTimeout(() => setToast(null), 3000);
  };

  const roleHeaders: RoleName[] = ['Admin', 'Manager', 'Analyst', 'Viewer'];

  return (
    <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
      {toast && (
        <div style={{ position: 'absolute', top: '24px', right: '24px', background: toast.type === 'success' ? 'var(--accent-secondary)' : '#ef4444', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, animation: 'fadeIn 0.3s', zIndex: 10 }}>
          {toast.message}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>Roles & Permissions</h2>
        <button 
          className="btn btn-primary" 
          onClick={handleSave} 
          disabled={!hasChanges || isSaving || !isAdmin} 
          style={{ padding: '8px 16px', fontSize: '13px', opacity: (!hasChanges || !isAdmin) ? 0.5 : 1, cursor: (!hasChanges || !isAdmin) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {isSaving && <span className="spinner" style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />}
          Save Permissions
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-tertiary)' }}>
            <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, textAlign: 'left', borderRadius: '8px 0 0 0' }}>Permission</th>
            {roleHeaders.map(role => (
              <th key={role} style={{ padding: '12px', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, borderRadius: role === 'Viewer' ? '0 8px 0 0' : '0' }}>{role}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? <tr><td colSpan={5} style={{padding: '24px', textAlign: 'center'}}>Loading...</td></tr> : Object.entries(permissionMap).map(([displayName, backendPerm], idx) => {
            const row = matrix.find(r => r.permission === backendPerm) || { permission: backendPerm, roles: { Admin: true, Manager: false, Analyst: false, Viewer: false } };
            return (
            <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <td style={{ padding: '16px', color: 'var(--text-primary)', fontSize: '14px', textAlign: 'left', fontWeight: 500 }}>{displayName}</td>
              {roleHeaders.map(role => (
                <td 
                  key={role} 
                  style={{ padding: '16px', cursor: (role === 'Admin' || !isAdmin) ? 'not-allowed' : 'pointer' }}
                  onClick={() => togglePermission(backendPerm, role)}
                >
                  <div style={{ width: '32px', height: '32px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', transition: 'background 0.2s', background: role !== 'Admin' ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                    {row.roles[role] ? <CheckCircle2 size={18} color={role === 'Admin' ? 'var(--accent-secondary)' : '#00C27A'} /> : <span style={{ color: 'var(--text-tertiary)' }}>-</span>}
                  </div>
                </td>
              ))}
            </tr>
            );
          })}
        </tbody>
      </table>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
