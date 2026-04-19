import React, { useState, useEffect } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useAuth } from '../../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle } from 'lucide-react';

const CheckoutForm = ({ selectedPack }: { selectedPack: any }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user, refreshCoins } = useAuth();
  const navigate = useNavigate();
  
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (selectedPack.price > 0) {
      axiosSecure.post('/payments/create-payment-intent', { price: selectedPack.price })
        .then(res => {
          setClientSecret(res.data.clientSecret);
        });
    }
  }, [axiosSecure, selectedPack.price]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    setProcessing(true);
    setError('');

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      setError(error.message || 'Payment error');
      setProcessing(false);
      return;
    }

    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card,
          billing_details: {
            email: user?.email || 'anonymous',
            name: user?.displayName || 'anonymous',
          },
        },
      }
    );

    if (confirmError) {
      setError(confirmError.message || 'Confirmation error');
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      const paymentInfo = {
        buyer_email: user?.email,
        transactionId: paymentIntent.id,
        price: selectedPack.price,
        coins: selectedPack.coins,
        date: new Date(),
        status: 'succeeded'
      };

      try {
        await axiosSecure.post('/payments', paymentInfo);
        setSuccess(true);
        await refreshCoins();
        setTimeout(() => {
          navigate('/dashboard/payment-history');
        }, 2000);
      } catch (err) {
        setError("Payment succeeded but failed to update status in DB. Please contact support.");
      }
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#0f172a',
                '::placeholder': {
                  color: '#94a3b8',
                },
                fontFamily: 'Inter, sans-serif',
              },
              invalid: {
                color: '#ef4444',
              },
            },
          }}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-500 rounded-2xl text-sm font-bold border border-red-100 animate-in slide-in-from-top">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-sm font-bold border border-emerald-100 animate-in slide-in-from-top">
          <CheckCircle size={18} /> Payment successful! Redirecting...
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !clientSecret || processing || success}
        className="w-full py-5 bg-primary text-white font-black rounded-2xl hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-500/20 disabled:bg-slate-300 uppercase tracking-widest text-sm"
      >
        {processing ? "Processing..." : `Pay $${selectedPack.price} Now`}
      </button>
    </form>
  );
};

export default CheckoutForm;
