import Image from "next/image";

export default function Breeds({ breeds, className }) {
    if (!breeds) {
        return null;
    }

    return (
        <div className={className}>
            <h3>Breeds</h3>
            <div className="d-flex flex-wrap">
                {
                    breeds?.map((breed, index) => {
                        return (
                            <div className="d-flex align-items-center breed" key={index}>
                                <Image src={breed.imageUrl} width="50" height="50" className="flock-image" alt="" />
                                <div className="ms-3">
                                    <p>
                                        <strong>{breed.breed}</strong>
                                        <br />
                                        <strong>Count: </strong>{breed.count}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}