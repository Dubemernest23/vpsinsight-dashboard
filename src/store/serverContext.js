import { createContext, useContext } from 'react';

export const ServerContext = createContext(null);

export const useServers = () => useContext(ServerContext);
