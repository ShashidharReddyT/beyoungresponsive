import { Navigate } from "react-router-dom";
import { useAuth } from "./Context/UserProvider";

function ProtectedComponent(props) {
  const { isUserLoggedIn: isAuth } = useAuth();

  console.log("ProtectedComponent isUserLoggedIn", isAuth);

  const { children } = props;

  if (!isAuth) {
    return <Navigate to={"/"} />;
  } else {
    return children;
  }
}

export default ProtectedComponent;
