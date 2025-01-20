'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, List, ListItem, ListItemText, Paper, Avatar } from '@mui/material';
import axios from 'axios';
import { IMessage, IChat } from '@/models/chatModel';
import { useParams } from 'next/navigation';
import Header from '@/app/(components)/Header';
import Loading from '@/app/(pages)/loading';
import { useAppSelector } from '@/app/redux/hooks';

interface User {
  _id: string;
  email: string;
  full_name: string;
  role: string;
  pfp_path?: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [receiver, setReceiver] = useState<User | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const currUser = useAppSelector((state) => state.user);

  const { id } = useParams<{ id: string }>();

  const fetchReceiver = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${id}`
      );
      const user = response.data;

      if (user) {
        const mappedUser: User = {
          _id: user._id,
          email: user.email,
          full_name: `${user.first_name} ${user.last_name}`,
          role: user.role,
          pfp_path: user.pfp_path,
        };
        // console.log(user);

        setReceiver(mappedUser);
      } else {
        console.error("User not found");
      }
    } catch (error) {
      console.error("Error fetching receiver:", error);
    }
  };

  const fetchChat = async () => {
    try {
      const response = await axios.get<IChat>(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chat`, {
        params: {
          senderId: currUser?._id,
          receiverId: id,
        },
      });
      // console.log(response.data);

      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching chat:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceiver();
  }, []);

  useEffect(() => {
    if (currUser._id && receiver) {
      fetchChat();
    }
  }, [currUser, receiver]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
  
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chat`, {
        senderId: currUser?._id,
        receiverId: id,
        content: newMessage,
      });
  
      setMessages([...response.data.messages]);
      setNewMessage('');

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <Header />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '85vh', padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Chat with {receiver?.full_name}
        </Typography>
        <Paper ref={chatContainerRef} sx={{ flexGrow: 1, overflowY: 'auto', padding: 2, marginBottom: 2, borderRadius: 2 }}>
          <List>
            {messages.map((message, index) => (
              <ListItem
                key={index}
                sx={{
                  marginBottom: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: message.sender.toString() === currUser?._id ? 'flex-end' : 'flex-start',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    marginBottom: 1,
                  }}
                >
                  {message.sender.toString() !== currUser?._id && (
                    <Avatar alt={receiver?.full_name} src={receiver?.pfp_path} />
                  )}
                  <Box
                    sx={{
                      padding: 2,
                      borderRadius: 2,
                      backgroundColor: message.sender.toString() === currUser?._id ? '#DCF8C6' : '#E3F2FD',
                      minWidth: '10vw',
                      maxWidth: '70vw',
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: '0px',
                        left: message.sender.toString() === currUser?._id ? 'auto' : '-8px',
                        right: message.sender.toString() === currUser?._id ? '-8px' : 'auto',
                        width: 0,
                        height: 0,
                        borderStyle: 'solid',
                        borderWidth: '8px 8px 0 8px',
                        borderColor: `${message.sender.toString() === currUser?._id ? '#DCF8C6' : '#E3F2FD'} transparent transparent transparent`,
                      },
                    }}
                  >
                    <ListItemText primary={message.content} />
                  </Box>
                  {message.sender.toString() === currUser?._id && (
                    <Avatar alt={currUser?.full_name} src={currUser?.pfp_path} />
                  )}
                </Box>
                <Typography variant="caption" sx={{ marginTop: 0.5 }}>
                  {new Date(message.timestamp).toLocaleString()}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Paper>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button variant="contained" color="primary" onClick={handleSendMessage}>
            Send
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default ChatPage;
