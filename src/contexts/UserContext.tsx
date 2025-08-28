import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { queryClient } from "@/app/_layout";
import { Status } from "@/utils/types";

// TODO: write a validate()
interface User {
  id: string,
  name: string,
  login: (id: string) => Promise<Status>,
  logout: () => void,
}

interface AuthenticationAPI {
  ok: boolean,
  id: string,
  name: string,
}

const UserContext = createContext<User> ({
  id: "",
  name: "",
  login: (id: string) => {
    throw new Error ("Not Implemented");
  },
  logout: ()=> {
    throw new Error ("Not Implemented");
  },
});
export const KEY = "user";

export function UserProvider ({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isInit, setInit] = useState (false);
  const [id, setId] = useState ("");
  const [name, setName] = useState ("");
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

    try {
      const authentication: AuthenticationAPI = await queryClient.fetchQuery ({ queryKey: [`/session/${id}`], queryFn: postSession });

      if (authentication.ok) {
        name = authentication.name;
      } else {
        return { isError: false, isSuccess: false };
      }
    } catch (error) {
      console.log (`Fetch Error: ${error}`);
        return { isError: true, isSuccess: false };
    }

    setId (id);
    setName (name);

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
    const user = { id: "", name: "" };

    setId (user.id);
    setName (user.name);

    try {
      await AsyncStorage.removeItem (KEY);
    } catch (error) {
      console.log (`Storage Error: ${error}`)
    }
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
    <UserContext.Provider value = {{ id, name, login, logout }}>
      { children }
    </UserContext.Provider>
  );
}

export default UserContext;
