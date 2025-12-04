import { useCallback } from 'react';
import { CartItem, Product } from '../../../../types';
import { calculateCartTotalPrice } from '../service/cart.service';
import { applyCouponDiscount } from '../../coupon/services/coupon.service';
import { ProductWithUI } from '../../product/hooks/useProduct';
import { useNotification } from '../../notification/hooks/useNotification';
import {
  cartWithStorageAtom,
  totalCartItemCountAtom,
} from '../atoms/cart.atom';
import { useAtom, useAtomValue } from 'jotai';
import { selectedCouponAtom } from '../../coupon/atoms/coupon.atom';

export const useCart = ({ products }: { products: ProductWithUI[] }) => {
  const { addNotification } = useNotification();
  const [cart, setCart] = useAtom(cartWithStorageAtom);
  const totalItemCount = useAtomValue(totalCartItemCountAtom);
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);
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

  const getRemainingStock = (cart: CartItem[], product: Product): number => {
    const cartItem = cart.find((item) => item.product.id === product.id);
    const remaining = product.stock - (cartItem?.quantity || 0);

    return remaining;
  };

  const addToCart = useCallback(
    (
      product: ProductWithUI,
      onSuccess?: (
        message: string,
        type: 'success' | 'error' | 'warning',
      ) => void,
    ) => {
      const remainingStock = getRemainingStock(cart, product);
      if (remainingStock <= 0) {
        onSuccess?.('재고가 부족합니다!', 'error');
        return;
      }

      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (item) => item.product.id === product.id,
        );

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;

          if (newQuantity > product.stock) {
            onSuccess?.(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
            return prevCart;
          }

          return prevCart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: newQuantity }
              : item,
          );
        }

        return [...prevCart, { product, quantity: 1 }];
      });

      onSuccess?.('장바구니에 담았습니다', 'success');
    },
    [cart, getRemainingStock],
  );

  return {
    updateQuantity,
    removeFromCart,
    cartTotalPrice,
    completeOrder,
    cart,
    setCart,
    totalItemCount,
    getRemainingStock,
    addToCart,
  };
};
