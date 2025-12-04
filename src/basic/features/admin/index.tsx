import { Dispatch, SetStateAction, useState } from 'react';
import { ProductWithUI } from '../product/hook/useProduct';
import { AdminTitle } from './components/AdminTitle';
import { AdminViewTab } from './components/AdminViewTab';
import { AdminProductList } from '../product/admin/AdminProductList';
import { AdminCouponList } from './components/coupons/AdminCouponList';

export const Admin = ({
  products,
  setProducts,
  addNotification,
}: {
  products: ProductWithUI[];
  setProducts: Dispatch<SetStateAction<ProductWithUI[]>>;
  addNotification: (
    message: string,
    type: 'error' | 'success' | 'warning',
  ) => void;
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>(
    'products',
  );

  const onChangeActiveTab = (tab: 'products' | 'coupons') => {
    switch (tab) {
      case 'products':
        setActiveTab('products');
        break;
      case 'coupons':
        setActiveTab('coupons');
        break;
    }
  };
  return (
    <div className="max-w-6xl mx-auto">
      <AdminTitle
        title={'관리자 대시보드'}
        description={'상품과 쿠폰을 관리할 수 있습니다'}
      />

      <AdminViewTab
        activeTab={activeTab}
        onChangeActiveTab={onChangeActiveTab}
      />

      {activeTab === 'products' ? (
        <AdminProductList
          products={products}
          setProducts={setProducts}
          addNotification={addNotification}
        />
      ) : (
        <AdminCouponList addNotification={addNotification} />
      )}
    </div>
  );
};
