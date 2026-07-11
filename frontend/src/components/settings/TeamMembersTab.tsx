import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config';
import { useAuth } from '../../contexts/AuthContext';

type Role = 'Admin' | 'Marketing Manager' | 'Analyst' | 'Viewer';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'Active' | 'Pending Invitation';
  isMe: boolean;
}

export default function TeamMembersTab() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{type: string, message: string} | null>(null);
  
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', password: '', role: 'Viewer' as Role });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removingMember, setRemovingMember] = useState<TeamMember | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const showToast = (message: string, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/workspaces/members`);
      setMembers(res.data);
    } catch (e: any) {
      console.error(e);
      showToast(e.response?.data?.error || 'Failed to load team members', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleInvite = async () => {
    if (!inviteForm.name || !inviteForm.email || !inviteForm.password) {
      showToast('Name, email, and password are required', 'error');
      return;
    }
    setIsInviting(true);
    try {
      const res = await axios.post(`${API_URL}/workspaces/members`, inviteForm);
      setMembers([...members, res.data]);
      setShowInviteModal(false);
      setInviteForm({ name: '', email: '', password: '', role: 'Viewer' });
      showToast('Member invited successfully');
    } catch (e: any) {
      console.error(e);
      showToast(e.response?.data?.error || 'Failed to invite member', 'error');
    } finally {
      setIsInviting(false);
    }
  };

  const handleEdit = async () => {
    if (!editingMember) return;
    setIsEditing(true);
    try {
      const res = await axios.put(`${API_URL}/workspaces/members/${editingMember.id}`, { role: editingMember.role });
      setMembers(members.map(m => m.id === editingMember.id ? res.data : m));
      setShowEditModal(false);
      showToast('Member role updated');
    } catch (e: any) {
      console.error(e);
      showToast(e.response?.data?.error || 'Failed to update member role', 'error');
    } finally {
      setIsEditing(false);
    }
  };

  const handleRemove = async () => {
    if (!removingMember) return;
    setIsRemoving(true);
    try {
      await axios.delete(`${API_URL}/workspaces/members/${removingMember.id}`);
      setMembers(members.filter(m => m.id !== removingMember.id));
      setShowRemoveModal(false);
      showToast('Member removed from workspace');
    } catch (e: any) {
      console.error(e);
      showToast(e.response?.data?.error || 'Failed to remove member', 'error');
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
      {toast && (
        <div style={{ position: 'absolute', top: '24px', right: '24px', background: toast.type === 'success' ? 'var(--accent-secondary)' : '#ef4444', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, animation: 'fadeIn 0.3s', zIndex: 10 }}>
          {toast.message}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>Team Members</h2>
        {isAdmin && <button className="btn btn-primary" onClick={() => setShowInviteModal(true)} style={{ padding: '8px 16px', fontSize: '13px' }}>Invite Member</button>}
      </div>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <th style={{ padding: '12px 0', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500 }}>Name</th>
            <th style={{ padding: '12px 0', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500 }}>Role</th>
            <th style={{ padding: '12px 0', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500 }}>Status</th>
            <th style={{ padding: '12px 0', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500, textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                <span className="spinner" style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite', marginRight: '8px', verticalAlign: 'middle' }} />
                Loading team members...
              </td>
            </tr>
          ) : members.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                No team members found.
              </td>
            </tr>
          ) : (
            members.map((member) => (
              <tr key={member.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <td style={{ padding: '16px 0', color: 'var(--text-primary)', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600 }}>
                    {member.name.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {member.name}
                      {member.isMe && <span style={{ background: 'rgba(0,194,122,0.1)', color: '#00C27A', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>You</span>}
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{member.email}</span>
                  </div>
                </td>
                <td style={{ padding: '16px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>{member.role}</td>
                <td style={{ padding: '16px 0', fontSize: '13px' }}>
                  {member.status === 'Active' ? (
                    <span style={{ color: '#00C27A', fontWeight: 500 }}>Active</span>
                  ) : (
                    <span style={{ color: '#f59e0b', fontWeight: 500 }}>Pending Invitation</span>
                  )}
                </td>
                <td style={{ padding: '16px 0', textAlign: 'right' }}>
                  {isAdmin && (
                    <button 
                      onClick={() => { setEditingMember(member); setShowEditModal(true); }}
                      style={{ background: 'transparent', border: 'none', color: 'var(--accent-secondary)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', marginRight: '16px' }}
                    >
                      Edit
                    </button>
                  )}
                  {isAdmin && !member.isMe && (
                    <button 
                      onClick={() => { setRemovingMember(member); setShowRemoveModal(true); }}
                      style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Invite Modal */}
      {showInviteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ padding: '24px', width: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)' }}>Invite Team Member</h3>
            <div className="input-field" style={{ display: 'flex', flexDirection: 'column', gap: '8px', border: 'none', padding: 0 }}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>Name</label>
              <input type="text" value={inviteForm.name} onChange={e => setInviteForm({...inviteForm, name: e.target.value})} style={{ padding: '10px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '14px' }} placeholder="Jane Doe" />
            </div>
            <div className="input-field" style={{ display: 'flex', flexDirection: 'column', gap: '8px', border: 'none', padding: 0 }}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>Email</label>
              <input type="email" value={inviteForm.email} onChange={e => setInviteForm({...inviteForm, email: e.target.value})} style={{ padding: '10px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '14px' }} placeholder="jane@example.com" />
            </div>
            <div className="input-field" style={{ display: 'flex', flexDirection: 'column', gap: '8px', border: 'none', padding: 0 }}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>Password</label>
              <input type="text" value={inviteForm.password} onChange={e => setInviteForm({...inviteForm, password: e.target.value})} style={{ padding: '10px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '14px' }} placeholder="Create initial password" />
            </div>
            <div className="input-field" style={{ display: 'flex', flexDirection: 'column', gap: '8px', border: 'none', padding: 0 }}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>Role</label>
              <select value={inviteForm.role} onChange={e => setInviteForm({...inviteForm, role: e.target.value as Role})} style={{ padding: '10px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '14px' }}>
                <option value="Admin">Admin</option>
                <option value="Campaign Manager">Campaign Manager</option>
                <option value="Analyst">Analyst</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button className="btn btn-secondary" onClick={() => setShowInviteModal(false)} style={{ padding: '8px 16px' }}>Cancel</button>
              <button className="btn btn-primary" onClick={handleInvite} disabled={isInviting} style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isInviting && <span className="spinner" style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />}
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingMember && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ padding: '24px', width: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)' }}>Edit Team Member</h3>
            <div className="input-field" style={{ display: 'flex', flexDirection: 'column', gap: '8px', border: 'none', padding: 0 }}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>Name</label>
              <input type="text" value={editingMember.name} disabled style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-secondary)', fontSize: '14px', cursor: 'not-allowed' }} />
            </div>
            <div className="input-field" style={{ display: 'flex', flexDirection: 'column', gap: '8px', border: 'none', padding: 0 }}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>Email</label>
              <input type="email" value={editingMember.email} disabled style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-secondary)', fontSize: '14px', cursor: 'not-allowed' }} />
            </div>
            <div className="input-field" style={{ display: 'flex', flexDirection: 'column', gap: '8px', border: 'none', padding: 0 }}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>Role</label>
              <select value={editingMember.role} onChange={e => setEditingMember({...editingMember, role: e.target.value as Role})} style={{ padding: '10px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '14px' }}>
                <option value="Admin">Admin</option>
                <option value="Campaign Manager">Campaign Manager</option>
                <option value="Analyst">Analyst</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button className="btn btn-secondary" onClick={() => setShowEditModal(false)} style={{ padding: '8px 16px' }}>Cancel</button>
              <button className="btn btn-primary" onClick={handleEdit} disabled={isEditing} style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isEditing && <span className="spinner" style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Modal */}
      {showRemoveModal && removingMember && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ padding: '24px', width: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)' }}>Remove Team Member?</h3>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <strong style={{ color: 'white' }}>{removingMember.name}</strong> will lose access to the workspace. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button className="btn btn-secondary" onClick={() => setShowRemoveModal(false)} style={{ padding: '8px 16px' }}>Cancel</button>
              <button className="btn btn-primary" onClick={handleRemove} disabled={isRemoving} style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isRemoving && <span className="spinner" style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />}
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
