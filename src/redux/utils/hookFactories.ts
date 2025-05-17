import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks';
import { AsyncThunk, ThunkDispatch, Action } from '@reduxjs/toolkit';
import { useState } from 'react';

/**
 * Creates a hook function for simple async thunk operations
 * with standardized error handling and navigation
 */
export function createOperationHook<ThunkArg = void, ThunkReturn = unknown>(
  thunk: AsyncThunk<ThunkReturn, ThunkArg, { dispatch: ThunkDispatch<any, any, Action<string>> }>,
  options?: {
    navigateTo?: string;
    errorHandler?: (error: any) => void;
  }
) {
  return function useThunkOperation() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ThunkReturn | null>(null);

    const operation = useCallback(
      async (arg: ThunkArg) => {
        setLoading(true);
        try {
          const resultAction = await dispatch(thunk(arg as any));
          
          if (thunk.fulfilled.match(resultAction)) {
            if (options?.navigateTo) {
              navigate(options.navigateTo);
            }
            setData(resultAction.payload as ThunkReturn);
            setError(null);
            return resultAction.payload;
          } else if (thunk.rejected.match(resultAction)) {
            const errorMessage = resultAction.error.message || 'Operation failed';
            setError(errorMessage);
            setData(null);
            console.error(`Operation failed for thunk ${thunk.typePrefix}:`, errorMessage);
            return null;
          }
        } catch (err) {
          setError((err as Error).message);
          setData(null);
          console.error(`Unexpected error in thunk ${thunk.typePrefix}:`, err);
          return null;
        } finally {
          setLoading(false);
        }
      },
      [dispatch, navigate]
    );

    return { execute: operation, loading, error, data };
  };
}

// Define a simpler type for Redux thunks to avoid TypeScript errors
type AppThunk<Arg = void, Return = unknown> = AsyncThunk<Return, Arg, { dispatch: ThunkDispatch<any, any, Action<string>> }>;

/**
 * Creates a hook function for a more complex feature with multiple thunks
 */
export function createFeatureHook<
  State,
  FetchAllArg = void,
  FetchAllReturn = unknown,
  FetchOneArg = string,
  FetchOneReturn = unknown,
  CreateArg = unknown,
  CreateReturn = unknown,
  UpdateArg = { id: string; data: unknown },
  UpdateReturn = unknown,
  DeleteArg = string,
  DeleteReturn = unknown
>(options: {
  selectState: (state: any) => State;
  fetchAllThunk: AppThunk<FetchAllArg, FetchAllReturn>;
  fetchOneThunk: AppThunk<FetchOneArg, FetchOneReturn>;
  createThunk: AppThunk<CreateArg, CreateReturn>;
  updateThunk: AppThunk<UpdateArg, UpdateReturn>;
  deleteThunk: AppThunk<DeleteArg, DeleteReturn>;
  navigateOnCreate?: string;
  navigateOnUpdate?: string;
  navigateOnDelete?: string;
}) {
  return function useFeatureOperations() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch All
    const fetchAll = async (arg: FetchAllArg) => {
      setLoading(true);
      try {
        const resultAction = await dispatch(options.fetchAllThunk(arg as any));
        if (options.fetchAllThunk.fulfilled.match(resultAction)) {
          setError(null);
          return resultAction.payload;
        } else {
          setError(resultAction.error.message || 'Failed to fetch data');
          return null;
        }
      } catch (err) {
        setError((err as Error).message);
        return null;
      } finally {
        setLoading(false);
      }
    };

    // Fetch One
    const fetchOne = async (arg: FetchOneArg) => {
      setLoading(true);
      try {
        const resultAction = await dispatch(options.fetchOneThunk(arg as any));
        if (options.fetchOneThunk.fulfilled.match(resultAction)) {
          setError(null);
          return resultAction.payload;
        } else {
          setError(resultAction.error.message || 'Failed to fetch item');
          return null;
        }
      } catch (err) {
        setError((err as Error).message);
        return null;
      } finally {
        setLoading(false);
      }
    };

    // Create
    const create = async (arg: CreateArg) => {
      setLoading(true);
      try {
        const resultAction = await dispatch(options.createThunk(arg as any));
        if (options.createThunk.fulfilled.match(resultAction)) {
          setError(null);
          return resultAction.payload;
        } else if (options.createThunk.rejected.match(resultAction)) {
          setError(resultAction.error.message || 'Failed to create item');
          return null;
        }
      } catch (err) {
        setError((err as Error).message);
        return null;
      } finally {
        setLoading(false);
      }
    };

    // Update
    const update = async (arg: UpdateArg) => {
      setLoading(true);
      try {
        const resultAction = await dispatch(options.updateThunk(arg as any));
        if (options.updateThunk.fulfilled.match(resultAction)) {
          setError(null);
          return resultAction.payload;
        } else if (options.updateThunk.rejected.match(resultAction)) {
          setError(resultAction.error.message || 'Failed to update item');
          return null;
        }
      } catch (err) {
        setError((err as Error).message);
        return null;
      } finally {
        setLoading(false);
      }
    };

    // Delete
    const remove = async (arg: DeleteArg) => {
      setLoading(true);
      try {
        const resultAction = await dispatch(options.deleteThunk(arg as any));
        if (options.deleteThunk.fulfilled.match(resultAction)) {
          setError(null);
          return resultAction.payload;
        } else if (options.deleteThunk.rejected.match(resultAction)) {
          setError(resultAction.error.message || 'Failed to delete item');
          return null;
        }
      } catch (err) {
        setError((err as Error).message);
        return null;
      } finally {
        setLoading(false);
      }
    };

    return {
      fetchAll,
      fetchOne,
      create,
      update,
      remove,
      loading,
      error
    };
  };
} 