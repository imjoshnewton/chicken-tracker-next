import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../libs/context";

import { MdOutlineEditNote, MdLogout, MdHomeFilled } from "react-icons/md";
import { AiOutlineDollar } from "react-icons/ai";

// Top navbar
export default function Navbar() {
  const { user, defaultFlock } = useContext(UserContext);

  return (
    <nav className='navbar'>
      <ul>
        <li className='cursor-pointer'>
          <Link href='/'>
            <span className='flex items-center'>
              Chicken&nbsp;
              <Image
                src='/chicken.svg'
                width='40'
                height='40'
                alt='Chicken tracker logo'
              />
              &nbsp;Tracker
            </span>
          </Link>
        </li>

        {/* user is signed-in */}
        {user && (
          <>
            {/* <li className='ml-auto text-white hover:text-slate-200'>
                            <div className='h-10 w-[1.5px] bg-white'></div>
                        </li> */}
            <li className='ml-4 flex items-center multilink cursor-pointer'>
              <div className='mr-3 user-name'>{user.displayName}</div>
              {/* <Link href={`/flocks/${defaultFlock}`}> */}
              <img
                src={user.photoURL as string}
                width='40'
                height='40'
                alt=''
                className='profile-image'
              />
              {/* </Link> */}
              <div className='multilink-content fadeIn'>
                <Link href={`/flocks/${defaultFlock}`}>
                  <a className='flex items-center'>
                    <MdHomeFilled className='mr-3 inline text-xl mt-[-3px]' />
                    My Flock
                  </a>
                </Link>
                <Link href={`/flocks/${defaultFlock}/logs`}>
                  <a className='flex items-center'>
                    <MdOutlineEditNote className='mr-1 inline text-2xl' /> Logs
                  </a>
                </Link>
                <Link href={`/flocks/${defaultFlock}/expenses`}>
                  <a className='flex items-center'>
                    <AiOutlineDollar className='mr-3 inline text-xl mt-[-3px]' />
                    Expenses
                  </a>
                </Link>
                <Link href='/login'>
                  <a className='flex items-center'>
                    <MdLogout className='mr-3 inline text-xl' />
                    Logout
                  </a>
                </Link>
              </div>
            </li>
          </>
        )}

        {/* user is not signed-in */}
        {/* {!user && (
          <li>
            <Link href='/api/auth/signin'>
              <button className='btn p-4'>Log in</button>
            </Link>
          </li>
        )} */}
      </ul>
    </nav>
  );
}
