import { cookies } from "next/headers";
import AdminVideosContainer from "./_components/AdminVideosContainer";
import { getBaseUrl } from "@/lib/get-base-url";

async function getVideos(token: string) {
  const res = await fetch(`${getBaseUrl()}/api/v1/admin/videos`, {
    cache: "no-store",
    headers: { Cookie: `token=${token}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data ?? [];
}

export default async function AdminVideosPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return <div>No autorizado</div>;

  const videos = await getVideos(token);

  return <AdminVideosContainer initialVideos={videos} />;
}
