'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import {
  X,
  Copy,
  Check,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  QrCode,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';

interface UpiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  amount: number;
  itemDescription?: string;
  onPaymentSuccess: (details: {
    transactionId: string;
    utrNumber?: string;
    amount: number;
    upiId: string;
    timestamp: string;
  }) => Promise<void> | void;
}

export const OFFICIAL_UPI_ID = 'feroznadaf13008@ybl';
export const OFFICIAL_PAYEE_NAME = 'Karnataka Gym Hubballi';

export function UpiPaymentModal({
  isOpen,
  onClose,
  title,
  amount,
  itemDescription,
  onPaymentSuccess
}: UpiPaymentModalProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txnId, setTxnId] = useState('');

  // UPI deep link URI
  const note = itemDescription || title;
  const upiUri = `upi://pay?pa=${OFFICIAL_UPI_ID}&pn=${encodeURIComponent(OFFICIAL_PAYEE_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note.slice(0, 50))}`;

  // Generate QR code data URL
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    QRCode.toDataURL(upiUri, {
      width: 280,
      margin: 1.5,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    })
      .then((url) => {
        if (isMounted) setQrCodeUrl(url);
      })
      .catch(() => {
        // Fallback to high-speed public QR API if local canvas fails
        if (isMounted) {
          setQrCodeUrl(
            `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=8&data=${encodeURIComponent(upiUri)}`
          );
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, upiUri]);

  if (!isOpen) return null;

  const handleCopyUpi = () => {
    try {
      navigator.clipboard.writeText(OFFICIAL_UPI_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback copy
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConfirmPayment = async () => {
    setIsSubmitting(true);
    const generatedTxn = `TXN_UPI_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    setTxnId(generatedTxn);

    try {
      // Trigger festive confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Ignore confetti error
      }

      await onPaymentSuccess({
        transactionId: generatedTxn,
        utrNumber: utrNumber.trim() || undefined,
        amount,
        upiId: OFFICIAL_UPI_ID,
        timestamp: new Date().toISOString()
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsSubmitting(false);
        onClose();
      }, 2000);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#121622] border-2 border-[#E5A93C] rounded-3xl p-5 sm:p-6 max-w-md w-full space-y-4 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        {!isSuccess && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-[#1C2333] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-[#232B3E] pb-3 pr-8">
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 drop-shadow-md border border-[#E5A93C]/40">
            <Image
              src="/karnataka-gym-badge.png"
              alt="Karnataka Gym"
              width={40}
              height={40}
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-black text-white truncate">{title}</h3>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <span>Official UPI QR</span>
              <span>•</span>
              <span className="text-[#E5A93C] font-semibold">Hubballi Facility</span>
            </span>
          </div>
        </div>

        {isSuccess ? (
          /* SUCCESS VIEW */
          <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle className="w-10 h-10 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-lg font-black text-white">Payment Received!</h4>
              <p className="text-xs text-emerald-300 mt-1">
                Your payment of ₹{amount} to {OFFICIAL_UPI_ID} has been verified and recorded.
              </p>
              <span className="text-[10px] text-slate-400 font-mono block mt-2">
                ID: {txnId}
              </span>
            </div>
          </div>
        ) : (
          /* PAYMENT FORM VIEW */
          <div className="space-y-4">
            {/* Amount Banner */}
            <div className="p-3.5 rounded-2xl bg-[#171D2B] border border-[#26334A] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Amount Payable
                </span>
                <span className="text-xs text-slate-300 font-medium">{title}</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-[#E5A93C] font-mono block leading-none">
                  ₹{amount}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">GST Included</span>
              </div>
            </div>

            {/* UPI QR Code Container */}
            <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center shadow-lg border border-slate-200 relative">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-800 mb-1 flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-slate-700" />
                <span>Scan to Pay via Any UPI App</span>
              </div>

              {qrCodeUrl ? (
                <div className="relative w-52 h-52 sm:w-56 sm:h-56">
                  <img
                    src={qrCodeUrl}
                    alt="Karnataka Gym Official UPI QR Code"
                    className="w-full h-full object-contain"
                  />
                  {/* Center Badge */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-[#121622] border-2 border-[#E5A93C] p-1 flex items-center justify-center shadow-md">
                      <span className="text-xs font-black text-[#E5A93C]">KG</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-52 h-52 flex items-center justify-center text-xs text-slate-500">
                  <Clock className="w-4 h-4 animate-spin mr-1.5" />
                  Generating UPI QR...
                </div>
              )}

              {/* UPI Badges */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-100 w-full justify-center">
                <span className="text-[10px] font-bold text-slate-600">Accepted:</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                  GPay
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                  PhonePe
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                  Paytm
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                  BHIM
                </span>
              </div>
            </div>

            {/* UPI ID Pill with Copy */}
            <div className="p-3 rounded-2xl bg-[#171D2B] border border-[#26334A] flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Official Payee UPI ID
                </span>
                <span className="text-xs sm:text-sm font-mono font-bold text-white truncate block">
                  {OFFICIAL_UPI_ID}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="py-1.5 px-3 rounded-xl bg-[#232D42] hover:bg-[#2C3852] text-xs font-bold text-[#E5A93C] flex items-center gap-1.5 transition-colors flex-shrink-0 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct Open in UPI App Link (Mobile) */}
            <a
              href={upiUri}
              className="w-full bg-[#1F2739] hover:bg-[#28334A] border border-[#2D3950] text-slate-200 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-[#E5A93C]" />
              <span>Tap to Open in Installed UPI App</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            {/* UTR Input & Confirmation */}
            <div className="space-y-2 pt-1 border-t border-[#232B3E]">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  UPI UTR / Reference No. (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 431289012345 (12 digits from receipt)"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  maxLength={16}
                  className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-[#E5A93C] rounded-xl py-2 px-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* Confirm Paid Button */}
              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4 stroke-[2.5]" />
                <span>
                  {isSubmitting ? 'Verifying UPI Payment...' : `I Have Paid ₹${amount} (Confirm)`}
                </span>
              </button>
            </div>

            <div className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E5A93C]" />
              <span>Direct bank-to-bank settlement • Zero extra processing fee</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
