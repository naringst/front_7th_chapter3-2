import { Dispatch, SetStateAction } from 'react';
import { ProductWithUI } from '../hooks/useProduct';
import { AddNewProductButton } from './AddNewProductButton';
import { ProductAddForm } from './ProductAddForm';
import { AdminProductTable } from './AdminProductTable';
import { useManageProducts } from './hooks/useManageProducts';
import { useNotification } from '../../notification/hooks/useNotification';

export interface ProductForm {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
}

export const AdminProductList = ({
  products,
  setProducts,
}: {
  products: ProductWithUI[];
  setProducts: Dispatch<SetStateAction<ProductWithUI[]>>;
}) => {
  const {
    handleAddNewProduct,
    startEditProduct,
    deleteProduct,
    editingProduct,
    getProductFormData,
    addProduct,
    updateProduct,
    setShowProductForm,
    setEditingProduct,
    showProductForm,
  } = useManageProducts({ products, setProducts });

  const { addNotification } = useNotification();
  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <AddNewProductButton onClick={handleAddNewProduct} />
        </div>
      </div>
      <AdminProductTable
        products={products}
        startEditProduct={startEditProduct}
        deleteProduct={deleteProduct}
      />

      {showProductForm && (
        <ProductAddForm
          editingProduct={editingProduct}
          initialData={
            editingProduct ? getProductFormData(editingProduct) : undefined
          }
          onSubmit={(form) => {
            if (editingProduct && editingProduct !== 'new') {
              updateProduct(editingProduct, form);
            } else {
              addProduct(form);
            }
            setEditingProduct(null);
            setShowProductForm(false);
          }}
          onCancel={() => {
            setEditingProduct(null);
            setShowProductForm(false);
          }}
          onValidationError={(message) => addNotification(message, 'error')}
        />
      )}
    </section>
  );
};
