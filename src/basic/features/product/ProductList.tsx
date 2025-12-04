import { Product } from '../../../types';
import { ProductItem } from './ProductItem';

export interface ProductListProps {
  products: Product[];
  search: {
    debouncedSearchTerm: string;
  };
  cartActions: {
    addToCart: (
      product: Product,
      onSuccess?: (
        message: string,
        type: 'success' | 'error' | 'warning',
      ) => void,
    ) => void;
    getRemainingStock: (product: Product) => number;
  };
  notification: {
    addNotification: (
      message: string,
      type: 'success' | 'error' | 'warning',
    ) => void;
  };
}

const ProductListHeader = ({
  productsTotalCount,
}: {
  productsTotalCount: number;
}) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
      <div className="text-sm text-gray-600">
        총 {productsTotalCount}개 상품
      </div>
    </div>
  );
};

const ProductListEmpty = ({
  debouncedSearchTerm,
}: {
  debouncedSearchTerm: string;
}) => {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500">
        "{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.
      </p>
    </div>
  );
};

export const ProductList = ({
  products,
  search,
  cartActions,
  notification,
}: ProductListProps) => {
  const filteredProducts = search.debouncedSearchTerm
    ? products.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(search.debouncedSearchTerm.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(search.debouncedSearchTerm.toLowerCase())),
      )
    : products;

  return (
    <div className="lg:col-span-3">
      <ProductListHeader productsTotalCount={products.length} />
      <section>
        {filteredProducts.length === 0 ? (
          <ProductListEmpty debouncedSearchTerm={search.debouncedSearchTerm} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => {
              const remainingStock = cartActions.getRemainingStock(product);
              return (
                <ProductItem
                  key={product.id}
                  product={product}
                  remainingStock={remainingStock}
                  addToCart={cartActions.addToCart}
                  addNotification={notification.addNotification}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
