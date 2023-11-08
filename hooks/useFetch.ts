export interface UseLazyFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface UseFetchOptions {
  skip?: boolean;
}

export interface UseFetchResult<T> extends UseLazyFetchResult<T> {
  resend: () => Promise<T>;
}

export type SendRequestFunction<T> = (
  url?: string,
  options?: RequestInit
) => Promise<T>;

export const useLazyFetch = <T>(
  url: string,
  options?: RequestInit
): [SendRequestFunction<T>, UseLazyFetchResult<T>] => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { getToken } = useUnifiedLogin();

  const sendRequest = useCallback(
    (requestUrl?: string, requestOptions?: RequestInit) => {
      setLoading(true);

      return getToken()
        .then((token) => {
          const fetchOptions: RequestInit = {
            ...options,
            ...requestOptions,
            headers: {
              ...options?.headers,
              ...requestOptions?.headers,
              Authorization: `${AUTHORIZATION_TOKEN_TYPE} ${token}`,
            },
          };

          return fetch(requestUrl ?? url, fetchOptions);
        })
        .then((response) => response.json())
        .then((responseData) => {
          setData(responseData);

          return responseData;
        })
        .catch((responseError) => setError(responseError))
        .finally(() => setLoading(false));
    },
    [url, options, getToken]
  );

  const result: UseLazyFetchResult<T> = useMemo(
    () => ({ data, loading, error }),
    [data, loading, error]
  );

  return [sendRequest, result];
};

export const useFetch = <T>(
  url: string,
  requestInit?: RequestInit,
  options?: UseFetchOptions
): UseFetchResult<T> => {
  const isRequestInProgress = useRef(false);
  const urlRef = useRef(url);
  const [sendRequest, result] = useLazyFetch<T>(url, requestInit);

  useEffect(() => {
    const isRequestFinished = result.data || result.error;
    const isUrlChanged = urlRef.current !== url;

    if (
      !isRequestInProgress.current &&
      (!isRequestFinished || isUrlChanged) &&
      !options?.skip
    ) {
      isRequestInProgress.current = true;
      urlRef.current = url;
      sendRequest().finally(() => {
        isRequestInProgress.current = false;
      });
    }
  }, [isRequestInProgress, sendRequest, result, options?.skip, url]);

  return {
    ...result,
    resend: sendRequest,
  };
};
