export enum ActionTypes {
  UPDATE,
}
export interface IState<T = undefined> {
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

const reducer = <T>(state: IState<T>, action: IAction) => {
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
