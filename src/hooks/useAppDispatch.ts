import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';

// Use throughout the app instead of plain `useDispatch`
export const useAppDispatch = () => useDispatch<AppDispatch>(); 