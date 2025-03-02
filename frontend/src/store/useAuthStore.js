import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { data } from 'react-router-dom';


// custom hook for user authentication state
export const useAuthStore = create((set) => ({
  authUser: null, // initially state is null

  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isLoggingOut: false,

  isCheckingAuth: true, // loading state for checking auth

  onlineUsers: [],

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get('/auth/check');

      set({authUser: response.data})
    } catch (error) {
      console.log('Error in checkAuth:', error)
      set({authUser: null})
    } finally {
      set({isCheckingAuth: false})
    }
  },

  signup: async (data) => {
    set({isSigningUp: true});
    try {
      const res = await axiosInstance.post('/auth/signup', data);
      set({ authUser: res.data });
      toast.success('Account created successfully')
    } catch(error) {
      toast.error(error.response.data.msg)
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data)  => {
    set({isLoggingIn: true});
    try {
      const res = await axiosInstance.post('/auth/login', data);
      set({authUser: res.data});
      toast.success('Logged in successfully');
    } catch (error) {
      toast.error(error.response.data.msg);
    } finally {
      set({isLoggingIn: false});
    }
  },
  
  logout: async () => {
    set({isLoggingOut: true});
    try {
      const res = await axiosInstance.get('/auth/logout');
      set({authUser: null});
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error(error.response.data.msg);
    } finally {
      set({isLoggingOut: false});
    }
  },

  updateProfile: async (data) => {
    set({isUpdatingProfile: true});
    try {
      const res = await axiosInstance.put('/auth/update-profile', data);
      set({authUser: res.data});
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response.data.msg);
    } finally {
      set({isUpdatingProfile: false});
    }
  },  
}))