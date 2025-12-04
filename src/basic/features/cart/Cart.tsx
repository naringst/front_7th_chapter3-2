import { CouponSection } from './components/coupon/CouponSection';
import { PaymentSection } from './components/payment/PaymentSection';
import { CartSection } from './components/cart/CartSection';
import { CartItem, Coupon } from '../../../types';
import { Dispatch, SetStateAction } from 'react';

export interface CartProps {
  cart: {
    items: CartItem[];
    totalPrice: { totalBeforeDiscount: number; totalAfterDiscount: number };
    totalItemCount: number;
  };
  cartActions: {
    updateQuantity: (productId: string, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    completeOrder: () => void;
  };
  coupon: {
    selectedCoupon: Coupon | null;
    setSelectedCoupon: Dispatch<SetStateAction<Coupon | null>>;
    coupons: Coupon[];
    applyCoupon: (
      coupon: Coupon,
      { onSuccess }: { onSuccess?: () => void },
    ) => void;
  };
}

export const Cart = ({ cart, cartActions, coupon }: CartProps) => {
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 space-y-4">
        <CartSection
          cart={cart.items}
          removeFromCart={cartActions.removeFromCart}
          updateQuantity={cartActions.updateQuantity}
        />

        {cart.items.length > 0 && (
          <>
            <CouponSection
              selectedCoupon={coupon.selectedCoupon}
              setSelectedCoupon={coupon.setSelectedCoupon}
              coupons={coupon.coupons}
              cartTotalPrice={cart.totalPrice}
              applyCoupon={coupon.applyCoupon}
            />

            <PaymentSection
              cartTotalPrice={cart.totalPrice}
              completeOrder={cartActions.completeOrder}
            />
          </>
        )}
      </div>
    </div>
  );
};
