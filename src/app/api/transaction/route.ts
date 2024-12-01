import connectDB from '../../../config/database';
import User_trans from '../../../models/user_transModel';

export async function GET(req: Request) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const trans_id = searchParams.get('trans_id');
    const email = searchParams.get('email');
    const trans_status = searchParams.get('trans_status');
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');
    const min_price = searchParams.get('min_price');
    const max_price = searchParams.get('max_price');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    if (trans_id) query.trans_id = trans_id;
    if (email) query.email = { $regex: email, $options: 'i' };
    if (trans_status) query.trans_status = { $regex: trans_status, $options: 'i' };
    if (start_date) query.start_date = { $gte: new Date(start_date) };
    if (end_date) query.end_date = { $lte: new Date(end_date) };
    if (min_price) query.price = { $gte: parseFloat(min_price) };
    if (max_price) query.price = { ...query.price, $lte: parseFloat(max_price) };

    const transactions = await User_trans.find(query);

    return Response.json(transactions, { status: 200 });
  } catch (error) {
    return Response.json({ message: 'Error fetching transactions', error: error }, { status: 500 });
  }
}
