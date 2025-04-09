import { FC, useState, useEffect } from "react";

type TFileListProps = {
  files: Note[];
  changeFiles: (fileId: number | null) => void;
  onAddNote: () => void;
  onDeleteNote: (noteId: number) => Promise<void>;
};

const FileList: FC<TFileListProps> = ({ files, changeFiles, onAddNote, onDeleteNote }) => {
  const [activeFileId, setActiveFileId] = useState<number | null>(null);

  useEffect(() => {
    if (!files || files.length === 0) {
      setActiveFileId(null);
      changeFiles(null);
    } else if (activeFileId === null || !files.some((f) => f.id === activeFileId)) {
      setActiveFileId(files[0].id);
      changeFiles(files[0].id);
    }
  }, [files, changeFiles]);

  return (
    <div className="flex flex-col h-full bg-background min-w-[250px] w-full md:w-auto">
      <div className="bg-primary p-2 h-[50px] border-b border-b-border-divider">
        <button onClick={onAddNote} className="flex gap-2 items-center h-full cursor-pointer">
          <span className="border border-white flex items-center justify-center rounded-full w-[18px] h-[18px]">
            <img src="/plus.svg" alt="add icon" height={8} width={8} />
          </span>
          <span>New Note</span>
        </button>
      </div>
      <div className="flex-1 p-4 flex flex-col gap-2 border-r border-r-border-divider overflow-y-auto">
        {files && files.length > 0 ? (
          files.map((f) => (
            <div key={f.id} className="flex items-center gap-2">
              <button
                key={f.id}
                onClick={() => setActiveFileId(f.id)}
                className={`flex gap-2 items-center px-2 py-1 w-[200px] cursor-pointer rounded transition-all duration-300 ease-in-out hover:bg-border-divider ${
                  activeFileId === f.id ? "bg-border-divider" : ""
                }`}
              >
                <img src="/file.svg" height={12} width={12} alt="file icon" />
                <span>{f.title}</span>
              </button>
              <button
                onClick={() => onDeleteNote(f.id)}
                className="cursor-pointer p-[0.4rem] rounded transition-colors duration-300 ease-in-out hover:bg-secondary"
              >
                <img
                  src="/trash.svg"
                  alt="delete icon"
                  width={12}
                  height={12}
                />
              </button>
            </div>
          ))
        ) : (
          <span className="text-primary flex gap-2 items-center px-2 py-1 w-[232.8px] cursor-pointer rounded">
            No Notes
          </span>
        )}
      </div>
    </div>
  );
};

export default FileList;