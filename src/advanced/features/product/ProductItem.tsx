import { formatPrice } from '../../shared/utils/priceUtils';
import { useNotification } from '../notification/hooks/useNotification';
import { ProductWithUI } from './hooks/useProduct';

const ProductImage = () => {
  return (
    <div className="aspect-square bg-gray-100 flex items-center justify-center">
      <svg
        className="w-24 h-24 text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  );
};

const ProductLabel = ({ title, color }: { title: string; color: string }) => {
  return (
    <span
      className={`absolute top-2 right-2 bg-${color}-500 text-white text-xs px-2 py-1 rounded`}
    >
      {title}
    </span>
  );
};

const ProductInfo = ({
  product,
  remainingStock,
}: {
  product: ProductWithUI;
  remainingStock: number;
}) => {
  return (
    <>
      <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
      {product.description && (
        <p className="text-sm text-gray-500 mb-2 line-clamp-2">
          {product.description}
        </p>
      )}

      {/* 가격 정보 */}
      <div className="mb-3">
        <p className="text-lg font-bold text-gray-900">
          {formatPrice(product.price)}
        </p>
        {product.discounts.length > 0 && (
          <p className="text-xs text-gray-500">
            {product.discounts[0].quantity}개 이상 구매시 할인
            {Math.round(product.discounts[0].rate * 100)}%
          </p>
        )}
      </div>

      {/* 재고 상태 */}
      <StockStatus remainingStock={remainingStock} />
    </>
  );
};
const StockStatus = ({ remainingStock }: { remainingStock: number }) => {
  return (
    <div className="mb-3">
      {remainingStock <= 5 && remainingStock > 0 && (
        <p className="text-xs text-red-600 font-medium">
          품절임박! {remainingStock}개 남음
        </p>
      )}
      {remainingStock > 5 && (
        <p className="text-xs text-gray-500">재고 {remainingStock}개</p>
      )}
    </div>
  );
};

const CartButton = ({
  product,
  remainingStock,
  addToCart,
}: {
  product: ProductWithUI;
  remainingStock: number;
  addToCart: (
    product: ProductWithUI,
    onSuccess?: (
      message: string,
      type: 'success' | 'error' | 'warning',
    ) => void,
  ) => void;
}) => {
  const { addNotification } = useNotification();
  return (
    <button
      onClick={() =>
        addToCart(product, (message, type) => {
          addNotification(message, type);
        })
      }
      disabled={remainingStock <= 0}
      className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
        remainingStock <= 0
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-gray-900 text-white hover:bg-gray-800'
      }`}
    >
      {remainingStock <= 0 ? '품절' : '장바구니 담기'}
    </button>
  );
};

export const ProductItem = ({
  product,
  remainingStock,
  addToCart,
}: {
  product: ProductWithUI;
  remainingStock: number;
  addToCart: (
    product: ProductWithUI,
    onSuccess?: (
      message: string,
      type: 'success' | 'error' | 'warning',
    ) => void,
  ) => void;
}) => {
  return (
    <div
      key={product.id}
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative">
        <ProductImage />
        {product.isRecommended && <ProductLabel title="BEST" color="red" />}
        {product.discounts.length > 0 && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
            ~{Math.max(...product.discounts.map((d) => d.rate)) * 100}%
          </span>
        )}
      </div>

      <div className="p-4">
        {/* 상품 정보 */}
        <ProductInfo product={product} remainingStock={remainingStock} />

        {/* 장바구니 버튼 */}
        <CartButton
          product={product}
          remainingStock={remainingStock}
          addToCart={addToCart}
        />
      </div>
    </div>
  );
};
