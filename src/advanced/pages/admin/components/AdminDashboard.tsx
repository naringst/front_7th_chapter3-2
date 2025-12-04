import { Dispatch, SetStateAction, useState } from 'react';
import { ProductWithUI } from '../../../features/product/hooks/useProduct';
import { AdminTitle } from './AdminTitle';
import { AdminViewTab } from './AdminViewTab';
import { AdminProductList } from '../../../features/product/admin/AdminProductList';
import { AdminCouponList } from '../../../features/coupon/admin/AdminCouponList';

export const AdminDashboard = ({
  products,
  setProducts,
}: {
  products: ProductWithUI[];
  setProducts: Dispatch<SetStateAction<ProductWithUI[]>>;
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
        <AdminProductList products={products} setProducts={setProducts} />
      ) : (
        <AdminCouponList />
      )}
    </div>
  );
};
