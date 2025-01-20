import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Chat, { IMessage } from '@/models/chatModel';
import User from '@/models/userModel';
import Notification from '@/models/notificationModel';
import { pusherServer } from '@/lib/pusher';

export interface IPusherChat {
  freelancerId: string;
  clientId: string;
  newMessage: IMessage;
}

export async function GET(req: Request) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const senderId = searchParams.get('senderId');
    const receiverId = searchParams.get('receiverId');

    if (!senderId || !receiverId) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return NextResponse.json({ error: 'Invalid user' }, { status: 404 });
    }

    const freelancerId = sender.role === 'freelancer' ? senderId : receiverId;
    const clientId = sender.role === 'client' ? senderId : receiverId;

    const chat = await Chat.findOne({ freelancerId, clientId });

    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    return NextResponse.json(chat, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch chat', error }, { status: 500 });
  }
}


export async function POST(req: Request) {
  await connectDB();

  try {
    const { senderId, receiverId, content } = await req.json();


    if (!senderId || !receiverId) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return NextResponse.json({ error: 'Invalid user' }, { status: 404 });
    }

    const freelancerId = sender.role === 'freelancer' ? senderId : receiverId;
    const clientId = sender.role === 'client' ? senderId : receiverId;

    const chat = await Chat.findOne({ freelancerId, clientId });
    const newMessage = { sender: senderId, content, timestamp: new Date() };

    if (!chat) {
      const newChat = new Chat({
        freelancerId,
        clientId,
        messages: [newMessage],
      });
      await newChat.save();

      pusherServer.trigger('chat', 'newMessage', {
        freelancerId: freelancerId,
        clientId: clientId,
        newMessage: newMessage,
      });

      // check if notification exists
      const exist = Notification.findOne({ userId: receiverId, type: "message", link: `/chat/${senderId}`, read: false });

      if (!exist) {
        const notification = new Notification({ 
          userId: receiverId, 
          message: `You have a new message from ${sender.first_name} ${sender.last_name}`, 
          link: `/chat/${senderId}`, 
          type: "message" 
        });
        await notification.save();
      }

      return NextResponse.json({messages: newChat.messages}, { status: 201 });
    } else {
      const newMessage = {
        sender: senderId,
        content,
        timestamp: new Date(),
      };

      chat.messages.push(newMessage);
      await chat.save();

      pusherServer.trigger('chat', 'newMessage', {
        freelancerId: freelancerId,
        clientId: clientId,
        newMessage: newMessage,
      });


      // check if notification exists
      const exist = await Notification.findOne({ userId: receiverId, type: "message", link: `/chat/${senderId}`, read: false });
      console.log(exist);

      if (!exist) {
        
        const notification = new Notification({ 
          userId: receiverId, 
          message: `You have a new message from ${sender.first_name} ${sender.last_name}`, 
          link: `/chat/${senderId}`, 
          type: "message" 
        });
        await notification.save();

        pusherServer.trigger('notification', 'newNotif', {
          // chatId: newChat._id,
          notification: notification,
        });
      }
      
      return NextResponse.json({messages: chat.messages}, { status: 200 });
    }

  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Failed to process chat', error }, { status: 500 });
  }
}