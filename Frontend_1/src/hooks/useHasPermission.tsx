import { useContext } from 'react';
import PermissionsContext from '../context/PermissionsProvider';

const useHasPermission = (permission: string) => {
  const permissionsContext = useContext(PermissionsContext);

  // Handle case when PermissionsContext is undefined
  if (!permissionsContext) {
    return false;
  }

  const { permissionsState } = permissionsContext;

  // Check if the permission exists in the user's permissions
  return permissionsState.permissions.includes(permission);
};

export default useHasPermission;
