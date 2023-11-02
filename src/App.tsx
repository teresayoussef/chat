import './App.scss';
import Welcome from './pages/Welcome';
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Auth from "./components/Auth";
import UnAuth from "./components/UnAuth";
import { UserProvider } from "./hooks/useUser";
import { signOut } from "./api/auth";
import Home from './pages/Home';

const App = (): JSX.Element => {

  return (
    <UserProvider>
      <Routes>
        <Route
          element={
            <UnAuth>
              <Outlet/>
            </UnAuth>
          }
        >
          <Route path="/welcome" element={<Welcome />} />
        </Route>
        <Route
            element={
              <Auth>
                <Outlet/>
              </Auth>
            }
          >
            <Route path="/" element={<Home/>} />
          </Route>
      </Routes>
    </UserProvider>
  );
};

export default App;
