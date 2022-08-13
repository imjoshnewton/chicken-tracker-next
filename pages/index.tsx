import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { useUserData } from "../libs/hooks";

type TechnologyCardProps = {
  name: string;
  description: string;
  documentation: string;
};

const Home: NextPage = () => {
  const router = useRouter();
  const { user, defaultFlock } = useUserData();
  const [loading, setLoading] = useState(true);

  console.log("User: ", user);
  console.log("Default Flock: ", defaultFlock);

  useEffect(() => {
    if (user !== null && defaultFlock) {
      router.push(`/flocks/${defaultFlock}`);
    } else if (user && !defaultFlock) {
      setLoading(true);
    } else {
      router.push("/login");
    }
  }, [user, defaultFlock]);

  return (
    <main>
      {loading && (
        <div className='flex justify-center'>
          <Loader show={true}></Loader>
        </div>
      )}
    </main>
  );
};

export default Home;
