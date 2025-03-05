import {createContext, useState} from 'react';

interface IAppContext {
  files: object[];
  setFiles: React.Dispatch<React.SetStateAction<object[]>>;
}

export const AppContext = createContext<IAppContext | null>(null);

const AppContextProvider = ({children}: {children: React.ReactNode}) => {
  const [files, setFiles] = useState<object[]>([]);

  return (
    <AppContext.Provider value={{files, setFiles}}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
