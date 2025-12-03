import { Dispatch, SetStateAction, useCallback } from 'react';
import { ProductWithUI } from '../../../App';
import { CartItem, Coupon } from '../../../../types';
import { applyCouponDiscount, calculateCartTotalPrice } from '../cart.service';

export const useCart = ({
  products,
  cart,
  setCart,
  addNotification,
  selectedCoupon,
  setSelectedCoupon,
}: {
  products: ProductWithUI[];
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;

  addNotification: (
    message: string,
    type: 'success' | 'error' | 'warning',
  ) => void;

  selectedCoupon: Coupon | null;
  setSelectedCoupon: Dispatch<SetStateAction<Coupon | null>>;

  applyCoupon: (coupon: Coupon) => void;
}) => {
  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        addNotification(`재고는 ${maxStock}개까지만 있습니다.`, 'error');
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item,
        ),
      );
    },
    [cart, setCart, addNotification],
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId),
    );
  }, []);

  const calculateCartTotal = (
    cart: CartItem[],
  ): {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  } => {
    const { totalBeforeDiscount, totalAfterDiscount } =
      calculateCartTotalPrice(cart);

    if (selectedCoupon) {
      return applyCouponDiscount(selectedCoupon, {
        totalBeforeDiscount,
        totalAfterDiscount,
      });
    }

    return { totalBeforeDiscount, totalAfterDiscount };
  };

  const cartTotalPrice = calculateCartTotal(cart);

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      'success',
    );
    setCart([]);
    setSelectedCoupon(null);
  }, [addNotification]);

  return {
    updateQuantity,
    removeFromCart,
    cartTotalPrice,
    completeOrder,
  };
};
