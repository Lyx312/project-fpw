/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { MidtransClient } from "midtrans-node-client";
import User_trans from "../../../models/user_transModel"; // Adjust the path based on your project structure
import connectDB from "@/config/database";

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
    if (!transaction) {
      return NextResponse.json({ error: "Invalid or non-payable transaction" }, { status: 400 });
    }

    console.log(transaction)

    const transactionDetails = {
      transaction_details: {
        order_id: `TRANS-${transaction._id}`,
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
    const { transactionId, status } = await req.json();

    if (!transactionId) {
      return NextResponse.json({ error: "Missing transaction ID" }, { status: 400 });
    }

    const transaction = await User_trans.findOne({ trans_id: transactionId });
    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

   if (status === "refund") {
    const orderId = `TRANS-${transaction._id}`;
    console.log("Order ID being sent to Midtrans:", orderId);

    const getTransIdResponse = await fetch(`https://api.sandbox.midtrans.com/v2/${orderId}/status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(serverKey + ":").toString("base64")}`,
      },
    });

    const getTransId = await getTransIdResponse.json();
    console.log("Midtrans response:", getTransId);

 
      // Step 2: Simulate approval if the transaction is pending
      const url = `https://api.sandbox.midtrans.com/v2/${getTransId.transaction_id}/refund/online/direct`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(serverKey + ":").toString("base64")}`,
        },
        body: JSON.stringify({
          "refund_key": `REFUND-${getTransId.transaction_id}`,
          "amount": getTransId.gross_amount,
          "reason": "Canceled by freelancer"
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Midtrans API error:", errorData);
        return NextResponse.json({ error: "Failed to refund transaction in Midtrans" }, { status: 500 });
      }

      console.log("Midtrans approval response:", await response.json());
    }

    // Step 3: Update transaction status in the database to 'paid'
    // transaction.trans_status = "paid";
    // await transaction.save();

    return NextResponse.json({
      message: "Transaction status updated to 'paid' in database and Midtrans",
    });
  } catch (error) {
    console.error("Error updating transaction status:", error);
    return NextResponse.json({ error: "Failed to update transaction status" }, { status: 500 });
  }
}