// import { createContext, useContext, useState } from "react";
// import Cookies from "js-cookie";

// export const AuthContext = createContext();

// export const useAuthContext = () => {
//     return useContext(AuthContext);
// };

// export const AuthContextProvider = ({ children }) => {
//     const initialUserState = Cookies.get("JWT"); // If the cookie is not httpOnly

//     console.log("JWT Token: ", initialUserState);
        
//     const [authUser, setAuthUser] = useState(
//         initialUserState ? JSON.parse(initialUserState) : null
//     );
//     return (
//         <AuthContext.Provider value={[authUser, setAuthUser]}>
//             {children}
//         </AuthContext.Provider>
//     );
// };
