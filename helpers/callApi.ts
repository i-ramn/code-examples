import {
  ApiRoute,
  EmailValidatorAPIRoute,
  TykBrokerApiRoute,
} from "../constants";

type Body = FormData | string | null;

export interface IAPIParams {
  baseUrl?: string;
  route: ApiRoute | EmailValidatorAPIRoute | TykBrokerApiRoute;
  method?: "GET" | "POST" | "PUT" | "HEAD";
  body?: Body;
  contentType?: string;
  excludeContentType?: boolean;
  additionalHeaders?: Record<string, string>;
}

const { REACT_APP_TYKBROKER_SERVER_URL = "", IS_STAGING = false } = process.env;

const handleError = (error: ErrorOptions | undefined | unknown) => {
  return new Error("error", error || undefined);
};

/** Used to determine whether to pass in additional headers for endpoints that may not be separated in two URLs, (e.g. staging.endpoint.com and endpoint.com). These headers would be used by the endpoint to indicate that the "staging" version should be accessed */
const getAdditionalHeadersForStaging = (baseURL: string) => {
  // TODO: add additional conditions for other endpoints. Currently only need it for Edgar's Bitrix server
  if (baseURL === REACT_APP_TYKBROKER_SERVER_URL) {
    return {
      Environment: "staging",
    };
  }
  return {};
};

export const callApi = async <T>(params: IAPIParams): Promise<T> => {
  let headers = {
    ...(!params.excludeContentType
      ? { "Content-Type": params.contentType || "application/json" }
      : {}),
    ...params.additionalHeaders,
  };

  const baseURL = params.baseUrl
    ? params.baseUrl
    : REACT_APP_TYKBROKER_SERVER_URL;

  if (IS_STAGING) {
    headers = { ...headers, ...getAdditionalHeadersForStaging(baseURL) };
  }

  const method = params.method || "GET";
  const body = params.body || null;

  try {
    const response = await fetch(`${baseURL}${params.route}`, {
      method,
      headers,
      body,
    });

    if (!response.ok) {
      handleError(response);
    }

    return await response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);

    throw handleError(error);
  }
};
