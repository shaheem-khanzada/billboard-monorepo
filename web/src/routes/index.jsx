import { Routes, Route } from "react-router";
import BillBoardPage from '../components/BillBoardPage';
import AdvertisingDetailsPage from '../components/AdvertisingDetailsPage';
import IssueAdvertisementPage from '../components/IssueAdvertisementPage';
import DoesNotExistPage from '../components/DoesNotExistPage';
import AdminPage from '../components/AdminPage';
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