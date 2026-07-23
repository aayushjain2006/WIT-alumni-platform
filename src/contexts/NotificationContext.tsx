import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSocket } from '../hooks/useSocket'

export interface Notification {
  id: string
  type: 'message' | 'connection_request' | 'connection_accepted' | 'event' | 'event_reminder' | 'job' | 'system'
  title: string
  description: string
  timestamp: string
  isRead: boolean
  actionUrl: string
  avatar?: string
  metadata?: any
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  messageCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  deleteNotification: (notificationId: string) => void
  getNotificationsByType: (type: string) => Notification[]
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { socket } = useSocket()

  const unreadCount = notifications.filter(n => !n.isRead).length
  const messageCount = notifications.filter(n => n.type === 'message' && !n.isRead).length

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification_${Date.now()}_${Math.random()}`,
      timestamp: new Date().toISOString()
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    )
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    )
  }

  const getNotificationsByType = (type: string) => {
    if (type === 'all') return notifications
    return notifications.filter(notification => notification.type === type)
  }

  useEffect(() => {
    if (!socket) return;

    socket.on('notification:new', (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
    });

    socket.on('message:new', (message: any) => {
      const newNotification: Notification = {
        id: `msg_${message._id}`,
        type: 'message',
        title: `New message from ${message.sender?.firstName || 'someone'}`,
        description: message.content,
        timestamp: new Date().toISOString(),
        isRead: false,
        actionUrl: '/messages',
      };
      setNotifications(prev => [newNotification, ...prev]);
    });

    return () => {
      socket.off('notification:new');
      socket.off('message:new');
    };
  }, [socket]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      messageCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      getNotificationsByType
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}