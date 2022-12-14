import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleAuthProvider } from "../libs/firebase";
import { UserContext } from "../libs/context";

import Card from "../components/Card";

export default function Login(props) {
  const { user, defaultFlock } = useContext(UserContext);

  return (
    <main>
      <Card title=''>
        {user ? (
          <div className='flex flex-col items-center justify-center'>
            <h2 className='mt-0 mb-2'>Logout</h2>
            <p className='mb-6'>Are you sure you want to log out?</p>
            <SignOutButton />
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center'>
            <SignInButton defaultFlock={defaultFlock} />
          </div>
        )}
      </Card>
    </main>
  );
}

// Sign in with Google button
function SignInButton({ defaultFlock }) {
  const router = useRouter();
  var { user, defaultFlock } = useContext(UserContext);

  console.log("User: ", user);

  useEffect(() => {
    console.log("SignInButton useEffect fired...", user, defaultFlock);

    if (user && defaultFlock) {
      router.push(`/flocks/${defaultFlock}`);
    }
  }, [user, defaultFlock]);

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleAuthProvider);
  };

  return (
    <button
      className='btn-google px-3 py-2 bg-gray-200 rounded'
      onClick={signInWithGoogle}>
      <img src={"/google.png"} /> Sign in with Google
    </button>
  );
}

// Sign out button
function SignOutButton() {
  return (
    <button className='px-3 py-2' onClick={() => signOut(auth)}>
      Sign Out
    </button>
  );
}
