/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { MidtransClient } from "midtrans-node-client";
import User_trans from "../../../models/user_transModel"; // Adjust the path based on your project structure
import connectDB from "@/config/database";
import axios from "axios";

const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
const clientKey = process.env.MIDTRANS_CLIENT_KEY || "";

if (!serverKey || !clientKey) {
  throw new Error("Midtrans API keys are not defined in the environment variables");
}

const snap = new MidtransClient.Snap({
  isProduction: false,
  serverKey: serverKey,
  clientKey: clientKey,
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { transactionId } = await req.json();

    if (!transactionId) {
      return NextResponse.json({ error: "Missing transaction ID" }, { status: 400 });
    }

    const transaction = await User_trans.findOne({ trans_id: transactionId });
    if (!transaction || transaction.trans_status !== "completed") {
      return NextResponse.json({ error: "Invalid or non-payable transaction" }, { status: 400 });
    }

    const transactionDetails = {
      transaction_details: {
        order_id: `TRANS-${transaction.trans_id}`,
        gross_amount: transaction.price,
      },
      customer_details: {
        email: transaction.email,
      },
      payment_type: "bank_transfer",
      bank_transfer: {
        bank: "bca",
      },
    };

    const snapTransaction = await snap.createTransaction(transactionDetails);
    console.log("Snap token created:", snapTransaction.token);
    console.log("Order ID created:", `TRANS-${transaction.trans_id}`);

    return NextResponse.json({ token: snapTransaction.token });
  } catch (error) {
    console.error("Midtrans API error:", error);
    return NextResponse.json({ error: "Failed to initiate transaction" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { transactionId } = await req.json();

    if (!transactionId) {
      return NextResponse.json({ error: "Missing transaction ID" }, { status: 400 });
    }

    const transaction = await User_trans.findOne({ trans_id: transactionId });
    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    const orderId = `TRANS-${transaction.trans_id}`;
    console.log("Order ID being sent to Midtrans:", orderId);

    try {
      const url = `https://api.sandbox.midtrans.com/v2/${orderId}/approve`;

    // Make a POST request to approve the transaction
    const response = await axios.post(
      url,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(serverKey + ':').toString('base64')}`,
        },
      }
    );
      
    } catch (midtransError: any) {
      console.error("Midtrans API error:", midtransError);
      if (midtransError.message.includes("Transaction doesn't exist")) {
        console.error(
          "The transaction may not have been created in Midtrans. Verify the order ID and creation process."
        );
      }
      return NextResponse.json({ error: "Failed to fetch status from Midtrans" }, { status: 500 });
    }

    transaction.trans_status = "paid";
    await transaction.save();

    return NextResponse.json({ message: "Transaction status updated to completed in database and Midtrans" });
  } catch (error) {
    console.error("Error updating transaction status:", error);
    return NextResponse.json({ error: "Failed to update transaction status" }, { status: 500 });
  }
}