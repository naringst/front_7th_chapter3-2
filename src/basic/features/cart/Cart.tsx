import { CartItem, Coupon } from '../../../types';
import { Dispatch, SetStateAction } from 'react';
import { ProductWithUI } from '../../App';
import { useManageCoupon } from '../admin/hooks/useManageCoupon';
import { calculateItemTotal, checkCouponAvailability } from './cart.service';
import { useCart } from './hook/useCart';
import { CartTitle } from './components/cart/CartTitle';
import { CartEmptyList } from './components/cart/CartEmptyList';
import { CartItemList } from './components/cart/CartItemList';

export const Cart = ({
  cart,
  setCart,
  addNotification,
  products,
}: {
  products: ProductWithUI[];
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;

  addNotification: (
    message: string,
    type: 'success' | 'error' | 'warning',
  ) => void;
}) => {
  const { coupons, selectedCoupon, setSelectedCoupon, applyCoupon } =
    useManageCoupon();

  const { updateQuantity, removeFromCart, cartTotalPrice, completeOrder } =
    useCart({
      products,
      cart,
      setCart,
      addNotification,
      selectedCoupon,
      setSelectedCoupon,
      applyCoupon: (coupon: Coupon) => {
        applyCoupon(coupon, {
          onSuccess: () => {
            addNotification('쿠폰이 적용되었습니다.', 'success');
          },
        });
      },
    });

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 space-y-4">
        <section className="bg-white rounded-lg border border-gray-200 p-4">
          <CartTitle />

          {cart.length === 0 ? (
            <CartEmptyList />
          ) : (
            <div className="space-y-3">
              {cart.map((item) => {
                const itemTotal = calculateItemTotal(item, cart);
                const originalPrice = item.product.price * item.quantity;

                return (
                  <CartItemList
                    key={item.product.id}
                    item={item}
                    itemTotal={itemTotal}
                    originalPrice={originalPrice}
                    removeFromCart={removeFromCart}
                    updateQuantity={updateQuantity}
                  />
                );
              })}
            </div>
          )}
        </section>

        {cart.length > 0 && (
          <>
            <section className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700">
                  쿠폰 할인
                </h3>
                <button className="text-xs text-blue-600 hover:underline">
                  쿠폰 등록
                </button>
              </div>
              {coupons.length > 0 && (
                <select
                  className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  value={selectedCoupon?.code || ''}
                  onChange={(e) => {
                    const coupon = coupons.find(
                      (c) => c.code === e.target.value,
                    );

                    if (!coupon) return;

                    const isCouponAvailable = checkCouponAvailability(
                      coupon,
                      cartTotalPrice.totalAfterDiscount,
                    );

                    if (coupon && isCouponAvailable) {
                      applyCoupon(coupon, {
                        onSuccess: () => {
                          addNotification('쿠폰이 적용되었습니다.', 'success');
                        },
                      });
                    } else {
                      addNotification(
                        'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.',
                        'error',
                      );
                      setSelectedCoupon(null);
                    }
                  }}
                >
                  <option value="">쿠폰 선택</option>
                  {coupons.map((coupon) => (
                    <option key={coupon.code} value={coupon.code}>
                      {coupon.name} (
                      {coupon.discountType === 'amount'
                        ? `${coupon.discountValue.toLocaleString()}원`
                        : `${coupon.discountValue}%`}
                      )
                    </option>
                  ))}
                </select>
              )}
            </section>

            <section className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">상품 금액</span>
                  <span className="font-medium">
                    {cartTotalPrice.totalBeforeDiscount.toLocaleString()}원
                  </span>
                </div>
                {cartTotalPrice.totalBeforeDiscount -
                  cartTotalPrice.totalAfterDiscount >
                  0 && (
                  <div className="flex justify-between text-red-500">
                    <span>할인 금액</span>
                    <span>
                      -
                      {(
                        cartTotalPrice.totalBeforeDiscount -
                        cartTotalPrice.totalAfterDiscount
                      ).toLocaleString()}
                      원
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-t border-gray-200">
                  <span className="font-semibold">결제 예정 금액</span>
                  <span className="font-bold text-lg text-gray-900">
                    {cartTotalPrice.totalAfterDiscount.toLocaleString()}원
                  </span>
                </div>
              </div>

              <button
                onClick={completeOrder}
                className="w-full mt-4 py-3 bg-yellow-400 text-gray-900 rounded-md font-medium hover:bg-yellow-500 transition-colors"
              >
                {cartTotalPrice.totalAfterDiscount.toLocaleString()}원 결제하기
              </button>

              <div className="mt-3 text-xs text-gray-500 text-center">
                <p>* 실제 결제는 이루어지지 않습니다</p>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};
