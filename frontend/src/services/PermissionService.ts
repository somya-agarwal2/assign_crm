export type Role = 'Admin' | 'Marketing Manager' | 'Marketing Executive' | 'Viewer';

export type Permission = 
  | 'campaign.create'
  | 'campaign.edit'
  | 'campaign.delete'
  | 'customer.create'
  | 'customer.edit'
  | 'customer.delete'
  | 'segment.create'
  | 'segment.edit'
  | 'segment.delete'
  | 'ai.access'
  | 'journey.edit'
  | 'workspace.manage';

// Dynamic Permissions Matrix
let RolePermissionsMatrix: any[] = [];

export class PermissionService {
  static async initPermissions() {
    try {
      const config = await import('../config');
      const API_URL = config.default;
      const axios = (await import('axios')).default;
      const res = await axios.get(`${API_URL}/workspaces/permissions`);
      if (res.data && Array.isArray(res.data)) {
        RolePermissionsMatrix = res.data;
      }
    } catch (e) {
      console.error("Failed to load dynamic permissions", e);
    }
  }

  static hasPermission(role: Role | undefined, permission: Permission): boolean {
    if (!role) return false;
    if (role === 'Admin') return true;
    
    // Check dynamic matrix
    if (RolePermissionsMatrix.length > 0) {
      const row = RolePermissionsMatrix.find(r => r.permission === permission);
      if (row && row.roles) {
        return !!row.roles[role];
      }
      return false;
    }

    // Default fallback
    return false;
  }
}
