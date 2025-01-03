// import { useContext } from 'react';
// import AuthContext from '../context/AuthProvider';

// export const useHasPermission = (permissionName: string) => {
//   const authContext = useContext(AuthContext);

//   if (!authContext) {
//     console.warn(
//       'AuthContext is not defined. Make sure you are using the AuthProvider.',
//     );
//     return false;
//   }

//   const { permissions } = authContext;

//   return permissions.some(
//     (permission) => permission.permissionName === permissionName,
//   );
// };
