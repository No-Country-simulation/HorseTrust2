"use client";

import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

export default function ChatEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <IoChatbubbleEllipsesOutline
        className="text-7xl"
        style={{ color: "rgb(62, 98, 89)" }}
      />
      <h2
        className="text-xl font-semibold fontMontserrat"
        style={{ color: "rgb(238, 238, 255)" }}
      >
        Selecciona una conversación
      </h2>
      <p
        className="text-sm fontMontserrat"
        style={{ color: "rgb(238, 238, 255, 0.6)" }}
      >
        Elige un chat de la lista para comenzar a chatear
      </p>
    </div>
  );
}
