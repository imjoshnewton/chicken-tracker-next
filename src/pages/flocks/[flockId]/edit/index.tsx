import Card from "../../../../components/Card";
import EditFlock from "../../../../components/EditFlock";
import ImageUploader from "../../../../components/ImageUploader";

export default function EditPage({ params }) {
  return (
    <main>
      <Card title='Edit Flock'>
        <EditFlock />
      </Card>
    </main>
  );
}
