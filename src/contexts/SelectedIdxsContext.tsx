import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SelectedIdxs {
  selectedIdxs: number[],
  add: (selectedIdx: number) => void,
  remove: (selectedIdx: number) => void,
  clear: () => void,
}

const SelectedIdxsContext = createContext<SelectedIdxs> ({
  selectedIdxs: [],
  add: (selectedIdx: number) => {
    throw new Error ("Not Implemented");
  },
  remove: (selectedIdx: number) => {
    throw new Error ("Not Implemented");
  },
  clear: () => {
    throw new Error ("Not Implemented");
  },
});
const STORAGE_KEY = "selection";

export function SelectedIdxsProvider ({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isInit, setInit] = useState (false);
  const [selectedIdxs, setSelectedIdxs] = useState<number[]> ([]);
  const add = async (selectedIdx: number) => {
    const selectedIdxsNew = selectedIdxs.slice ();

    selectedIdxsNew.push (selectedIdx);
    setSelectedIdxs (selectedIdxsNew);

    try {
      const store = JSON.stringify (selectedIdxsNew);

      await AsyncStorage.setItem (STORAGE_KEY, store);
    } catch (error) {
      console.log (`Storage Error: ${error}`)
    }
  };
  const remove = async (selectedIdx: number) => {
    const selectedIdxsNew = selectedIdxs.slice ().filter ((s) => s !== selectedIdx);

    setSelectedIdxs (selectedIdxsNew);

    try {
      const store = JSON.stringify (selectedIdxsNew);

      await AsyncStorage.setItem (STORAGE_KEY, store);
    } catch (error) {
      console.log (`Storage Error: ${error}`)
    }
  };
  const clear = async () => {
    const selectedIdxsNew: number[] = [];

    setSelectedIdxs (selectedIdxsNew);

    try {
      const store = JSON.stringify (selectedIdxsNew);

      await AsyncStorage.setItem (STORAGE_KEY, store);
    } catch (error) {
      console.log (`Storage Error: ${error}`)
    }
  }

  useEffect (() => {
    const getItem = async () => {
      try {
        const resultJson = await AsyncStorage.getItem (STORAGE_KEY);

        if (resultJson) {
          const result: number[] = JSON.parse (resultJson);

          setSelectedIdxs (result);
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
    <SelectedIdxsContext.Provider value = {{ selectedIdxs, add, remove, clear }}>
      { children }
    </SelectedIdxsContext.Provider>
  );
}

export default SelectedIdxsContext;
