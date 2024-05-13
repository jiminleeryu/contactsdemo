import { useEffect, useState } from "react";
import { getLoginCookie } from "../../utils/cookie";
import LoginLogout from "./LoginLogout";

interface AuthRouteProps {
  gatedContent: React.ReactNode;
}

function AuthRoute(props: AuthRouteProps) {
  const [loggedIn, setLogin] = useState<boolean>(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const isUserLoggedIn = getLoginCookie() !== undefined;
      setLogin(isUserLoggedIn);
    };
    checkLoginStatus();
  }, []);

  return (
    <>{!loggedIn && <h3>Sign in to View Contacts</h3>}
      <LoginLogout loggedIn={loggedIn} setLogin={setLogin} />
      {loggedIn ? props.gatedContent : null}
    </>
  );
}

export default AuthRoute;
