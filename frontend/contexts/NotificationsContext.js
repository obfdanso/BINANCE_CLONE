import React, { createContext, useContext, useState } from 'react';

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: 'Security Update',
            desc: 'New security features have been added to your account',
            time: '1 day ago',
            unread: true,
            icon: 'information-circle',
        },
    ]);

    const addNotification = (notif) => {
        setNotifications((prev) => [
            { ...notif, id: Date.now(), unread: true },
            ...prev,
        ]);
    };

    const markAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    };

    const markAllUnread = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, unread: true })));
    };

    const markAsRead = (id) => {
        setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, unread: false } : n));
    };
    return (
        <NotificationsContext.Provider value={{ notifications, addNotification, markAllRead, markAllUnread, markAsRead }}>
            {children}
        </NotificationsContext.Provider>
    );
}

export function useNotifications() {
    return useContext(NotificationsContext);
}

export default NotificationsProvider; 