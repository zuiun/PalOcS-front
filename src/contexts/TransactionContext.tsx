import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DiscountAPI, LineAPI, Purchase, PurchaseAPI } from "@/utils/types";

interface Transaction {
  purchases: Purchase[],
  add: (purchase: Purchase) => void,
  remove: (idxs: number[]) => void,
  clear: () => void,
  setDiscount: (idx: number, discount: DiscountAPI) => void,
  toLines: () => LineAPI[],
  toPurchases: () => PurchaseAPI[],
}

const TransactionContext = createContext<Transaction> ({
  purchases: [],
  add: (purchase: Purchase) => {
    throw new Error ("Not Implemented");
  },
  remove: (idxs: number[]) => {
    throw new Error ("Not Implemented");
  },
  clear: () => {
    throw new Error ("Not Implemented");
  },
  setDiscount: (idx: number, discount: DiscountAPI) => {
    throw new Error ("Not Implemented");
  },
  toLines: () => {
    throw new Error ("Not Implemented");
  },
  toPurchases: () => {
    throw new Error ("Not Implemented");
  },
});
export const KEY = "transaction";

export function TransactionProvider ({ children }: Readonly<{ children: React.ReactNode }>) {
  const [purchases, setPurchases] = useState<Purchase[]> ([]);
  const add = async (purchase: Purchase) => {
    const purchasesNew = purchases.slice ();

    purchasesNew.push (purchase);
    setPurchases (purchasesNew);

    try {
      const store = JSON.stringify (purchasesNew);

      await AsyncStorage.setItem (KEY, store);
    } catch (error) {
      console.log (`Storage Error: ${error}`)
    }
  };
  const remove = async (idxs: number[]) => {
    const purchasesNew = purchases.slice ().filter ((_, i) => !idxs.includes (i));

    setPurchases (purchasesNew);

    try {
      const store = JSON.stringify (purchasesNew);

      await AsyncStorage.setItem (KEY, store);
    } catch (error) {
      console.log (`Storage Error: ${error}`)
    }
  };
  const clear = async () => {
    const purchasesNew: Purchase[] = [];

    setPurchases (purchasesNew);

    try {
      const store = JSON.stringify (purchasesNew);

      await AsyncStorage.setItem (KEY, store);
    } catch (error) {
      console.log (`Storage Error: ${error}`)
    }
  };
  const setDiscount = async (idx: number, discount: DiscountAPI) => {
    const purchasesNew = purchases.slice ();

    if (purchases[idx].discount && purchases[idx].discount.id === discount.id) {
      purchasesNew[idx].discount = undefined;
    } else {
      purchasesNew[idx].discount = discount;
    }

    setPurchases (purchasesNew);

    try {
      const store = JSON.stringify (purchasesNew);

      await AsyncStorage.setItem (KEY, store);
    } catch (error) {
      console.log (`Storage Error: ${error}`)
    }
  };
  const toLines = () => {
    const lines: LineAPI[] = purchases.map ((p) => {
      return {
        name: p.name,
        size: p.size,
        price: p.price,
        discount_name: p.discount?.name,
        discount_value: p.discount?.value,
      }
    });

    return lines;
  };
  const toPurchases = () => {
    const purchasesApi: PurchaseAPI[] = purchases.map ((p) => {
      return {
        id: p.id,
        size: p.size,
        discount_id: p.discount?.id,
      }
    });

    return purchasesApi;
  };

  useEffect (() => {
    const getItem = async () => {
      try {
        const resultJson = await AsyncStorage.getItem (KEY);

        if (resultJson) {
          const result: Purchase[] = JSON.parse (resultJson);

          setPurchases (result);
        }
      } catch (error) {
        console.log (`Storage Error: ${error}`)
      }
    };

    getItem ();
  }, []);

  return (
    <TransactionContext.Provider value = {{ purchases, add, remove, clear, setDiscount, toLines, toPurchases }}>
      { children }
    </TransactionContext.Provider>
  );
}

export default TransactionContext;
