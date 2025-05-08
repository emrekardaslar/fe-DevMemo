// Standup model
export interface Standup {
  date: string;
  yesterday: string;
  today: string;
  blockers: string;
  isBlockerResolved: boolean;
  tags: string[];
  mood: number;
  productivity: number;
  isHighlight: boolean;
  createdAt: string;
  updatedAt: string;
}

// Type for creating a new standup
export type CreateStandupDto = Omit<Standup, 'createdAt' | 'updatedAt'> & {
  mood?: number;
  productivity?: number;
};

// Type for updating an existing standup
export type UpdateStandupDto = Partial<Standup>;

// State
export interface StandupState {
  standups: Standup[];
  currentStandup: Standup | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Action Types
export enum StandupActionTypes {
  FETCH_STANDUPS_REQUEST = 'FETCH_STANDUPS_REQUEST',
  FETCH_STANDUPS_SUCCESS = 'FETCH_STANDUPS_SUCCESS',
  FETCH_STANDUPS_FAILURE = 'FETCH_STANDUPS_FAILURE',
  
  FETCH_STANDUP_REQUEST = 'FETCH_STANDUP_REQUEST',
  FETCH_STANDUP_SUCCESS = 'FETCH_STANDUP_SUCCESS',
  FETCH_STANDUP_FAILURE = 'FETCH_STANDUP_FAILURE',
  
  CREATE_STANDUP_REQUEST = 'CREATE_STANDUP_REQUEST',
  CREATE_STANDUP_SUCCESS = 'CREATE_STANDUP_SUCCESS',
  CREATE_STANDUP_FAILURE = 'CREATE_STANDUP_FAILURE',
  
  UPDATE_STANDUP_REQUEST = 'UPDATE_STANDUP_REQUEST',
  UPDATE_STANDUP_SUCCESS = 'UPDATE_STANDUP_SUCCESS',
  UPDATE_STANDUP_FAILURE = 'UPDATE_STANDUP_FAILURE',
  
  DELETE_STANDUP_REQUEST = 'DELETE_STANDUP_REQUEST',
  DELETE_STANDUP_SUCCESS = 'DELETE_STANDUP_SUCCESS',
  DELETE_STANDUP_FAILURE = 'DELETE_STANDUP_FAILURE',
  
  TOGGLE_HIGHLIGHT_REQUEST = 'TOGGLE_HIGHLIGHT_REQUEST',
  TOGGLE_HIGHLIGHT_SUCCESS = 'TOGGLE_HIGHLIGHT_SUCCESS',
  TOGGLE_HIGHLIGHT_FAILURE = 'TOGGLE_HIGHLIGHT_FAILURE',
  
  CLEAR_STANDUP = 'CLEAR_STANDUP',
  RESET_SUCCESS = 'RESET_SUCCESS'
}

// Actions
interface FetchStandupsRequestAction {
  type: typeof StandupActionTypes.FETCH_STANDUPS_REQUEST;
}

interface FetchStandupsSuccessAction {
  type: typeof StandupActionTypes.FETCH_STANDUPS_SUCCESS;
  payload: Standup[];
}

interface FetchStandupsFailureAction {
  type: typeof StandupActionTypes.FETCH_STANDUPS_FAILURE;
  payload: string;
}

interface FetchStandupRequestAction {
  type: typeof StandupActionTypes.FETCH_STANDUP_REQUEST;
}

interface FetchStandupSuccessAction {
  type: typeof StandupActionTypes.FETCH_STANDUP_SUCCESS;
  payload: Standup;
}

interface FetchStandupFailureAction {
  type: typeof StandupActionTypes.FETCH_STANDUP_FAILURE;
  payload: string;
}

interface CreateStandupRequestAction {
  type: typeof StandupActionTypes.CREATE_STANDUP_REQUEST;
}

interface CreateStandupSuccessAction {
  type: typeof StandupActionTypes.CREATE_STANDUP_SUCCESS;
  payload: Standup;
}

interface CreateStandupFailureAction {
  type: typeof StandupActionTypes.CREATE_STANDUP_FAILURE;
  payload: string;
}

interface UpdateStandupRequestAction {
  type: typeof StandupActionTypes.UPDATE_STANDUP_REQUEST;
}

interface UpdateStandupSuccessAction {
  type: typeof StandupActionTypes.UPDATE_STANDUP_SUCCESS;
  payload: Standup;
}

interface UpdateStandupFailureAction {
  type: typeof StandupActionTypes.UPDATE_STANDUP_FAILURE;
  payload: string;
}

interface DeleteStandupRequestAction {
  type: typeof StandupActionTypes.DELETE_STANDUP_REQUEST;
}

interface DeleteStandupSuccessAction {
  type: typeof StandupActionTypes.DELETE_STANDUP_SUCCESS;
  payload: string; // date
}

interface DeleteStandupFailureAction {
  type: typeof StandupActionTypes.DELETE_STANDUP_FAILURE;
  payload: string;
}

interface ToggleHighlightRequestAction {
  type: typeof StandupActionTypes.TOGGLE_HIGHLIGHT_REQUEST;
}

interface ToggleHighlightSuccessAction {
  type: typeof StandupActionTypes.TOGGLE_HIGHLIGHT_SUCCESS;
  payload: Standup;
}

interface ToggleHighlightFailureAction {
  type: typeof StandupActionTypes.TOGGLE_HIGHLIGHT_FAILURE;
  payload: string;
}

interface ClearStandupAction {
  type: typeof StandupActionTypes.CLEAR_STANDUP;
}

interface ResetSuccessAction {
  type: typeof StandupActionTypes.RESET_SUCCESS;
}

export type StandupAction = 
  | FetchStandupsRequestAction
  | FetchStandupsSuccessAction
  | FetchStandupsFailureAction
  | FetchStandupRequestAction
  | FetchStandupSuccessAction
  | FetchStandupFailureAction
  | CreateStandupRequestAction
  | CreateStandupSuccessAction
  | CreateStandupFailureAction
  | UpdateStandupRequestAction
  | UpdateStandupSuccessAction
  | UpdateStandupFailureAction
  | DeleteStandupRequestAction
  | DeleteStandupSuccessAction
  | DeleteStandupFailureAction
  | ToggleHighlightRequestAction
  | ToggleHighlightSuccessAction
  | ToggleHighlightFailureAction
  | ClearStandupAction
  | ResetSuccessAction; 