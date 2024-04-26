import { callExternalApi } from "./external-api.service";

const apiServerUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL;

const getAll = async (accessToken, date) => {
  const config = {
    url: `${apiServerUrl}/api/timesheets/timesheet?date=${date}`,
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

const setRows = async (accessToken, updatedRows) => {
  const config = {
    url: `${apiServerUrl}/api/timesheets/timesheet`,
    method: "PUT",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: updatedRows,
  };

  const { data, error } = await callExternalApi({ config });

  return {
    data: data || null,
    error,
  };
};

export default { getAll, setRows };
