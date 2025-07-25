import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client'

const BASE_URL = import.meta.env.MODE === "development" ?'http://localhost:5001' : '/'; // for socket.io only

// custom hook for user authentication state
export const useAuthStore = create((set, get) => ({
  authUser: null, // initially state is null

  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isLoggingOut: false,

  isCheckingAuth: true, // loading state for checking auth

  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get('/auth/check'); // axiosInstance baseURL already includes /api/v1

      set({authUser: response.data})
      get().connectSocket();
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

      get().connectSocket();
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

      get().connectSocket();
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

      get().disconnectSocket();
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

  connectSocket: () => {
    const { authUser } = get() // authUser is a state of this function itself no chaining needed
    if(!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      }
    });
    socket.connect();

    set({ socket: socket});


    socket.on('getOnlineUsers', (userIds) => {
      set({ onlineUsers: userIds})
    }) // updates the onlineUsers array when getOnlineUsers event hass taken place
  },

  disconnectSocket: () => {
    if(get().socket?.connected) get().socket.disconnect()

  },
}))