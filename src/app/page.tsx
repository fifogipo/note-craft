"use client";

import { RichNote } from "@/_lib/RichNote";

export default function Home() {
  return <div className="flex items-center justify-center h-screen">
    <RichNote
      title={"Pippo"}
      content={`<p>ciaooo stroo</p>`}
      disableLeftBorder
      onNoteSaved={(e) => console.log("save", e.detail)}
    />
  </div>;
}
