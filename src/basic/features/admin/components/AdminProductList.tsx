import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { ProductWithUI } from '../../product/hook/useProduct';
import { AddNewProductButton } from './AddNewProductButton';
import { ProductAddForm } from './ProductAddForm';
import { AdminProductTable } from './AdminProductTable';
import { useManageProducts } from '../hooks/useManageProducts';

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
  addNotification,
}: {
  products: ProductWithUI[];
  setProducts: Dispatch<SetStateAction<ProductWithUI[]>>;
  addNotification: (message: string, type: 'success' | 'error') => void;
}) => {
  const {
    handleAddNewProduct,
    startEditProduct,
    deleteProduct,
    editingProduct,
    productForm,
    setProductForm,
    setShowProductForm,
    setEditingProduct,
    handleProductSubmit,
    showProductForm,
  } = useManageProducts({ products, setProducts, addNotification });

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
          productForm={productForm}
          setProductForm={setProductForm}
          setShowProductForm={setShowProductForm}
          addNotification={addNotification}
          setProducts={setProducts}
          setEditingProduct={setEditingProduct}
          handleProductSubmit={handleProductSubmit}
        />
      )}
    </section>
  );
};
