export enum ActionTypes {
  UPDATE,
}
interface IState<T> {
  isLoading: boolean;
  isError: boolean;
  data: T;
  fetchController: AbortController | null;
  error: unknown | null;
}

export interface IAction {
  type: ActionTypes;
  payload?: any;
}

const reducer = <T extends unknown>(state: IState<T>, action: IAction) => {
  switch (action.type) {
    case ActionTypes.UPDATE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
