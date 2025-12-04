import { Notification } from './features/notification/index';
import { AdminPage } from './pages/admin/AdminPage';
import { ShopPage } from './pages/shop/ShopPage';
import { isAdminAtom } from './shared/atoms';
import { useAtomValue } from 'jotai';

const App = () => {
  const isAdmin = useAtomValue(isAdminAtom);

  return (
    <div className="min-h-screen bg-gray-50">
      <Notification />
      {isAdmin ? <AdminPage /> : <ShopPage />}
    </div>
  );
};

export default App;
