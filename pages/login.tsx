import { signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../libs/context";
import { auth, firestore, googleAuthProvider } from "../libs/firebase";
import { debounce } from 'lodash';


export default function Login(props) {
    const { user, defaultFlock } = useContext(UserContext)

    // 1. user signed out <SignInButton />
    // 2. user signed in, but missing username <UsernameForm />
    // 3. user signed in, has username <SignOutButton />
    return (
        <main>
            {user ?
                !defaultFlock ? <UsernameForm /> : <SignOutButton />
                :
                <SignInButton />
            }
        </main>
    );
}

// Sign in with Google button
function SignInButton() {
    const signInWithGoogle = async () => {
        await signInWithPopup(auth, googleAuthProvider);
    };

    return (
        <button className="btn-google" onClick={signInWithGoogle}>
            <img src={'/google.png'} /> Sign in with Google
        </button>
    );
}

// Sign out button
function SignOutButton() {
    return <button onClick={() => signOut(auth)}>Sign Out</button>;
}

function UsernameForm() {
    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user, defaultFlock } = useContext(UserContext);

    const onSubmit = async (e) => {
        e.preventDefault();

        // Create refs for both documents
        const userDoc = doc(firestore, `users/${user.uid}`);
        // const usernameDoc = doc(firestore, `usernames/${formValue}`);

        // Commit both docs together as a batch write.
        const batch = writeBatch(firestore);
        batch.set(userDoc, { defaultFlock: formValue, photoURL: user.photoURL, name: user.displayName });
        // batch.set(usernameDoc, { uid: user.uid });

        await batch.commit();
    };

    const onChange = (e) => {
        // Force form value typed in form to match correct format
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        // Only set form value if length is < 3 OR it passes regex
        if (val.length < 3) {
            setFormValue(val);
            setLoading(false);
            setIsValid(false);
        }

        if (re.test(val)) {
            setFormValue(val);
            setLoading(true);
            setIsValid(false);
        }
    };

    //

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue]);

    // Hit the database for username match after each debounced change
    // useCallback is required for debounce to work
    const checkUsername = useCallback(
        debounce(async (username) => {
            if (username.length >= 3) {
                const ref = doc(firestore, `usernames/${username}`);
                const udoc = await getDoc(ref);
                // const udoc = await getDoc(ref);
                console.log(udoc.exists());
                
                console.log('Firestore read executed!');
                setIsValid(!udoc.exists());
                setLoading(false);
            }
        }, 500),
        []
    );

    return (
        !defaultFlock && (
            <section>
                <h3>Choose Username</h3>
                <form onSubmit={onSubmit}>
                    <input name="username" placeholder="myname" value={formValue} onChange={onChange} />
                    <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
                    <button type="submit" className="btn-green" disabled={!isValid}>
                        Choose
                    </button>

                    <h3>Debug State</h3>
                    <div>
                        Username: {formValue}
                        <br />
                        Loading: {loading.toString()}
                        <br />
                        Username Valid: {isValid.toString()}
                    </div>
                </form>
            </section>
        )
    );
}

function UsernameMessage({ username, isValid, loading }) {
    if (loading) {
        return <p>Checking...</p>;
    } else if (isValid) {
        return <p className="text-success">{username} is available!</p>;
    } else if (username && !isValid) {
        return <p className="text-danger">That username is taken!</p>;
    } else {
        return <p></p>;
    }
}