import { Navigate, useLocation } from "react-router-dom";
import { useEchospace } from "../controllers/store";

const ProtectedRoute = ({ children }) => {
  const [{ user, isLoading }] = useEchospace();
  const location = useLocation();
  return (
    <>
      {/* {isLoading === false &&
        (!!user === false ? (
          <Navigate
            to="/signUp"
            state={{ from: location.pathname }}
            replace={true}
          />
        ) : (
          children
        ))} */}
      {children}
    </>
  );
};

export default ProtectedRoute;
