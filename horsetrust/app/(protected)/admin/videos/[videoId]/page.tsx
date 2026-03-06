import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth/jwt";
import { getBaseUrl } from "@/lib/get-base-url";
import VideoPlayer from "@/app/components/horses/VideoPlayer";
import VideoReviewChanger from "../_components/VideoReviewChanger";
import Link from "next/link";

interface Props {
  params: Promise<{ videoId: string }>;
}

async function getVideoAdmin(videoId: string, token: string) {
  const res = await fetch(`${getBaseUrl()}/api/v1/admin/videos/${videoId}`, {
    cache: "no-store",
    headers: { Cookie: `token=${token}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data;
}

export default async function AdminVideoDetailPage({ params }: Props) {
  const { videoId } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  try {
    verifyToken(token);
  } catch {
    redirect("/login");
  }

  const video = await getVideoAdmin(videoId, token);

  if (!video) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-[rgb(var(--color-cream))] fontMontserrat">
          Video no encontrado
        </p>
      </div>
    );
  }

  const horse = video.horse || {};
  const seller = video.user || {};

  return (
    <div className="min-h-screen bg-black text-[rgb(var(--color-cream))] py-8 px-4 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Back link */}
        <Link
          href="/admin/videos"
          className="fontMontserrat text-sm text-[rgb(var(--color-gold))] hover:text-[rgb(var(--color-cream))] transition-colors uppercase tracking-wider mb-6 inline-block"
        >
          ← Volver al listado
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="fontMontserrat text-xs tracking-[0.375em] text-[rgb(var(--color-gold))] mb-3 uppercase">
            — Administración —
          </div>
          <h1 className="fontCormorant text-4xl lg:text-5xl text-[rgb(var(--color-cream))] uppercase tracking-wide">
            Revisión de Video
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Video & info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video player */}
            <div className="bg-black/50 border border-[rgb(var(--color-cream)/0.1)] p-6">
              <VideoPlayer url={video.url} title={horse.name || "Video"} />
            </div>

            {/* Horse info */}
            <div className="bg-black/50 border border-[rgb(var(--color-teal)/0.3)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[rgb(var(--color-teal))] text-lg">◆</span>
                <h3 className="fontCormorant text-2xl text-[rgb(var(--color-teal))] uppercase tracking-wide">
                  Información del Caballo
                </h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="fontMontserrat text-xs text-[rgb(var(--color-cream)/0.5)] uppercase tracking-wider">
                    Nombre
                  </span>
                  <span className="fontCormorant text-lg text-[rgb(var(--color-cream))]">
                    {horse.name || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="fontMontserrat text-xs text-[rgb(var(--color-cream)/0.5)] uppercase tracking-wider">
                    Raza
                  </span>
                  <span className="fontMontserrat text-sm text-[rgb(var(--color-cream)/0.7)]">
                    {horse.breed || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="fontMontserrat text-xs text-[rgb(var(--color-cream)/0.5)] uppercase tracking-wider">
                    Edad
                  </span>
                  <span className="fontMontserrat text-sm text-[rgb(var(--color-cream)/0.7)]">
                    {horse.age != null ? `${horse.age} años` : "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Seller info */}
            <div className="bg-black/50 border border-[rgb(var(--color-gold)/0.2)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[rgb(var(--color-gold))] text-lg">◆</span>
                <h3 className="fontCormorant text-2xl text-[rgb(var(--color-gold))] uppercase tracking-wide">
                  Información del Vendedor
                </h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="fontMontserrat text-xs text-[rgb(var(--color-cream)/0.5)] uppercase tracking-wider">
                    Nombre
                  </span>
                  <span className="fontMontserrat text-sm text-[rgb(var(--color-cream))]">
                    {[seller.first_name, seller.last_name]
                      .filter(Boolean)
                      .join(" ") || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="fontMontserrat text-xs text-[rgb(var(--color-cream)/0.5)] uppercase tracking-wider">
                    Email
                  </span>
                  <span className="fontMontserrat text-sm text-[rgb(var(--color-cream)/0.7)]">
                    {seller.email || "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Review changer */}
          <div className="lg:col-span-1 space-y-8">
            <VideoReviewChanger
              videoId={video.id}
              currentVerified={video.verified ?? false}
              currentReason={video.reason ?? null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
