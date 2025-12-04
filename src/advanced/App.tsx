import { useState } from 'react';
import { Notification } from './features/notification/index';
import { AdminPage } from './pages/admin/AdminPage';
import { ShopPage } from './pages/shop/ShopPage';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Notification />
      {isAdmin ? (
        <AdminPage isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      ) : (
        <ShopPage isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      )}
    </div>
  );
};

export default App;
