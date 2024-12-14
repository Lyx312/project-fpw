import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import User_trans from '@/models/user_transModel';

export async function GET(req: Request) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const trans_id = searchParams.get('trans_id');
    const post_id = searchParams.get('post_id');
    const email = searchParams.get('email');
    const trans_status = searchParams.get('trans_status');
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');
    const min_price = searchParams.get('min_price');
    const max_price = searchParams.get('max_price');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    if (trans_id) query.trans_id = trans_id;
    if (post_id) query.post_id = post_id;
    if (email) query.email = { $regex: email, $options: 'i' };
    if (trans_status) query.trans_status = { $regex: trans_status, $options: 'i' };
    if (start_date) query.start_date = { $gte: new Date(start_date) };
    if (end_date) query.end_date = { $lte: new Date(end_date) };
    if (min_price) query.price = { $gte: parseFloat(min_price) };
    if (max_price) query.price = { ...query.price, $lte: parseFloat(max_price) };

    const transactions = await User_trans.find(query);

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching transactions', error: error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await connectDB();

  try {
    const { email, post_id, price } = await req.json();

    // Check if the required fields are present
    if (!email || !post_id || !price) {
      return NextResponse.json({ message: 'Email, post_id, and price is required' }, { status: 400 });
    }

    // Find the last transaction
    const lastTrans = await User_trans.findOne().sort({ trans_id: -1 });

    // Increment the last trans_id by one
    const trans_id = lastTrans ? lastTrans.trans_id + 1 : 1;

    const newUserTrans = new User_trans({
      trans_id,
      email,
      post_id,
      price
    });

    const savedUserTrans = await newUserTrans.save();
    return NextResponse.json({ message: "Success creating transaction", savedUserTrans}, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating user transaction', error }, { status: 400 });
  }
}
