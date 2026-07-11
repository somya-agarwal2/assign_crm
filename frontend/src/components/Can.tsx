import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PermissionService, type Permission, type Role } from '../services/PermissionService';

interface CanProps {
  permission: Permission;
  children: React.ReactElement;
  fallback?: React.ReactNode;
}

export const Can: React.FC<CanProps> = ({ permission, children, fallback = null }) => {
  const { user } = useAuth();
  
  if (PermissionService.hasPermission(user?.role as Role, permission)) {
    return children;
  }

  // Elegant degradation: wrap the child in a disabled state with a tooltip
  if (fallback === 'disabled') {
    const childProps = children.props as any;
    return React.cloneElement(children, {
      disabled: true,
      style: { ...(childProps?.style || {}), opacity: 0.5, cursor: 'not-allowed' },
      title: "Insufficient permissions for this action"
    } as any);
  }

  // Default: completely hide
  return <>{fallback}</>;
};
