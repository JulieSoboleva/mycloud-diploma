import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../redux/store'

export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const formatFileSize = (size: number) => {
    const units = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];
  
    for (const unit of units) {
      if (size < 1024) {
        return `${size.toFixed(1)} ${unit}`;
      }
      size = size / 1024;
    }
};