/**
 * Contexto de la sesión. Lo llena AuthProvider y se lee con el hook useAuth().
 */
import { createContext } from 'react';

export const AuthContext = createContext(null);
