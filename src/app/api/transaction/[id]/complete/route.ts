import { NextResponse } from 'next/server';
import User_trans from '@/models/user_transModel';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params;

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ message: 'Invalid transaction ID' }, { status: 400 });
  }

  try {
    const userTrans = await User_trans.findOneAndUpdate(
      { trans_id: id },
      { 
        trans_status: 'completed',
        end_date: new Date()
      },
      { new: true }
    );

    if (!userTrans) {
      return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json(userTrans, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
  }
}