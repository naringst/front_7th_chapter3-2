import { useState } from 'react';
import { useNotification } from './shared/hooks/useNotification';
import { Admin } from './features/admin';
import { Header } from './shared/component/Header';
import { ProductList } from './features/product/ProductList';
import { Cart } from './features/cart/Cart';
import { useProduct } from './features/product/hook/useProduct';
import { useSearchProduct } from './features/product/hook/useSearchProduct';
import { useCart } from './features/cart/hook/useCart';
import { useManageCoupon } from './features/admin/hooks/useManageCoupon';
import { NotificationSection } from './features/notification/NotificationSection';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const { products, setProducts } = useProduct();
  const { notifications, addNotification, closeNotification } =
    useNotification();
  const { searchTerm, setSearchTerm, debouncedSearchTerm } = useSearchProduct();
  const { coupons, applyCoupon, selectedCoupon, setSelectedCoupon } =
    useManageCoupon();

  const {
    cart,
    setCart,
    totalItemCount,
    cartTotalPrice,
    updateQuantity,
    removeFromCart,
    completeOrder,
    addToCart,
    getRemainingStock,
  } = useCart({
    products,
    addNotification,
    selectedCoupon,
    setSelectedCoupon,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationSection
        notifications={notifications}
        closeNotification={closeNotification}
      />
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
              addNotification={addNotification}
            />

            <Cart
              cart={cart}
              setCart={setCart}
              cartTotalPrice={cartTotalPrice}
              totalItemCount={totalItemCount}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              completeOrder={completeOrder}
              selectedCoupon={selectedCoupon}
              setSelectedCoupon={setSelectedCoupon}
              coupons={coupons}
              applyCoupon={applyCoupon}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
