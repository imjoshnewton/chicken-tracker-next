import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import "../styles/globals.scss";
import { UserContext } from "../libs/context";
import { useUserData } from "../libs/hooks";

function MyApp({ Component, pageProps }) {
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      <Navbar />
      <Component {...pageProps} />
      <Toaster position='top-right' />
    </UserContext.Provider>
  );
}

export default MyApp;
