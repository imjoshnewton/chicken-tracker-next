import { deleteDoc, doc } from "firebase/firestore";
import { useState } from "react";
import Card from "../../../../components/Card";
import { firestore } from "../../../../libs/firebase";
import { useAllExpensesData } from "../../../../libs/hooks";

export default function Logs() {
  const { expenses } = useAllExpensesData();
  const [working, setWorking] = useState(false);

  async function deleteLog(id: string): Promise<void> {
    const docRef = doc(firestore, `expenses`, id);

    setWorking(true);
    await deleteDoc(docRef);
    setWorking(false);
  }

  return (
    <main>
      <Card title='All Expenses'>
        <ul className='flex flex-col mt-4'>
          {expenses?.map((expense) => {
            console.log("Expense: ", expense);

            return (
              <li
                className='mb-3 shadow min-h-[50px] flex items-center px-3 py-2 border-solid border rounded'
                key={expense.id}>
                <div className='basis-1/3 md:basis-1/4'>
                  {expense.date.toDate().toDateString()}
                </div>
                <span className='basis-1/3 md:basis-1/6'>
                  Amount: ${expense.amount}
                </span>
                <span className='basis-1/3 hidden md:block'>
                  Memo: {expense.memo}
                </span>
                <div className='ml-auto'>
                  <button
                    className='bg-red-500 hover:shadow-lg hover:cursor-pointer rounded py-1 px-2'
                    onClick={async () => {
                      await deleteLog(expense.id);
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
