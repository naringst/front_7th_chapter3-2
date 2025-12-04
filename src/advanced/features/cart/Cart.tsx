import { CouponSection } from '../coupon/components/CouponSection';
import { PaymentSection } from './components/payment/PaymentSection';
import { CartSection } from './components/cart/CartSection';
import { CartItem } from '../../../types';

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
}

export const Cart = ({ cart, cartActions }: CartProps) => {
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
            <CouponSection cartTotalPrice={cart.totalPrice} />

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
