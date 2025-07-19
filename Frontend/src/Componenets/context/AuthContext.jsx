import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
  error: null
};

// Action types
const AuthActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AuthActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case AuthActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null
      };

    case AuthActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case AuthActionTypes.LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null
      };

    case AuthActionTypes.LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: null
      };

    case AuthActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case AuthActionTypes.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is authenticated on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        dispatch({ type: AuthActionTypes.SET_LOADING, payload: true });
        const user = await authService.getCurrentUser();
        dispatch({ type: AuthActionTypes.SET_USER, payload: user });
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        dispatch({ type: AuthActionTypes.LOGOUT });
      }
    } else {
      dispatch({ type: AuthActionTypes.SET_LOADING, payload: false });
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: AuthActionTypes.SET_LOADING, payload: true });
      dispatch({ type: AuthActionTypes.CLEAR_ERROR });
      
      const response = await authService.login(credentials);
      
      dispatch({
        type: AuthActionTypes.LOGIN_SUCCESS,
        payload: {
          user: response.user,
          token: response.token
        }
      });
      
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({
        type: AuthActionTypes.SET_ERROR,
        payload: errorMessage
      });
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: AuthActionTypes.SET_LOADING, payload: true });
      dispatch({ type: AuthActionTypes.CLEAR_ERROR });
      
      const response = await authService.register(userData);
      
      dispatch({
        type: AuthActionTypes.LOGIN_SUCCESS,
        payload: {
          user: response.user,
          token: response.token
        }
      });
      
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({
        type: AuthActionTypes.SET_ERROR,
        payload: errorMessage
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: AuthActionTypes.LOGOUT });
    }
  };

  const updateUser = async (userData) => {
    try {
      dispatch({ type: AuthActionTypes.SET_LOADING, payload: true });
      dispatch({ type: AuthActionTypes.CLEAR_ERROR });
      
      const updatedUser = await authService.updateProfile(userData);
      
      dispatch({
        type: AuthActionTypes.UPDATE_USER,
        payload: updatedUser
      });
      
      return updatedUser;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      dispatch({
        type: AuthActionTypes.SET_ERROR,
        payload: errorMessage
      });
      throw error;
    }
  };

  const changePassword = async (passwordData) => {
    try {
      dispatch({ type: AuthActionTypes.SET_LOADING, payload: true });
      dispatch({ type: AuthActionTypes.CLEAR_ERROR });
      
      await authService.changePassword(passwordData);
      
      dispatch({ type: AuthActionTypes.SET_LOADING, payload: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password change failed';
      dispatch({
        type: AuthActionTypes.SET_ERROR,
        payload: errorMessage
      });
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      dispatch({ type: AuthActionTypes.SET_LOADING, payload: true });
      dispatch({ type: AuthActionTypes.CLEAR_ERROR });
      
      await authService.forgotPassword(email);
      
      dispatch({ type: AuthActionTypes.SET_LOADING, payload: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password reset failed';
      dispatch({
        type: AuthActionTypes.SET_ERROR,
        payload: errorMessage
      });
      throw error;
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      dispatch({ type: AuthActionTypes.SET_LOADING, payload: true });
      dispatch({ type: AuthActionTypes.CLEAR_ERROR });
      
      await authService.resetPassword(token, newPassword);
      
      dispatch({ type: AuthActionTypes.SET_LOADING, payload: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password reset failed';
      dispatch({
        type: AuthActionTypes.SET_ERROR,
        payload: errorMessage
      });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: AuthActionTypes.CLEAR_ERROR });
  };

  const value = {
    // State
    user: state.user,
    token: state.token,
    loading: state.loading,
    error: state.error,
    isAuthenticated: !!state.user,
    
    // Actions
    login,
    register,
    logout,
    updateUser,
    changePassword,
    forgotPassword,
    resetPassword,
    clearError,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;