import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';

export function useSocket() {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (user) {
      // Connect to the backend Socket.IO server (not the frontend origin)
      const apiBase = import.meta.env.VITE_API_URL || '/api/v1'
      const socketUrl = apiBase.replace(/\/api\/v1\/?$/, '') || window.location.origin

      const newSocket = io(socketUrl, {
        withCredentials: true,
        auth: (cb) => cb({ token: localStorage.getItem('accessToken') || undefined }),
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
    }
  }, [user]);

  return { socket, isConnected };
}
