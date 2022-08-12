import { useCallback, useEffect, useMemo, useReducer } from "react";
import reducer, { ActionTypes } from "./reducer";
import Constants from "expo-constants";

const env = Constants.manifest?.extra;

interface FetchOptions extends RequestInit {
  url: string;
  calback?: (data: any, error?: unknown) => any;
}

const useFetch = <T = unknown>(
  initialData: T,
  { url, calback, ...options }: FetchOptions
) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoading: false,
    isError: false,
    data: initialData,
    fetchController: null,
    error: null,
  });

  const _options = useMemo(
    () =>
      Object.assign(
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
        options,
        {}
      ),
    [options]
  );

  const fetchData = async () => {
    let abortController: any = new AbortController();
    dispatch({
      type: ActionTypes.UPDATE,
      payload: { isLoading: true, abortController },
    });
    let _url = "";
    if (!!env?.apiUrl && !url.startsWith("http")) {
      _url = env.apiUrl;
    }
    _url += url;
    try {
      fetch(_url, {
        signal: abortController.signal,
        ..._options,
      })
        .then((response) => response.json())
        .then((data) => {
          let _data = data;
          if (!!calback) {
            const res = calback(data);
            if (!!res) {
              _data = res;
            }
          }
          dispatch({
            type: ActionTypes.UPDATE,
            payload: {
              abortController: null,
              data: _data,
              isLoading: false,
              isError: false,
            },
          });
          abortController = null;
        })
        .catch((error) => {
          if (!!calback) {
            calback(undefined, error);
          }
          dispatch({
            type: ActionTypes.UPDATE,
            payload: {
              abortController: null,
              error,
              isLoading: false,
              isError: true,
            },
          });
        });
      setTimeout(() => {
        if (!!abortController) {
          abortController.abort();
        }
      }, 3 * 60 * 1000);
    } catch (error) {
      dispatch({
        type: ActionTypes.UPDATE,
        payload: {
          abortController: null,
          isError: true,
          isLoading: false,
          error,
        },
      });
      if (!!calback) {
        calback(undefined, error);
      }
    }
  };

  const abortFetch = useCallback(() => {
    if (!!state.abortController) {
      state.abortController.abort();
    }
  }, [state]);

  useEffect(() => {
    return abortFetch;
  }, []);

  return {
    ...state,
    fetch: fetchData,
  };
};

export default useFetch;
