import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from "./pages/Home";
import { Login } from './pages/Login';
import { ErrorPage } from './pages/ErrorPage';
import { AddState } from './pages/AddState';
import { Logout } from './pages/Logout';
import { City } from './pages/City';
import { EditState } from './pages/EditState';
import { Wearhouse } from './pages/Wearhouse';
import { AddCity } from './pages/AddCity';
import { AddWearhouse } from './pages/AddWearhouse';
import { EditCity } from './pages/EditCity';
import { EditWearhouse } from './pages/EditWearhouse';
import ProtectedRoute from './ProtectedRoute';
import { ForgotPassword } from './pages/ForgotPassword';
import { State } from './pages/State';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/state" element={<State />} />
          <Route path="/add-state" element={<AddState />} />
          <Route path="/city" element={<City />} />
          <Route path="/edit-state/:id" element={<EditState/>} />
          <Route path="/edit-city/:id" element={<EditCity />} />
          <Route path="/edit-wearhouse/:id" element={<EditWearhouse />} />
          <Route path="/add-city" element={<AddCity />} />
          <Route path="/add-wearhouse" element={<AddWearhouse />} />
          <Route path="/wearhouse" element={<Wearhouse />} />
          <Route path="/logout" element={<Logout />} />
        </Route>
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
