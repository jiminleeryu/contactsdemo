import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import { addLoginCookie, removeLoginCookie } from "../../utils/cookie";
import '../../styles/auth/LoginLogout.css'

export interface ILoginPageProps {
  loggedIn: boolean;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FunctionComponent<ILoginPageProps> = (props) => {
  const auth = getAuth();

  const signInWithGoogle = async () => {
    try {
      const response = await signInWithPopup(auth, new GoogleAuthProvider());
      const userEmail = response.user.email || "";

      if (userEmail.endsWith("@brown.edu") || userEmail.endsWith("@gmail.com")) {
        console.log(response.user.uid);

        addLoginCookie(response.user.uid);
        props.setLogin(true);
      } else {

        await auth.signOut();
        console.log("User not allowed. Signed out.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login-box">
      <button
        aria-label = "google-login"
        onClick={() => signInWithGoogle()}
        disabled={props.loggedIn}
      >
        Sign in
      </button>
    </div>
   
  );
};

const Logout: React.FunctionComponent<ILoginPageProps> = (props) => {
  const signOut = () => {
    removeLoginCookie();
    props.setLogin(false);
  };

  return (
    <div className="logout-box">
      <button
      className="SignOut" onClick={() => signOut()}>
        Sign Out
      </button>
    </div>
  );
};

const LoginLogout: React.FunctionComponent<ILoginPageProps> = (props) => {
  return <>{!props.loggedIn ? <Login {...props} /> : <Logout {...props} />}</>;
};

export default LoginLogout;
