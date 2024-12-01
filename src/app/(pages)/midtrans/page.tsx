/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-sync-scripts */
'use client';

import { useState } from 'react';

export default function MidtransPage() {
  const [formData, setFormData] = useState({
    email: '',
    post_id: '',
    price: 0,
    start_date: '',
    end_date: '',
  });

  const [paymentToken, setPaymentToken] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseFloat(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/midtrans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.token) {
        setPaymentToken(result.token);
        initiatePayment(result.token);
      } else {
        console.error('Failed to create transaction:', result.error);
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
    }
  };

  const initiatePayment = (token: string) => {
    if (typeof window !== 'undefined') {
      const midtransSnap = (window as any).snap;
      if (!midtransSnap) {
        console.error('Midtrans Snap script not loaded.');
        return;
      }

      midtransSnap.pay(token, {
        onSuccess: (result: any) => {
          console.log('Payment successful:', result);
          alert('Payment successful!');
        },
        onPending: (result: any) => {
          console.log('Payment pending:', result);
          alert('Payment is pending. Please complete the transaction.');
        },
        onError: (result: any) => {
          console.error('Payment error:', result);
          alert('Payment failed. Please try again.');
        },
        onClose: () => {
          console.log('Payment popup closed.');
          alert('Payment popup closed. Please try again if necessary.');
        },
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Midtrans Payment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Post ID</label>
          <input
            type="number"
            name="post_id"
            value={formData.post_id}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Create Transaction
        </button>
      </form>

      {paymentToken && (
        <div className="mt-6">
          <p className="text-green-600 font-semibold">Transaction token generated!</p>
          <p>Token: {paymentToken}</p>
          <button
            onClick={() => initiatePayment(paymentToken)}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mt-2"
          >
            Pay Now
          </button>
        </div>
      )}

      {/* Include the Midtrans Snap JS */}
      <script
        type="text/javascript"
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ''}
      ></script>
    </div>
  );
}
