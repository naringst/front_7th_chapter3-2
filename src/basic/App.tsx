import { useState, useCallback, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { useNotification } from './shared/hooks/useNotification';
import { Admin } from './features/admin';
import { Header } from './shared/component/Header';
import { ProductList } from './features/product/ProductList';
import { Cart } from './features/cart/Cart';
import { Notification } from './features/notification';
import { ProductWithUI, useProduct } from './features/product/hook/useProduct';

export const getRemainingStock = (
  cart: CartItem[],
  product: Product,
): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const remaining = product.stock - (cartItem?.quantity || 0);

  return remaining;
};

const App = () => {
  // 전체 페이지 단위에서 관리가 필요한 것과, 각 컴포넌트 내부에서 로직 처리가 필요한 내용을 나눠보자!
  const { products, setProducts } = useProduct();

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // 이건 전역 관리 필요 => 이거 설정에 따라 페이지 레이아웃이 달라짐
  const [isAdmin, setIsAdmin] = useState(false);

  // 이건 좀 애매한데.. 헤더에서 검색하고 그 내용이 product List에 반영되어야 함... 흠 ... hook으로 분리?
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // 알림은 전역에서 필요
  const { notifications, addNotification, closeNotification } =
    useNotification();

  const [totalItemCount, setTotalItemCount] = useState(0);

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cart]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStock(cart, product);
      if (remainingStock <= 0) {
        addNotification('재고가 부족합니다!', 'error');
        return;
      }

      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (item) => item.product.id === product.id,
        );

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;

          if (newQuantity > product.stock) {
            addNotification(
              `재고는 ${product.stock}개까지만 있습니다.`,
              'error',
            );
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

      addNotification('장바구니에 담았습니다', 'success');
    },
    [cart, addNotification, getRemainingStock],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {notifications.map((notif) => (
            <Notification
              key={notif.id}
              notification={notif}
              closeNotification={closeNotification}
            />
          ))}
        </div>
      )}
      <Header
        admin={{
          isAdmin,
          setIsAdmin,
        }}
        cart={{
          totalCartItemCount: totalItemCount,
        }}
        search={{
          searchInput: !isAdmin && (
            <div className="ml-8 flex-1 max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="상품 검색..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          ),
        }}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <Admin
            products={products}
            setProducts={setProducts}
            addNotification={addNotification}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <ProductList
              products={products}
              debouncedSearchTerm={debouncedSearchTerm}
              addToCart={addToCart}
              getRemainingStock={(product) => getRemainingStock(cart, product)}
            />

            <Cart
              products={products}
              cart={cart}
              setCart={setCart}
              addNotification={addNotification}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
