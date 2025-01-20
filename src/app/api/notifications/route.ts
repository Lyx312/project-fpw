import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Notification from '@/models/notificationModel';
import User from '@/models/userModel';
import { pusherServer } from '@/lib/pusher';

export async function GET(req: Request) {
  
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  try {
    await connectDB();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    // console.log(notifications);
    
    return NextResponse.json(notifications);
    
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch notifications', error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId, message, link, type } = await req.json();
  
  if (!userId || !message || !type) {
    return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
  }

  try {
    await connectDB();
  
    const notification = new Notification({ userId, message, link, type });
    await notification.save();
    return NextResponse.json(notification, { status: 201 });

    pusherServer.trigger('notification', 'newNotif', {
      notification: notification,
    });

  } catch (error) {
    return NextResponse.json({ message: 'Failed to create notification', error }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { userId } = await req.json();

  try {
    await connectDB();
    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    // check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Update all notifications for the user to read
    const updatedNotif = await Notification.updateMany({ userId: userId, read: false }, { read: true });
    
    pusherServer.trigger('notification', 'readNotif', {
      updated: updatedNotif,
    });

    return NextResponse.json({ message: 'All notifications marked as read' }, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Failed to mark notifications as read', error }, { status: 500 });
  }
}