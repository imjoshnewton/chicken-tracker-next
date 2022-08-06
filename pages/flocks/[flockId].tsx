import { collection, doc, limit, orderBy, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import Image from "next/image";
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';
import { firestore } from "../../libs/firebase";
import Card from "../../components/Card";
import Loader from "../../components/Loader";
import Breeds from "../../components/Breeds";
import Stats from "../../components/Stats";
import { useFlockData, useLogsData } from "../../libs/hooks";

export default function Flocks({ params }) {
    const { flockId, flock } = useFlockData();
    const { logs } = useLogsData();

    return (
        <main>
            {
                flock ? (
                    <Card title="Flock Details">
                        <div className="d-flex align-items-center">
                            <Image src={flock?.imageUrl} width="150" height="150" className="flock-image" alt="" />
                            <div className="ms-4">
                                <h2>{flock?.name}</h2>
                                <p className="description">{flock?.description}</p>
                                <p>{flock?.type}</p>
                            </div>
                        </div>
                        <div className="divider my-4"></div>
                        <div className="d-flex flex-wrap justify-content-evently">
                            <Breeds breeds={flock?.chickens} className="flex-50"></Breeds>
                            <Stats logs={logs} flock={flock} className="flex-50"></Stats>
                        </div>
                    </Card>
                ) : (
                    <div className="d-flex justify-content-center">
                        <Loader show={true}></Loader>
                    </div>
                )
            }
        </main>
    )
}