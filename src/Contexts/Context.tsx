import React, { createContext, useEffect, useState, PropsWithChildren, ReactNode } from "react";
import { ConnectionState, AppContextType } from "../utils/types";

const AppContext = createContext<AppContextType | null>(null);

const AppContextProvider = ({ children }: PropsWithChildren) => {
  const { ethereum } = typeof window !== "undefined" ? window : {};

  const provider = () => {
    return (
      <AppContext.Provider value={{ account, connectWallet, state }}>
        {children}
      </AppContext.Provider>
    )
  }

  const [account, setAccount] = useState("");
  const [state, setState] = useState<ConnectionState>(ConnectionState.ERROR)

  const checkEthereumExists = () => {
    if (!ethereum) {
      setState(ConnectionState.ERROR);
      return false;
    }
    return true;
  };

  const connectWallet = async () => {
    setState(ConnectionState.CONNECTING)
    if (checkEthereumExists()) {
      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log(accounts);
        setAccount(accounts[0]);
        setState(ConnectionState.CONNECTED)
      } catch (err) {
        setState(ConnectionState.ERROR);
      }
    }
  };

  const getConnectedAccounts = async () => {
    setState(ConnectionState.CONNECTING);
    try {
      const accounts = await ethereum.request({
        method: "eth_accounts",
      });
      console.log(accounts);
      setAccount(accounts[0]);
    } catch (err) {
      setState(ConnectionState.ERROR);
    }
  };


  useEffect(() => {
    if (checkEthereumExists()) {
      ethereum.on("accountsChanged", getConnectedAccounts);
      getConnectedAccounts();
    }
    return () => {
      ethereum.removeListener("accountsChanged", getConnectedAccounts);
    };
  }, [ethereum]);

  return provider();

}

export { AppContext, AppContextProvider };