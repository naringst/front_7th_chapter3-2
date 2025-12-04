import { useState } from 'react';
import { useManageCoupon } from '../../hooks/useManageCoupon';
import { Coupon } from '../../../../../types';
import { AddNewCouponCard } from './AddNewCouponCard';
import { CouponAddForm } from './CouponAddForm';
import { CouponCard } from './CouponCard';

export interface CouponForm {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
}
export const AdminCouponList = ({
  addNotification,
}: {
  addNotification: (message: string, type: 'success' | 'error') => void;
}) => {
  const {
    coupons,
    handleCouponSubmit,
    toggleShowCouponForm,
    onBlurCouponForm,
    handleDeleteCoupon,
    couponForm,
    setCouponForm,
    showCouponForm,
  } = useManageCoupon();

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((coupon: Coupon) => (
            <CouponCard
              key={coupon.code}
              coupon={coupon}
              handleDeleteCoupon={(couponCode: string) =>
                handleDeleteCoupon(couponCode, { onSuccess: addNotification })
              }
            />
          ))}
          <AddNewCouponCard toggleShowCouponForm={toggleShowCouponForm} />
        </div>

        {showCouponForm && (
          <CouponAddForm
            handleCouponSubmit={handleCouponSubmit}
            onBlurCouponForm={onBlurCouponForm}
            toggleShowCouponForm={toggleShowCouponForm}
            couponForm={couponForm}
            setCouponForm={setCouponForm}
          />
        )}
      </div>
    </section>
  );
};
