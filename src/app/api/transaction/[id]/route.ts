/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import User_trans from "@/models/user_transModel";

interface UserTrans {
    _id: number;
    trans_id: number;
    email: string;
    post_id: number;
    price: number;
    start_date: Date;
    end_date: Date;
    trans_status: string;
    cancelled_reason: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export async function GET(req: Request, { params }: { params: { id: number } }) {
    try {
        await connectDB();
        const { id } = await params;

        // Find the user transaction with the given ID
        const userTransaction = await User_trans.findOne({ trans_id: id }).lean<UserTrans>();

        if (!userTransaction) {
            return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
        }

        return NextResponse.json({
            _id: userTransaction._id,
            trans_id: userTransaction.trans_id,
            email: userTransaction.email,
            postId: userTransaction.post_id,
            price: userTransaction.price,
            startDate: userTransaction.start_date,
            endDate: userTransaction.end_date,
            transactionStatus: userTransaction.trans_status,
            cancelledReason: userTransaction.cancelled_reason || "None",
            createdAt: userTransaction.createdAt,
            updatedAt: userTransaction.updatedAt,
        });
    } catch (error: any) {
        console.error("Error fetching transaction details:", error);
        return NextResponse.json(
            { message: "Error fetching transaction details", error: error.message },
            { status: 500 }
        );
    }
}
