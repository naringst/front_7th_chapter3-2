import { useCallback, useState } from 'react';
import { useNotification } from '../../notification/hooks/useNotification';
import {
  couponsWithStorageAtom,
  selectedCouponAtom,
} from '../atoms/coupon.atom';
import { useAtom } from 'jotai';
import { Coupon } from '../../../../types';

export const initialCoupons: Coupon[] = [
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

export const useManageCoupon = () => {
  const { addNotification } = useNotification();
  const [coupons, setCoupons] = useAtom(couponsWithStorageAtom);
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);
  const [showCouponForm, setShowCouponForm] = useState(false);

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

  const toggleShowCouponForm = () => {
    setShowCouponForm((prev) => !prev);
  };

  const deleteCoupon = useCallback((couponCode: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
  }, []);

  const applyCoupon = useCallback(
    (coupon: Coupon, { onSuccess }: { onSuccess?: () => void }) => {
      setSelectedCoupon(coupon);
      onSuccess?.();
    },
    [setSelectedCoupon],
  );

  const handleDeleteCoupon = (
    couponCode: string,
    {
      onSuccess,
    }: { onSuccess?: (message: string, type: 'success' | 'error') => void },
  ) => {
    deleteCoupon(couponCode);
    if (selectedCoupon?.code === couponCode) {
      setSelectedCoupon(null);
    }

    onSuccess?.('쿠폰이 삭제되었습니다.', 'success');
  };

  return {
    coupons,
    selectedCoupon,
    setSelectedCoupon,
    applyCoupon,
    addCoupon,
    toggleShowCouponForm,
    handleDeleteCoupon,
    showCouponForm,
  };
};
