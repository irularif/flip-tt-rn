import { useCallback, useEffect, useMemo, useReducer } from "react";
import reducer, { ActionTypes, IAction, IState } from "./reducer";
import Constants from "expo-constants";

const env = Constants.manifest?.extra;

interface FetchOptions extends RequestInit {
  url: string;
  calback?: (oldData: any, newData: any, error?: unknown) => any;
}

interface IFetch<T> extends IState<T> {
  fetch: () => void;
}

const useFetch = <T = undefined>(
  initialData: T,
  { url, calback, ...options }: FetchOptions
): IFetch<T> => {
  const [state, dispatch] = useReducer<
    (state: IState<T>, action: IAction) => IState<T>
  >(reducer, {
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

  const fetchData = useCallback(() => {
    let fetchController: any = new AbortController();
    dispatch({
      type: ActionTypes.UPDATE,
      payload: { isLoading: true, fetchController },
    });
    let _url = "";
    if (!!env?.apiUrl && !url.startsWith("http")) {
      _url = env.apiUrl;
    }
    _url += url;
    try {
      fetch(_url, {
        signal: fetchController.signal,
        ..._options,
      })
        .then((response) => response.json())
        .then((data) => {
          let _data = data;
          if (!!calback) {
            const res = calback(state.data, data);
            if (!!res) {
              _data = res;
            }
          }
          dispatch({
            type: ActionTypes.UPDATE,
            payload: {
              fetchController: null,
              data: _data,
              isLoading: false,
              isError: false,
            },
          });
          fetchController = null;
        })
        .catch((error) => {
          if (!!calback) {
            calback(state.data, undefined, error);
          }
          dispatch({
            type: ActionTypes.UPDATE,
            payload: {
              fetchController: null,
              error,
              isLoading: false,
              isError: true,
            },
          });
        });
      setTimeout(() => {
        if (!!fetchController) {
          fetchController.abort();
        }
      }, 3 * 60 * 1000);
    } catch (error) {
      dispatch({
        type: ActionTypes.UPDATE,
        payload: {
          fetchController: null,
          isError: true,
          isLoading: false,
          error,
        },
      });
      if (!!calback) {
        calback(undefined, error);
      }
    }
  }, [url, _options, state, calback]);

  const abortFetch = useCallback(() => {
    if (!!state.fetchController) {
      state.fetchController.abort();
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
