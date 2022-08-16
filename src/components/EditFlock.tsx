import { doc, updateDoc } from "firebase/firestore";
import { auth, firestore, storage } from "../libs/firebase";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { Flock } from "../../models/models";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Loader from "./Loader";
import { useRouter } from "next/router";
import { useFlockData } from "../libs/hooks";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";

export default function EditFlock() {
  const router = useRouter();
  const { flockId, flock, flockRef } = useFlockData();

  return (
    <>
      {flock && (
        <>
          <section>
            <h1>{flock.name}</h1>
            <p>ID: {flockRef.id}</p>

            <FlockForm flockRef={flockRef} defaultValues={flock} />
          </section>
        </>
      )}

      {!flock && (
        <>
          <Loader show={true} />{" "}
        </>
      )}
    </>
  );
}

function FlockForm({ defaultValues, flockRef }) {
  const router = useRouter();
  const { register, handleSubmit, formState, reset, watch } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const { isValid, isDirty, errors } = formState;

  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const updateFlock = async ({
    name,
    description,
    type,
    image,
  }: {
    name: string;
    description: string;
    type: "egg-layers" | "meat-birds";
    image: any;
  }) => {
    const file = image[0];
    const extension = file.type.split("/")[1];
    const uploadRef = ref(
      storage,
      `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`
    );
    setUploading(true);
    // Starts the upload
    const task = uploadBytesResumable(uploadRef, file);

    // Listen to updates to upload task
    task.on("state_changed", (snapshot) => {
      const pct = (
        (snapshot.bytesTransferred / snapshot.totalBytes) *
        100
      ).toFixed(0);
      setProgress(Number(pct));
    });

    // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
    task
      .then((d) => getDownloadURL(uploadRef))
      .then((url) => {
        const imageUrl = url;
        setUploading(false);
        updateDoc(flockRef, {
          name,
          description,
          type,
          imageUrl,
        });

        reset({ name, description, type, imageUrl });

        toast.success("Flock updated successfully!");

        router.push(`/flocks/${flockRef.id}`);
      });
  };

  return (
    <form onSubmit={handleSubmit(updateFlock)}>
      <div>
        {/* <ImageUploader /> */}

        <fieldset>
          <label className='px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 btn w-full md:w-auto h-10'>
            Flock Image
            <input
              {...register("image")}
              name='image'
              type='file'
              accept='image/x-png,image/gif,image/jpeg'
            />
          </label>
        </fieldset>

        <fieldset>
          <label>Name</label>
          <input
            className='appearance-none border rounded w-full py-2 px-1 text-black'
            name='name'
            type='text'
            {...register("name")}
          />
        </fieldset>
        <fieldset>
          <label>Description</label>
          <input
            className='appearance-none border rounded w-full py-2 px-1 text-black'
            name='description'
            type='text'
            {...register("description")}
          />
        </fieldset>
        <fieldset>
          <label>Type:&nbsp;</label>
          <select {...register("type")}>
            <option value='egg-layers'>Egg Layers</option>
            <option value='meat-birds'>Meat Birds</option>
          </select>
        </fieldset>

        <div className='flex items-center mt-4'>
          <button
            type='submit'
            className='px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 btn w-full md:w-auto h-10 mr-3'
            disabled={!isDirty || !isValid}>
            Save Changes
          </button>
          {uploading && (
            <div className='flex items-center'>
              <Loader show={true} />
              <span className='ml-3'>Uploading Image: {progress}%</span>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
