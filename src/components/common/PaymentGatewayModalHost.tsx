'use client';

import React, { useState, useEffect } from 'react';
import { PaymentGatewayModal, PaymentModalData } from './PaymentGatewayModal';

export function PaymentGatewayModalHost() {
  const [modalData, setModalData] = useState<PaymentModalData | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__SAVERA_OPEN_PAYMENT_MODAL = (data) => {
        setModalData({
          ...data,
          isOpen: true,
        });
      };
    }
  }, []);

  return (
    <PaymentGatewayModal
      data={modalData}
      onClose={() => setModalData((prev) => (prev ? { ...prev, isOpen: false } : null))}
    />
  );
}
