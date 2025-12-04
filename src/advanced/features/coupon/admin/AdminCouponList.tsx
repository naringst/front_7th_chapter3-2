import { useManageCoupon } from '../hooks/useManageCoupon';
import { Coupon } from '../../../../types';
import { AddNewCouponCard } from './AddNewCouponCard';
import { CouponAddForm } from './CouponAddForm';
import { CouponCard } from './CouponCard';
import { useNotification } from '../../notification/hooks/useNotification';

export interface CouponForm {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
}
export const AdminCouponList = () => {
  const { addNotification } = useNotification();
  const {
    coupons,
    addCoupon,
    toggleShowCouponForm,
    handleDeleteCoupon,
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
            onSubmit={(form: CouponForm) => {
              addCoupon(form as Coupon);
              toggleShowCouponForm();
            }}
            onCancel={toggleShowCouponForm}
            onValidationError={(message: string) =>
              addNotification(message, 'error')
            }
          />
        )}
      </div>
    </section>
  );
};
