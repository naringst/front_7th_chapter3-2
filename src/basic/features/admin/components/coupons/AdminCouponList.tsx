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
    addCoupon,
    deleteCoupon,
    coupons,
    selectedCoupon,
    setSelectedCoupon,
  } = useManageCoupon();

  const [showCouponForm, setShowCouponForm] = useState(false);

  const [couponForm, setCouponForm] = useState<CouponForm>({
    name: '',
    code: '',
    discountType: 'amount',
    discountValue: 0,
  });

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon(couponForm);
    setCouponForm({
      name: '',
      code: '',
      discountType: 'amount',
      discountValue: 0,
    });
    setShowCouponForm(false);
  };

  const toggleShowCouponForm = () => {
    setShowCouponForm((prev) => !prev);
  };

  const onBlurCouponForm = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    if (couponForm.discountType === 'percentage') {
      if (value > 100) {
        addNotification('할인율은 100%를 초과할 수 없습니다', 'error');
        setCouponForm({
          ...couponForm,
          discountValue: 100,
        });
      } else if (value < 0) {
        setCouponForm({
          ...couponForm,
          discountValue: 0,
        });
      }
    } else {
      if (value > 100000) {
        addNotification('할인 금액은 100,000원을 초과할 수 없습니다', 'error');
        setCouponForm({
          ...couponForm,
          discountValue: 100000,
        });
      } else if (value < 0) {
        setCouponForm({
          ...couponForm,
          discountValue: 0,
        });
      }
    }
  };

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
