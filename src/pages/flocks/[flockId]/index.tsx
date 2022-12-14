import Image from "next/image";
import { useState } from "react";

import { useFlockData, useLogsData } from "../../../libs/hooks";

import Card from "../../../components/Card";
import Loader from "../../../components/Loader";
import LogModal from "../../../components/LogModal";
import ExpenseModal from "../../../components/ExpenseModal";
import Breeds from "../../../components/Breeds";
import Stats from "../../../components/Stats";
import { useRouter } from "next/router";
import Link from "next/link";
import { MdOutlineEdit } from "react-icons/md";

export default function Flocks({ params }) {
  const router = useRouter();
  const { flockId, flock } = useFlockData();
  const { logs, range } = useLogsData();

  const onRangeChange = (event: any) => {
    const newRange = event.target.value;

    router.replace({
      query: { ...router.query, statsRange: newRange },
    });
  };

  return (
    <main>
      {flock ? (
        <Card title='Flock Details' key={flockId?.toString()}>
          <div className='flex items-center flex-wrap'>
            <Image
              src={flock?.imageUrl}
              width='150'
              height='150'
              className='flock-image'
              alt=''
            />
            {/* <pre>{limit}</pre> */}
            <div className='ml-0 md:ml-6'>
              <div className='flex items-center'>
                <h1 className='inline mr-3'>{flock?.name}</h1>
                <Link href={`/flocks/${flockId}/edit`}>
                  <a className='hover:cursor-pointer h-full'>
                    <MdOutlineEdit className='text-xl' />
                  </a>
                </Link>
              </div>
              <p className='description'>{flock?.description}</p>
              <p className='text-gray-400 mt-2'>{flock?.type}</p>
            </div>
            <div className='w-full ml-0 mt-4 md:ml-auto md:mt-0 md:w-auto flex self-start flex-wrap'>
              <LogModal flockId={flockId?.toString()} />
              <div className='p-1'></div>
              <ExpenseModal flockId={flockId?.toString()} />
            </div>
          </div>
          <div className='divider my-6'></div>
          <div className='flex flex-wrap justify-evently'>
            <Breeds breeds={flock?.breeds} className='flex-48'></Breeds>
            <div className='p-2'></div>
            <Stats
              logs={logs}
              flock={flock}
              stats={flock.stats}
              className='flex-48'
              limit={range.toString()}
              onRangeChange={onRangeChange}></Stats>
          </div>
        </Card>
      ) : (
        <div className='flex justify-center'>
          <Loader show={true}></Loader>
        </div>
      )}
    </main>
  );
}
