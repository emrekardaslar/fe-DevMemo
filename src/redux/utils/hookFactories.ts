import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks';
import { AsyncThunk, ThunkDispatch, AnyAction } from '@reduxjs/toolkit';

/**
 * Creates a hook function for simple async thunk operations
 * with standardized error handling and navigation
 */
export function createOperationHook<ThunkArg = void, ThunkReturn = unknown>(
  thunk: AsyncThunk<ThunkReturn, ThunkArg, { dispatch: ThunkDispatch<any, any, AnyAction> }>,
  options?: {
    navigateTo?: string;
    errorHandler?: (error: any) => void;
  }
) {
  return function useThunkOperation() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const operation = useCallback(
      async (arg: ThunkArg) => {
        try {
          const resultAction = await dispatch(thunk(arg as any));
          
          if (thunk.fulfilled.match(resultAction)) {
            if (options?.navigateTo) {
              navigate(options.navigateTo);
            }
            return resultAction.payload;
          } else if (thunk.rejected.match(resultAction)) {
            const errorMessage = resultAction.payload as string || 'Operation failed';
            throw new Error(errorMessage);
          }
        } catch (error) {
          console.error(`Operation failed for thunk ${thunk.typePrefix}:`, error);
          
          if (options?.errorHandler) {
            options.errorHandler(error);
          } else {
            throw error;
          }
        }
        return null;
      },
      [dispatch, navigate]
    );

    return operation;
  };
}

// Define a simpler type for Redux thunks to avoid TypeScript errors
type AppThunk<Arg = void, Return = unknown> = AsyncThunk<Return, Arg, { dispatch: ThunkDispatch<any, any, AnyAction> }>;

/**
 * Creates a hook function for a more complex feature with multiple thunks
 */
export function createFeatureHook<
  FetchAllArg = void,
  FetchAllReturn = unknown,
  FetchOneArg = void,
  FetchOneReturn = unknown,
  CreateArg = void,
  CreateReturn = unknown,
  UpdateArg = void,
  UpdateReturn = unknown,
  DeleteArg = void,
  DeleteReturn = unknown
>(
  fetchAllThunk: AppThunk<FetchAllArg, FetchAllReturn>,
  fetchOneThunk: AppThunk<FetchOneArg, FetchOneReturn>,
  createThunk: AppThunk<CreateArg, CreateReturn>,
  updateThunk: AppThunk<UpdateArg, UpdateReturn>,
  deleteThunk: AppThunk<DeleteArg, DeleteReturn>,
  options?: {
    createNavigateTo?: string;
    updateNavigateTo?: string;
    deleteNavigateTo?: string;
  }
) {
  return function useFeatureOperations() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Load all
    const loadAll = useCallback(
      async (arg: FetchAllArg) => {
        try {
          const resultAction = await dispatch(fetchAllThunk(arg as any));
          if (fetchAllThunk.fulfilled.match(resultAction)) {
            return resultAction.payload;
          }
        } catch (error) {
          console.error(`Failed to load all:`, error);
        }
        return null;
      },
      [dispatch]
    );

    // Load one
    const loadOne = useCallback(
      async (arg: FetchOneArg) => {
        try {
          const resultAction = await dispatch(fetchOneThunk(arg as any));
          if (fetchOneThunk.fulfilled.match(resultAction)) {
            return resultAction.payload;
          }
        } catch (error) {
          console.error(`Failed to load item:`, error);
        }
        return null;
      },
      [dispatch]
    );

    // Create
    const create = useCallback(
      async (arg: CreateArg, navigateAfter = true) => {
        try {
          const resultAction = await dispatch(createThunk(arg as any));
          if (createThunk.fulfilled.match(resultAction)) {
            if (navigateAfter && options?.createNavigateTo) {
              navigate(options.createNavigateTo);
            }
            return resultAction.payload;
          } else if (createThunk.rejected.match(resultAction)) {
            throw new Error(resultAction.payload as string || 'Failed to create');
          }
        } catch (error) {
          console.error('Failed to create:', error);
          throw error;
        }
        return null;
      },
      [dispatch, navigate]
    );

    // Update
    const update = useCallback(
      async (arg: UpdateArg, navigateAfter = true) => {
        try {
          const resultAction = await dispatch(updateThunk(arg as any));
          if (updateThunk.fulfilled.match(resultAction)) {
            if (navigateAfter && options?.updateNavigateTo) {
              navigate(options.updateNavigateTo);
            }
            return resultAction.payload;
          } else if (updateThunk.rejected.match(resultAction)) {
            throw new Error(resultAction.payload as string || 'Failed to update');
          }
        } catch (error) {
          console.error(`Failed to update:`, error);
          throw error;
        }
        return null;
      },
      [dispatch, navigate]
    );

    // Delete
    const deleteItem = useCallback(
      async (arg: DeleteArg, navigateAfter = true) => {
        try {
          const resultAction = await dispatch(deleteThunk(arg as any));
          if (deleteThunk.fulfilled.match(resultAction)) {
            if (navigateAfter && options?.deleteNavigateTo) {
              navigate(options.deleteNavigateTo);
            }
            return true;
          } else if (deleteThunk.rejected.match(resultAction)) {
            throw new Error(resultAction.payload as string || 'Failed to delete');
          }
        } catch (error) {
          console.error(`Failed to delete:`, error);
          throw error;
        }
        return false;
      },
      [dispatch, navigate]
    );

    return {
      loadAll,
      loadOne,
      create,
      update,
      delete: deleteItem
    };
  };
} 