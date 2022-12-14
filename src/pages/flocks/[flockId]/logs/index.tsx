import { deleteDoc, doc } from "firebase/firestore";
import { useState } from "react";
import Card from "../../../../components/Card";
import { firestore } from "../../../../libs/firebase";
import { useAllLogsData } from "../../../../libs/hooks";

export default function Logs() {
  const { logs } = useAllLogsData();
  const [working, setWorking] = useState(false);

  async function deleteLog(id: string): Promise<void> {
    const docRef = doc(firestore, `logs`, id);

    setWorking(true);
    await deleteDoc(docRef);
    setWorking(false);
  }

  return (
    <main>
      <Card title='All Logs'>
        <ul className='flex flex-col mt-4'>
          {logs?.map((log) => {
            return (
              <li
                className='mb-3 shadow min-h-[50px] flex items-center px-3 py-2 border-solid border rounded'
                key={log.id}>
                <div className='basis-1/3 md:basis-1/4'>
                  {log.date.toDate().toDateString()}
                </div>
                <span className='basis-1/3 md:basis-1/6'>
                  Count: {log.count}
                </span>
                <span className='basis-1/3 hidden md:block'>
                  Notes: {log.notes}
                </span>
                <div className='ml-auto'>
                  <button
                    className='bg-red-500 hover:shadow-lg hover:cursor-pointer rounded py-1 px-2'
                    disabled={working}
                    onClick={async () => {
                      await deleteLog(log.id);
                    }}>
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </main>
  );
}
