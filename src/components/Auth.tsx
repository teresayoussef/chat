import { Navigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

interface Props {
  children: JSX.Element;
}

const Auth = ({ children }: Props): JSX.Element => {
  const user = useUser();

  if (!user) {
    return <Navigate to="/welcome" replace />;
  }

  return children;
};

export default Auth;
