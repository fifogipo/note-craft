import { FC, useEffect, useState } from "react";

type TFileListProps = {
  files: Note[];
  changeFiles: (fileId: number) => void;
}

const FileList: FC<TFileListProps> = ({ files, changeFiles }) => {
  const [activeFileId, setActiveFileId] = useState<number | null>(null);

  useEffect(() => {
    if (files && files.length > 0 && activeFileId === null) {
      setActiveFileId(files[0].id);
      changeFiles(files[0].id);
    }
  }, [files, activeFileId]);

  useEffect(() => {
    if (activeFileId !== null) {
      changeFiles(activeFileId);
    }
  }, [activeFileId]);

  return (
    <div className="flex flex-col h-full bg-[#1c1c1c] min-w-[250px] w-full md:w-auto">
      <div className="bg-[#008080] p-2 h-[50px] border-b border-b-[#333333]"></div>
      <div className="flex-1 p-4 border-r border-r-[#333333]">
        {files && files.length > 0
          ? files.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFileId(f.id)}
                className={`flex gap-2 items-center px-2 py-1 w-full cursor-pointer rounded transition-all duration-300 ease-in-out hover:bg-[#333333] ${
                  activeFileId === f.id ? "bg-[#333333]" : ""
                }`}
              >
                <img
                  src="/file.svg"
                  height={12}
                  width={12}
                  alt="file icon"
                />
                <span>{f.title}</span>
              </button>
            ))
          : null}
      </div>
    </div>
  );
};

export default FileList;
