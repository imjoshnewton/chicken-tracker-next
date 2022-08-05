import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../libs/context';

// Top navbar
export default function Navbar() {
    const { user, defaultFlock } = useContext(UserContext)

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/">
                        <button className="btn-logo">Home</button>
                    </Link>
                </li>

                {/* user is signed-in */}
                {user && (
                    <>
                        {/* <li className="push-left">
                            <Link href="/flocks">
                                <button className="btn-blue">Flocks</button>
                            </Link>
                        </li> */}
                        <li className='push-left'>
                            <span className='me-3'>{user?.displayName}</span>
                        </li>
                        <li>
                            <Link href={`/flocks/${defaultFlock}`}>
                                <img src={user?.photoURL} />
                            </Link>
                        </li>
                    </>
                )}

                {/* user is not signed-in */}
                {!user && (
                    <li>
                        <Link href="/login">
                            <button className="btn-blue">Log in</button>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}