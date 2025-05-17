import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks';

/**
 * Creates a standard fetch hook for Redux Toolkit thunks
 */
export function createFetchHook(thunkAction: any) {
  return function useFetch() {
    const dispatch = useAppDispatch();
    
    return useCallback(async (params?: any) => {
      try {
        const resultAction = await dispatch(thunkAction(params));
        if (resultAction.meta.requestStatus === 'fulfilled') {
          return resultAction.payload;
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
      return null;
    }, [dispatch]);
  };
}

/**
 * Creates a standard mutation hook for Redux Toolkit thunks
 * with support for navigation after success
 */
export function createMutationHook(thunkAction: any, navigateTo?: string) {
  return function useMutation() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    
    return useCallback(async (data: any, navigateAfter = true) => {
      try {
        const resultAction = await dispatch(thunkAction(data));
        if (resultAction.meta.requestStatus === 'fulfilled') {
          if (navigateAfter && navigateTo) {
            navigate(navigateTo);
          }
          return resultAction.payload;
        } else if (resultAction.meta.requestStatus === 'rejected') {
          const errorMessage = resultAction.payload || 'Operation failed';
          throw new Error(errorMessage);
        }
      } catch (error) {
        console.error('Mutation error:', error);
        throw error;
      }
      return null;
    }, [dispatch, navigate]);
  };
}

/**
 * Creates a standard delete hook for Redux Toolkit thunks
 */
export function createDeleteHook(thunkAction: any, navigateTo?: string) {
  return function useDelete() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    
    return useCallback(async (id: any, navigateAfter = true) => {
      try {
        const resultAction = await dispatch(thunkAction(id));
        if (resultAction.meta.requestStatus === 'fulfilled') {
          if (navigateAfter && navigateTo) {
            navigate(navigateTo);
          }
          return true;
        } else if (resultAction.meta.requestStatus === 'rejected') {
          const errorMessage = resultAction.payload || 'Delete operation failed';
          throw new Error(errorMessage);
        }
      } catch (error) {
        console.error('Delete error:', error);
        throw error;
      }
      return false;
    }, [dispatch, navigate]);
  };
} 