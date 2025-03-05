import {useContext} from 'react';
import {AppContext} from '../contexts/appContext';

export default function useApp() {
  const context = useContext(AppContext);

  if (!context) throw new Error('App context provider not wrapped!');

  return context;
}
