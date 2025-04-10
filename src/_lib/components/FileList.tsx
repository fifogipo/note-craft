import { FC, useEffect, useState } from "react";
import Image from "next/image";

type TFileListProps = {
  files: Note[];
  isMobile: boolean;
  changeFiles: (fileId: number | null) => void;
  onAddNote: () => void;
  onDeleteNote: (noteId: number) => Promise<void>;
  setCurrentStep?: (currentStep: number) => void;
};

const FileList: FC<TFileListProps> = ({ files, isMobile, changeFiles, onAddNote, onDeleteNote, setCurrentStep }) => {
  const [activeFileId, setActiveFileId] = useState<number | null>(null);

  useEffect(() => {
    if (isMobile) return;
    if (!files || files.length === 0) {
      setActiveFileId(null);
      changeFiles(null);
    } else if (activeFileId === null || !files.some((f) => f.id === activeFileId)) {
      setActiveFileId(files[0].id);
      changeFiles(files[0].id);
    }
  }, [files, activeFileId, changeFiles, isMobile]);

  return (
    <div
      className="flex-1 flex flex-col h-full bg-background min-w-[250px] w-full md:w-auto"
      role="region"
      aria-label="Elenco delle note"
    >
      <div className="bg-primary p-2 h-[50px] border-b border-b-border-divider">
        <button
          onClick={onAddNote}
          className="flex gap-2 items-center h-full cursor-pointer"
          aria-label="Aggiungi nuova nota"
        >
          <span className="border border-white flex items-center justify-center rounded-full w-[18px] h-[18px]">
            <Image
              src="/plus.svg"
              alt="Icona aggiungi"
              height={8}
              width={8}
            />
          </span>
          <span>New Note</span>
        </button>
      </div>
      <div
        className="flex-1 p-4 flex flex-col gap-2 border-r border-r-border-divider overflow-y-auto"
        role="list"
      >
        {files && files.length > 0 ? (
          files.map((f) => (
            <div
              key={f.id}
              role="listitem"
              className="flex items-center gap-2"
            >
              <button
                onClick={() => {
                  setActiveFileId(f.id);
                  changeFiles(f.id);
                  if (setCurrentStep) {
                    setCurrentStep(2);
                  }
                }}
                className={`flex gap-2 items-center px-2 py-1 w-full cursor-pointer rounded transition-all duration-300 ease-in-out hover:bg-border-divider ${activeFileId === f.id ? "bg-border-divider" : ""}`}
                aria-current={activeFileId === f.id ? "true" : "false"}
                aria-label={`Seleziona nota ${f.title}`}
              >
                <Image
                  src="/file.svg"
                  height={12}
                  width={12}
                  alt="Icona file"
                />
                <span>{f.title}</span>
              </button>
              <button
                onClick={() => onDeleteNote(f.id)}
                className="cursor-pointer p-[0.4rem] rounded transition-colors duration-300 ease-in-out hover:bg-secondary"
                aria-label={`Elimina nota ${f.title}`}
              >
                <Image
                  src="/trash.svg"
                  alt="Icona elimina"
                  width={12}
                  height={12}
                />
              </button>
            </div>
          ))
        ) : (
          <span className="text-primary flex gap-2 items-center px-2 py-1 min-w-[232.8px] w-full cursor-pointer rounded">
            No Notes
          </span>
        )}
      </div>
    </div>
  );
};

export default FileList;
