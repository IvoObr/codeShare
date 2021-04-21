import { login, logout, register } from './AuthenticationService';
import { deleteUser, updateUser, getAllUsers } from './UserService';
import { authorizeJWT, authorizeAdmin } from './AuthorizationService';

export {
    login, logout, register,
    authorizeJWT, authorizeAdmin,
    deleteUser, updateUser, getAllUsers
};
