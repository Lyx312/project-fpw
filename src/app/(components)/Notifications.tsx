'use client';

import React, { useEffect, useState } from 'react';
import { Box, IconButton, Badge, Menu, MenuItem, Typography, Card, CardContent } from '@mui/material';
import { getCurrUser } from "@/utils/utils";
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { INotification } from '@/models/notificationModel';

interface User {
  _id: string;
}

const Notifications = () => {
  const [currUser, setCurrUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrUser() as unknown as User;

      if (user) {
        setCurrUser(user);
      } else {
        setCurrUser(null);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (currUser) {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notifications`, {
          params: { userId: currUser._id },
        });
        console.log(response.data)
        setNotifications(response.data);
        setUnreadCount(response.data.filter((n: INotification) => !n.read).length);
      }
    };

    fetchNotifications();
  }, [currUser]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    
  };

  const handleMenuClose = async () => {
    setAnchorEl(null);
    if (currUser && unreadCount > 0) {
      await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notifications`, { userId: currUser._id });
      setUnreadCount(0);
    }
  };

  return (
    <Box>
      <IconButton color="inherit" onClick={handleMenuOpen}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        sx={{ maxHeight: '60vh' }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <Typography variant="h6" sx={{ px: 2, py: 1.2 }}> Notifications </Typography>
        {notifications.length === 0 ? (
          <MenuItem>
            <Typography>No notifications</Typography>
          </MenuItem>
        ) : (
          notifications.map((notification: INotification) => (
            <MenuItem key={notification._id.toString()}>
              <Card 
                sx={{ 
                  width: '25vw', 
                  backgroundColor: (unreadCount==0? 'inherit' : (notification.read ? 'inherit' : 'rgba(0, 0, 255, 0.1)'))
                }} 
                onClick={() => {
                  handleMenuClose();
                  window.location.href = notification.link;
                }}
              >
                <CardContent>
                  <Typography style={{ whiteSpace: 'pre-wrap' }}>{notification.message}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </Typography>
                </CardContent>
              </Card>
            </MenuItem>
          ))
        )}
      </Menu>
    </Box>
  );
};

export default Notifications;
