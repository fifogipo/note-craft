import { createComponent } from "@lit/react";
import { RichNoteComponent } from "rich-note-component";
import * as React from "react";
import { FC, useEffect } from "react";

const RichNoteWrapper = createComponent({
  displayName: "RichNoteComponent",
  tagName: "rich-note-component",
  elementClass: RichNoteComponent,
  react: React,
});

export type TRichNoteProps = {
  title: string;
  content: string;
  disableLeftBorder: boolean;
  onNoteSaved?: (e: CustomEvent) => void;
};

export const RichNote: FC<TRichNoteProps> = (props) => {
  useEffect(() => {
    window.addEventListener("note-saved", props.onNoteSaved as EventListener);
    return () => {
      window.removeEventListener("note-saved", props.onNoteSaved as EventListener);
    };
  }, []);

  return (
    <RichNoteWrapper
      title={props.title}
      content={props.content}
      disableLeftBorder
    />
  );
};
