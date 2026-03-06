import GalleryContainer from "@/app/components/gallery/GalleryContainer";
import { getBaseUrl } from "@/lib/get-base-url";

async function getHorses() {
  const res = await fetch(
    `${getBaseUrl()}/api/v1/horses?status=for_sale&verification_status=verified`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Error al traer caballos");
  }

  const json = await res.json();

  return json.data.horses;
}

export default async function Page() {
  const horses = await getHorses();

  return <GalleryContainer initialHorses={horses} />;
}
