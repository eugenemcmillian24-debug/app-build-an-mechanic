import Stripe from 'stripe';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2026-02-25.clover',
  });
}

export async function createCheckoutSession(
  userId: string,
  packId: string,
  credits: number,
  priceUsd: number
) {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `OPS AI DEV - ${credits} Credits`,
            description: `${credits} credits for OPS AI DEV platform`,
          },
          unit_amount: Math.round(priceUsd * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true&credits=${credits}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
    metadata: {
      user_id: userId,
      pack_id: packId,
      credits: credits.toString(),
    },
  });

  return session;
}
