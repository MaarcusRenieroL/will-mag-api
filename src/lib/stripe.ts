// lib/stripe.ts
import Stripe from "stripe";

// eslint-disable-next-line node/no-process-env
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});
