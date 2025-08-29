import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { queryClient } from "@/app/_layout";
import { Status } from "@/utils/types";

interface User {
  id: string,
  name: string,
  isManager: boolean,
  login: (id: string) => Promise<Status>,
  logout: () => void,
  validate: (id: string, isManager: boolean) => Promise<{ status: Status, id?: string, name?: string }>,
}

interface AuthenticationAPI {
  ok: boolean,
  id: string,
  name: string,
  is_manager: boolean,
}

interface ValidationAPI {
    ok: boolean,
    id: string,
    name: string,
}

const UserContext = createContext<User> ({
  id: "",
  name: "",
  isManager: false,
  login: (id: string) => {
    throw new Error ("Not Implemented");
  },
  logout: () => {
    throw new Error ("Not Implemented");
  },
  validate: (id: string, isManager: boolean) => {
    throw new Error ("Not Implemented");
  },
});
export const KEY = "user";
const TRUE = 1;
const FALSE = 0;

export function UserProvider ({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isInit, setInit] = useState (false);
  const [id, setId] = useState ("");
  const [name, setName] = useState ("");
  const [isManager, setManager] = useState (false);
  const login = async (id: string) => {
    const postSession = async () => {
      const response = await fetch (`${process.env.EXPO_PUBLIC_API_URL}/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify ({
          id: id,
        }),
      });

      if (response.ok) {
        return await response.json ();
      } else {
        throw new Error (`${response.status}`);
      }
    };
    let name: string;
    let isManager: boolean;

    try {
      const authentication: AuthenticationAPI = await queryClient.fetchQuery ({ queryKey: [`/session/${id}`], queryFn: postSession });

      if (authentication.ok) {
        name = authentication.name;
        isManager = authentication.is_manager;
      } else {
        return { isError: false, isSuccess: false };
      }
    } catch (error) {
      console.log (`Fetch Error: ${error}`);
        return { isError: true, isSuccess: false };
    }

    setId (id);
    setName (name);
    setManager (isManager);

    try {
      const store = JSON.stringify ({ id: id, name: name });

      await AsyncStorage.setItem (KEY, store);
    } catch (error) {
      console.log (`Storage Error: ${error}`)
      return { isError: true, isSuccess: false };
    }

    return { isError: false, isSuccess: true };
  };
  const logout = async () => {
    setId ("");
    setName ("");

    try {
      await AsyncStorage.removeItem (KEY);
    } catch (error) {
      console.log (`Storage Error: ${error}`)
    }
  };
  const validate = async (id: string, isManager: boolean) => {
    const getUser = async () => {
      const response = await fetch (`${process.env.EXPO_PUBLIC_API_URL}/user/${id}/${isManager ? TRUE : FALSE}`);

      if (response.ok) {
        return await response.json ();
      } else {
        throw new Error (`${response.status}`);
      }
    };
    let name: string;

    try {
      const validation: ValidationAPI = await queryClient.fetchQuery ({ queryKey: [`/user/${id}`], queryFn: getUser });

      if (validation.ok) {
        name = validation.name;
      } else {
        return { status: { isError: false, isSuccess: false }, id: "", name: "" };
      }
    } catch (error) {
      console.log (`Fetch Error: ${error}`);
        return { status: { isError: true, isSuccess: false }, id: "", name: "" };
    }

    return { status: { isError: false, isSuccess: true }, id, name };
  };

  useEffect (() => {
    const getItem = async () => {
      try {
        const resultJson = await AsyncStorage.getItem (KEY);

        if (resultJson) {
          const result: { id: string, name: string } = JSON.parse (resultJson);

          setId (result.id);
          setName (result.name);
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
    <UserContext.Provider value = {{ id, name, isManager, login, logout, validate }}>
      { children }
    </UserContext.Provider>
  );
}

export default UserContext;
