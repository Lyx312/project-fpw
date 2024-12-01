import { NextRequest, NextResponse } from 'next/server';
import { MidtransClient } from 'midtrans-node-client';
import User_trans from '../../../models/user_transModel'; // Adjust the path based on your project structure
import connectDB from '@/config/database';

const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
const clientKey = process.env.MIDTRANS_CLIENT_KEY || '';

if (!serverKey || !clientKey) {
  throw new Error('Midtrans API keys are not defined in the environment variables');
}

const snap = new MidtransClient.Snap({
  isProduction: false,
  serverKey: serverKey,
  clientKey: clientKey
});


export async function POST(req: NextRequest) {
    console.log(serverKey);
    console.log(clientKey)
    try {
      await connectDB();
      const body = await req.json();
      console.log("Request body:", body);
  
      const { email, post_id, price, start_date, end_date } = body;
      if (!email || !post_id || !price || !start_date || !end_date) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }
  
      const trans = (await User_trans.find()).length;

      const newTransaction = await User_trans.create({
        trans_id: (trans+1),
        email,
        post_id,
        price,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        trans_status: "pending",
      });
      console.log("New transaction created in DB:", newTransaction);
  
      const transactionDetails = {
        transaction_details: {
          order_id: `TRANS-${newTransaction.trans_id}`,
          gross_amount: parseFloat(price),
        },
        customer_details: {
          email,
        },
      };
  
      try {
        const transaction = await snap.createTransaction(transactionDetails);
        console.log("Midtrans transaction created:", transaction);
        return NextResponse.json({ token: transaction.token, transaction: newTransaction });
      } catch (error) {
        console.error("Midtrans transaction error:", error);
        return NextResponse.json({ error: "Failed to create transaction with Midtrans" }, { status: 500 });
      }      
    } catch (error) {
      console.error("API error:", error);
      return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
    }
  }

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    const { order_id, transaction_status } = body;
    if (!order_id || !transaction_status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Extract transaction ID from order_id
    const transId = parseInt(order_id.replace('TRANS-', ''), 10);

    // Update transaction status in MongoDB
    const updatedTransaction = await User_trans.findOneAndUpdate(
      { trans_id: transId },
      { trans_status: transaction_status, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedTransaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({ transaction: updatedTransaction });
  } catch (error) {
    console.error('Failed to update transaction:', error);
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}
