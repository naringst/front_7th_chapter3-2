import { useCallback, useEffect, useState } from 'react';
import { Coupon } from '../../../../types';
import { useNotification } from '../../../shared/hooks/useNotification';

export const useManageCoupon = () => {
  // 이건 어드민의 역할!
  const { addNotification } = useNotification();

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const initialCoupons: Coupon[] = [
    {
      name: '5000원 할인',
      code: 'AMOUNT5000',
      discountType: 'amount',
      discountValue: 5000,
    },
    {
      name: '10% 할인',
      code: 'PERCENT10',
      discountType: 'percentage',
      discountValue: 10,
    },
  ];

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('coupons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialCoupons;
      }
    }
    return initialCoupons;
  });

  useEffect(() => {
    localStorage.setItem('coupons', JSON.stringify(coupons));
  }, [coupons]);

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        addNotification('이미 존재하는 쿠폰 코드입니다.', 'error');
        return;
      }
      setCoupons((prev) => [...prev, newCoupon]);
      addNotification('쿠폰이 추가되었습니다.', 'success');
    },
    [coupons, addNotification],
  );

  const deleteCoupon = useCallback((couponCode: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
  }, []);

  const applyCoupon = useCallback(
    (coupon: Coupon, { onSuccess }: { onSuccess?: () => void }) => {
      setSelectedCoupon(coupon);
      onSuccess?.();
    },
    [],
  );

  return {
    addCoupon,
    deleteCoupon,
    coupons,
    selectedCoupon,
    setSelectedCoupon,
    applyCoupon,
  };
};
