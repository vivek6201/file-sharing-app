import {createContext, useState} from 'react';
import {getLocalIPAddress} from '../utils/utils';
import DeviceInfo from 'react-native-device-info';
import useSocket from '../hooks/useSocket';

interface IAppContext {
  qrValue: string;
  setupServer: () => Promise<void>;
}

export const AppContext = createContext<IAppContext | null>(null);

const AppContextProvider = ({children}: {children: React.ReactNode}) => {
  const [qrValue, setQRValue] = useState<string>('');
  const {server, startServer} = useSocket();

  const setupServer = async () => {
    const deviceName = await DeviceInfo.getDevice();
    const ip = await getLocalIPAddress();
    const port = 4000;

    if (!server) {
      startServer(port);
    }

    setQRValue(`tcp://${ip}:${port}|${deviceName}`);
    console.log('server started at:' + `${ip}:${port}`);
  };

  return (
    <AppContext.Provider value={{qrValue, setupServer}}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
