import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define error levels
export enum ErrorLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

// Error types
export type ApiError = {
  message: string;
  status?: number;
  endpoint?: string;
};

export type ValidationError = {
  message: string;
  field?: string;
  value?: any;
};

export type AppError = {
  id: string;
  timestamp: number;
  level: ErrorLevel;
  message: string;
  code?: string;
  details?: any;
  source?: 'api' | 'app' | 'ui' | 'network' | 'auth';
  context?: string;
  dismissible?: boolean;
};

// Log error to console with appropriate level
export function logError(error: AppError): void {
  const message = `[${error.level.toUpperCase()}] ${error.message}`;
  const details = {
    timestamp: new Date(error.timestamp).toISOString(),
    id: error.id,
    source: error.source,
    context: error.context,
    details: error.details
  };

  switch (error.level) {
    case ErrorLevel.INFO:
      console.info(message, details);
      break;
    case ErrorLevel.WARNING:
      console.warn(message, details);
      break;
    case ErrorLevel.ERROR:
    case ErrorLevel.CRITICAL:
      console.error(message, details);
      break;
    default:
      console.log(message, details);
  }
}

// Create a unique ID for the error
export function createErrorId(): string {
  return `error-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

// Create an AppError from any error type
export function createAppError(
  error: unknown,
  options: {
    level?: ErrorLevel;
    source?: AppError['source'];
    context?: string;
    code?: string;
    dismissible?: boolean;
  } = {}
): AppError {
  const level = options.level || ErrorLevel.ERROR;
  let message = 'An unknown error occurred';
  let details = undefined;

  if (typeof error === 'string') {
    message = error;
  } else if (error instanceof Error) {
    message = error.message;
    details = error.stack;
  } else if (error && typeof error === 'object' && 'message' in error) {
    // @ts-ignore
    message = error.message;
    details = error;
  }

  return {
    id: createErrorId(),
    timestamp: Date.now(),
    level,
    message,
    code: options.code,
    details,
    source: options.source,
    context: options.context,
    dismissible: options.dismissible !== undefined ? options.dismissible : true
  };
}

// Create API error helpers
export function createApiError(error: any, endpoint?: string): ApiError {
  let message = 'API error occurred';
  let status: number | undefined = undefined;

  if (typeof error === 'string') {
    message = error;
  } else if (error && typeof error === 'object') {
    if ('message' in error) {
      message = error.message as string;
    }
    if ('status' in error) {
      status = error.status as number;
    }
  }

  return {
    message,
    status,
    endpoint
  };
}

// Format friendly error messages for users
export function formatUserErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === 'object') {
    // @ts-ignore
    if ('message' in error) return error.message;
    // @ts-ignore
    if ('error' in error) return error.error;
  }

  return 'An unexpected error occurred. Please try again later.';
}

// Create Redux slice for global error handling
interface ErrorState {
  errors: AppError[];
  hasUnreadErrors: boolean;
}

const initialState: ErrorState = {
  errors: [],
  hasUnreadErrors: false
};

export const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    addError: (state, action: PayloadAction<AppError>) => {
      state.errors.push(action.payload);
      state.hasUnreadErrors = true;
      // Also log the error
      logError(action.payload);
    },
    removeError: (state, action: PayloadAction<string>) => {
      state.errors = state.errors.filter(error => error.id !== action.payload);
    },
    clearErrors: (state) => {
      state.errors = [];
      state.hasUnreadErrors = false;
    },
    markErrorsAsRead: (state) => {
      state.hasUnreadErrors = false;
    }
  }
});

export const { addError, removeError, clearErrors, markErrorsAsRead } = errorSlice.actions;
export default errorSlice.reducer; 