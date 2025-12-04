import { ProductList } from '../../features/product/ProductList';
import { Cart } from '../../features/cart/Cart';
import { Header } from '../../shared/component/Header';
import { useProduct } from '../../features/product/hooks/useProduct';
import { useSearchProduct } from '../../features/product/hooks/useSearchProduct';
import { useCart } from '../../features/cart/hooks/useCart';

export const ShopPage = () => {
  const { products } = useProduct();
  const { debouncedSearchTerm, searchTerm, setSearchTerm } = useSearchProduct();

  const {
    cart,
    totalItemCount,
    cartTotalPrice,
    updateQuantity,
    removeFromCart,
    completeOrder,
    addToCart,
    getRemainingStock,
  } = useCart({
    products,
  });

  return (
    <>
      <Header
        search={{
          searchInput: (
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <ProductList
            products={products}
            search={{
              debouncedSearchTerm,
            }}
            cartActions={{
              addToCart,
              getRemainingStock: (product) => getRemainingStock(cart, product),
            }}
          />

          <Cart
            cart={{
              items: cart,
              totalPrice: cartTotalPrice,
              totalItemCount,
            }}
            cartActions={{
              updateQuantity,
              removeFromCart,
              completeOrder,
            }}
          />
        </div>
      </main>
    </>
  );
};
