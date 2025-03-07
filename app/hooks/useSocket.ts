import {useContext} from 'react';
import {SocketContext} from '../contexts/socketContext';

export default function useSocket() {
  const context = useContext(SocketContext);

  if (!context) throw new Error('Socket context provider not wrapped!');

  return context;
}
