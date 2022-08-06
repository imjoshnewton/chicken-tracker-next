import { doc } from "firebase/firestore";
import { useRouter } from "next/router";
import Image from "next/image";
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { firestore } from "../../libs/firebase";
import Card from "../../components/Card";
import Loader from "../../components/Loader";

export default function Flocks({ params }) {
    const router = useRouter();
    const { flockId } = router.query;
    const flockDoc = doc(firestore, `flocks/${flockId}`);
    const [flockData, loading, error] = useDocumentData(flockDoc);

    return (
        !loading 
            ? error ? (<main><p>{error.message}</p></main>) 
                : (
                    <main>
                        {flockId}<br />
                        <Card title="Flock Details">
                            <div className="d-flex align-items-center">
                                <Image src={flockData.imageUrl} width="150" height="150" className="flock-image" alt="" />
                                <div className="ms-4">
                                    <h2>{flockData.name}</h2>
                                    <p className="description">{flockData.description}</p>
                                    <p>{flockData.type}</p>
                                </div>
                            </div>
                            <div>
                                <h3>Breeds</h3>
                                <div className="d-flex flex-wrap">
                                {
                                    flockData.chickens.map((breed, index) => {
                                        return (
                                            <div className="d-flex align-items-center breed" key={index}>
                                                <Image src={breed.imageUrl} width="50" height="50" className="flock-image" alt="" />
                                                <div className="ms-3">
                                                    <p>
                                                        <strong>{breed.breed}</strong>
                                                        <br/>
                                                        <strong>Count: </strong>{breed.count}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                                </div>
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