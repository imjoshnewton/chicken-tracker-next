import { collection, doc, limit, orderBy, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import Image from "next/image";
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';
import { firestore } from "../../libs/firebase";
import Card from "../../components/Card";
import Loader from "../../components/Loader";
import Breeds from "../../components/Breeds";
import Stats from "../../components/Stats";
import { useEffect } from "react";

export default function Flocks({ params }) {
    const router = useRouter();
    const { flockId } = router.query;

    if (!flockId) {
        return (
            <main>
                <Loader show={true}></Loader>
            </main>
        );
    }

    let flockDoc = doc(firestore, `flocks/${flockId}`);
    let [flockData, loading, error] = useDocumentData(flockDoc);

    let logCol = collection(firestore, 'logs');
    let q = query(logCol, where('flock', '==', flockId), orderBy('date', 'desc'), limit(7));;
    let [logData] = useCollectionData(q);

    return (
        !loading 
            ? error ? (<main><p>{error.message}</p></main>) 
                : (
                    <main>
                        {/* {flockId}<br /> */}
                        <Card title="Flock Details">
                            <div className="d-flex align-items-center">
                                <Image src={flockData.imageUrl} width="150" height="150" className="flock-image" alt="" />
                                <div className="ms-4">
                                    <h2>{flockData.name}</h2>
                                    <p className="description">{flockData.description}</p>
                                    <p>{flockData.type}</p>
                                </div>
                            </div>
                            <div className="divider my-4"></div>
                            <div className="d-flex flex-wrap justify-content-evently">
                                <Breeds breeds={flockData.chickens} className="flex-50"></Breeds>
                                <Stats logs={logData} flock={flockData} className="flex-50"></Stats>
                            </div>
                        </Card>
                    </main>
                ) 
            : (
                <main>
                    <Loader show={loading}></Loader>
                </main>
            )
    )
}