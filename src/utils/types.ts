export type AppContextType = {
    account: string;  
    connectWallet: () => void;
    state: ConnectionState;  
}

export enum ConnectionState {
    CONNECTING = 'CONNECTING',
    CONNECTED = 'CONNECTED',
    DISCONNECTED = 'DISCONNECTED',
    ISLOADING = 'ISLOADING',
    ERROR = 'ERROR',
}