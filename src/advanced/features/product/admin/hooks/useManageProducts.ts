import { useState, useCallback, SetStateAction, Dispatch } from 'react';
import { ProductWithUI } from '../../hooks/useProduct';
import { ProductForm } from '../AdminProductList';
import { useNotification } from '../../../notification/hooks/useNotification';

export const useManageProducts = ({
  products,
  setProducts,
}: {
  products: ProductWithUI[];
  setProducts: Dispatch<SetStateAction<ProductWithUI[]>>;
}) => {
  const { addNotification } = useNotification();
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  const startEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setShowProductForm(true);
  };

  const handleAddNewProduct = () => {
    setEditingProduct('new');
    setShowProductForm(true);
  };

  const getProductFormData = useCallback(
    (productId: string): ProductForm | undefined => {
      if (productId === 'new') return undefined;
      const product = products.find((p) => p.id === productId);
      if (!product) return undefined;
      return {
        name: product.name,
        price: product.price,
        stock: product.stock,
        description: product.description || '',
        discounts: product.discounts || [],
      };
    },
    [products],
  );

  const addProduct = useCallback(
    (form: ProductForm) => {
      const product: ProductWithUI = {
        ...form,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]);
      addNotification('상품이 추가되었습니다.', 'success');
    },
    [setProducts, addNotification],
  );

  const updateProduct = useCallback(
    (productId: string, form: ProductForm) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...form } : product,
        ),
      );
      addNotification('상품이 수정되었습니다.', 'success');
    },
    [setProducts, addNotification],
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addNotification('상품이 삭제되었습니다.', 'success');
    },
    [setProducts, addNotification],
  );

  return {
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
  };
};
