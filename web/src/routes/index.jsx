import { Routes, Route } from "react-router";
import BillBoardPage from '../screens/BillBoardPage';
import AdvertisingDetailsPage from '../screens/AdvertisingDetailsPage';
import IssueAdvertisementPage from '../screens/IssueAdvertisementPage';
import DoesNotExistPage from '../screens/DoesNotExistPage';
import AdminPage from '../screens/AdminPage';
import { useIsAdmin } from "../hooks/useAdmin";


const Navigation = () => {
  const isAdmin = useIsAdmin();
  return (
    <Routes>
      <Route exact path='/' element={<BillBoardPage />} />
      <Route path='/getting-started' element={<AdvertisingDetailsPage />} />
      {isAdmin ? <Route path='/admin' element={<AdminPage />} /> : null}
      <Route path='/issue-advertisement' element={<IssueAdvertisementPage />} />
      <Route path='/*' element={<DoesNotExistPage />} />
    </Routes>
  )
}

export default Navigation;