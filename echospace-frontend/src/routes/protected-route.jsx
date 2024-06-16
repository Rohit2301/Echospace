import { Navigate, useLocation } from "react-router-dom";
import { useEchospace } from "../controllers/store";
import { Loader } from "../components/layouts/loader/loader";

const ProtectedRoute = ({ children }) => {
  const [{ isLoggedIn, user, isLoading }] = useEchospace();
  const location = useLocation();

  if (isLoggedIn === undefined) {
    return <Loader />;
  }

  return (
    <>
      {isLoading === false &&
        (!!user === false ? (
          <Navigate
            to="/signUp"
            state={{ from: location.pathname }}
            replace={true}
          />
        ) : (
          children
        ))}
    </>
  );
};

export default ProtectedRoute;
