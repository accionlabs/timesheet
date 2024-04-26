// import OneSignal from "react-onesignal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";

import {
  initializeUser,
  // updatePushNotification,
} from "../reducers/user.reducer";

export const PageLayout = ({ children }) => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  // const [oneSignalInitialized, setOneSignalInitialized] = useState(false);

  const user = useSelector((state) => state.user);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // useEffect(() => {
  //   if (Object.keys(user).length === 0) {
  //     return;
  //   }

  //   const initializeOneSignal = async () => {
  //     if (!oneSignalInitialized) {
  //       await OneSignal.init({
  //         appId: import.meta.env.VITE_REACT_APP_ONESIGNAL_APP_ID,
  //         allowLocalhostAsSecureOrigin: true,
  //       });
  //       OneSignal.Slidedown.promptPush();
  //       setOneSignalInitialized(true);
  //     }
  //     OneSignal.login(user.uuid);
  //     OneSignal.User.PushSubscription.addEventListener("change", (event) => {
  //       if (event?.current?.optedIn !== user.pushNotification) {
  //         getAccessTokenSilently().then((accessToken) => {
  //           dispatch(
  //             updatePushNotification(accessToken, event?.current?.optedIn)
  //           );
  //         });
  //       }
  //     });
  //   };

  //   initializeOneSignal();
  // }, [user, dispatch, getAccessTokenSilently]);

  useEffect(() => {
    getAccessTokenSilently()
      .then((accessToken) => {
        return dispatch(initializeUser(accessToken, timezone));
      })
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [dispatch, getAccessTokenSilently]);

  return (
    <>
      <main>{children}</main>
    </>
  );
};
