
import { createContext } from "react";

const AuthContext = createContext({
  user: null, // { username: "john.doe", ... }
  isAuthenticated: false,
});

export default AuthContext;
