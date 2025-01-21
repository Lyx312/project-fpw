'use client';

import React, { useEffect, useState } from 'react';
import { Box, IconButton, Badge, Menu, MenuItem, Typography, Card, CardContent } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { INotification } from '@/models/notificationModel';
import { useAppSelector } from "@/app/redux/hooks";
import { pusherClient } from '@/lib/pusher';
import { IPusherNotification } from '../api/notifications/route';
import { baseUrl } from '@/config/url';

const Notifications = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const currUser = useAppSelector((state) => state.user);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (currUser._id) {
        const response = await axios.get(`${baseUrl}/api/notifications`, {
          params: { userId: currUser._id },
        });
        // console.log(response.data)
        setNotifications(response.data);
        setUnreadCount(response.data.filter((n: INotification) => !n.read).length);
      }
    };

    fetchNotifications();
  }, [currUser]);

  useEffect(() => {
    pusherClient.subscribe('notification');
    pusherClient.bind('newNotif', async (data: IPusherNotification) => {
      if (data.notification.userId.toString() === currUser._id && notifications.find((n) => n._id.toString() === data.notification._id.toString()) === undefined) {
        setNotifications((prev) => [data.notification, ...prev]);
        setUnreadCount((prev) => prev + 1);

        console.log(data.notification);
        console.log(notifications);
      }
    });

    return () => {
      pusherClient.unsubscribe('notification');
    }
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = async () => {
    setAnchorEl(null);
    if (currUser._id && unreadCount > 0) {
      await axios.put(`${baseUrl}/api/notifications`, { userId: currUser._id });
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
