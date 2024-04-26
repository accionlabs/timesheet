import { callExternalApi } from "./external-api.service";

const apiServerUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL;

const getUser = async (accessToken, timezone) => {
  const config = {
    url: `${apiServerUrl}/api/users/user?timezone=${timezone}`,
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const { data, error } = await callExternalApi({ config });

  return {
    data: data || null,
    error,
  };
};

const setPushNotification = async (accessToken, pushNotification) => {
  const config = {
    url: `${apiServerUrl}/api/users/push-notification`,
    method: "PUT",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: { pushNotification },
  };

  const { error } = await callExternalApi({ config });

  return {
    error,
  };
};

export default { getUser, setPushNotification };
