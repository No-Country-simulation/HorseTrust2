import GalleryContainer from "@/app/components/gallery/GalleryContainer"

async function getHorses() {
  const res = await fetch("http://localhost:3000/api/v1/horses?status=for_sale", {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Error al traer caballos")
  }

  const json = await res.json()

  // 🔥 IMPORTANTE
  return json.data
}

export default async function Page() {
  const horses = await getHorses()

  return <GalleryContainer initialHorses={horses} />
}
