import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Discount, Purchase } from "@/utils/types";

interface Transaction {
  purchases: Purchase[],
  add: (purchase: Purchase) => void,
  remove: (idxs: number[]) => void,
  clear: () => void,
  setDiscount: (idx: number, discount: Discount) => void,
}

const TransactionsContext = createContext<Transaction> ({
  purchases: [],
  add: (purchase: Purchase) => {
    throw new Error ("Not Implemented");
  },
  remove: (idxs: number[])=> {
    throw new Error ("Not Implemented");
  },
  clear: () => {
    throw new Error ("Not Implemented");
  },
  setDiscount: (idx: number, discount: Discount) => {
    throw new Error ("Not Implemented");
  },
});
const STORAGE_KEY = "transaction";

export function TransactionsProvider ({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isInit, setInit] = useState (false);
  const [transactions, setTransactions] = useState<Purchase[]> ([]);
  const add = async (purchase: Purchase) => {
    const transactionsNew = transactions.slice ();

    transactionsNew.push (purchase);
    setTransactions (transactionsNew);

    try {
      const store = JSON.stringify (transactionsNew);

      await AsyncStorage.setItem (STORAGE_KEY, store);
    } catch (error) {
      console.log (`Storage Error: ${error}`)
    }
  };
  const remove = async (idxs: number[]) => {
    const transactionsNew = transactions.slice ().filter ((_, i) => !idxs.includes (i));

    setTransactions (transactionsNew);

    try {
      const store = JSON.stringify (transactionsNew);

      await AsyncStorage.setItem (STORAGE_KEY, store);
    } catch (error) {
      console.log (`Storage Error: ${error}`)
    }
  };
  const clear = async () => {
    const transactionsNew: Purchase[] = [];

    setTransactions (transactionsNew);

    try {
      const store = JSON.stringify (transactionsNew);

      await AsyncStorage.setItem (STORAGE_KEY, store);
    } catch (error) {
      console.log (`Storage Error: ${error}`)
    }
  };
  const setDiscount = async (idx: number, discount: Discount) => {
    const transactionsNew = transactions.slice ();

    if (transactions[idx].discount && transactions[idx].discount.id === discount.id) {
      transactionsNew[idx].discount = undefined;
    } else {
      transactionsNew[idx].discount = discount;
    }

    setTransactions (transactionsNew);

    try {
      const store = JSON.stringify (transactionsNew);

      await AsyncStorage.setItem (STORAGE_KEY, store);
    } catch (error) {
      console.log (`Storage Error: ${error}`)
    }
  };

  useEffect (() => {
    const getItem = async () => {
      try {
        const resultJson = await AsyncStorage.getItem (STORAGE_KEY);

        if (resultJson) {
          const result: Purchase[] = JSON.parse (resultJson);

          setTransactions (result);
        }
      } catch (error) {
        console.log (`Storage Error: ${error}`)
      }
    };

    if (!isInit) {
      getItem ();
      setInit (true);
    }
  }, [isInit]);

  return (
    <TransactionsContext.Provider value = {{ purchases: transactions, add, remove, clear, setDiscount }}>
      { children }
    </TransactionsContext.Provider>
  );
}

export default TransactionsContext;
