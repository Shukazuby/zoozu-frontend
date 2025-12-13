"use client";

import Link from "next/link";
import { Suspense } from "react";

function PaymentConfirmationContent() {
  // This page is used as a Paystack callback URL
  // When users are redirected here, payment was successful
  return (
    <div className="bg-slate-50 min-h-screen pb-16 pt-12">
      <div className="container max-w-2xl">
        <div className="mx-auto">
          <div className="rounded-lg bg-white p-12 shadow-sm text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="mb-4 text-3xl font-semibold text-slate-900">
              Thank you. We have received your payment.
            </h1>
            <p className="text-lg text-slate-600">
              Your order has been confirmed and will be processed shortly.
            </p>
            <div className="mt-8">
              <Link
                href="/collections"
                className="inline-block rounded-lg bg-yellow-600 px-8 py-3 text-sm font-semibold text-slate-900 transition hover:bg-yellow-500"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="bg-slate-50 min-h-screen pb-16 pt-12">
        <div className="container">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-yellow-600"></div>
            <p className="mt-4 text-sm text-slate-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <PaymentConfirmationContent />
    </Suspense>
  );
}

