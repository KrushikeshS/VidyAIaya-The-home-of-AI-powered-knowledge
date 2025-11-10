import axios from "axios";
import {useAuth0} from "@auth0/auth0-react";

export const useApi = () => {
  const {getAccessTokenSilently} = useAuth0();

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

  api.interceptors.request.use(async (config) => {
    const tr = await getAccessTokenSilently({
      authorizationParams: {audience: import.meta.env.VITE_AUTH0_AUDIENCE},
      detailedResponse: true,
    });
    const accessToken = typeof tr === "string" ? tr : tr?.access_token;
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  });

  return api;
};
