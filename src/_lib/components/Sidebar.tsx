import { FC, useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import { Folder } from "@prisma/client";
import Image from "next/image";

type TSidebarProps = {
  session: Session;
  folders: Folder[];
  isMobile: boolean;
  changeFolder: (folderId: number) => void;
  onAddFolder: () => void;
  onRenameFolder: (folderId: number, newName: string) => Promise<void>;
  onDeleteFolder: (folderId: number) => Promise<void>;
  setCurrentStep?: (currentStep: number) => void;
};

const Sidebar: FC<TSidebarProps> = ({
  session,
  folders,
  isMobile,
  changeFolder,
  onAddFolder,
  onRenameFolder,
  onDeleteFolder,
  setCurrentStep,
}) => {
  const [activeFolderId, setActiveFolderId] = useState<number | null>(null);
  const [editingFolderId, setEditingFolderId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>("");

  useEffect(() => {
    if (isMobile) return;
    if (folders && folders.length > 0) {
      if (activeFolderId === null || !folders.some((f) => f.id === activeFolderId)) {
        setActiveFolderId(folders[0].id);
        changeFolder(folders[0].id);
      } else {
        changeFolder(activeFolderId);
      }
    }
  }, [folders, activeFolderId, changeFolder]);

  const handleRenameConfirm = async (folderId: number) => {
    if (editingName.trim() !== "") {
      await onRenameFolder(folderId, editingName);
      setEditingFolderId(null);
      setEditingName("");
    }
  };

  const handleRenameCancel = () => {
    setEditingFolderId(null);
    setEditingName("");
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background min-w-[250px] w-full md:w-auto">
      <div className="bg-primary p-2 h-[50px] border-b border-b-border-divider">
        <button
          onClick={onAddFolder}
          className="flex gap-2 items-center h-full cursor-pointer"
        >
          <span className="border border-white flex items-center justify-center rounded-full w-[18px] h-[18px]">
            <Image
              src="/plus.svg"
              alt="add icon"
              height={8}
              width={8}
            />
          </span>
          <span>New Folder</span>
        </button>
      </div>
      <div className="flex-1 p-4 flex flex-col gap-2 border-r border-r-border-divider overflow-y-auto">
        {folders && folders.length > 0 ? (
          folders.map((f) => (
            <div
              key={f.id}
              className="flex items-center gap-2"
            >
              {editingFolderId === f.id ? (
                <>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="px-2 py-1 min-w-[200px] w-full rounded border border-border-divider"
                  />
                  <button
                    onClick={() => handleRenameConfirm(f.id)}
                    className="cursor-pointer p-[0.4rem] rounded transition-colors duration-300 ease-in-out hover:bg-secondary"
                  >
                    <Image
                      src="/check.svg"
                      alt="save icon"
                      width={12}
                      height={12}
                    />
                  </button>
                  <button
                    onClick={handleRenameCancel}
                    className="cursor-pointer p-[0.4rem] rounded transition-colors duration-300 ease-in-out hover:bg-secondary"
                  >
                    <Image
                      src="/xmark.svg"
                      alt="undo icon"
                      width={12}
                      height={12}
                    />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setActiveFolderId(f.id);
                      changeFolder(f.id);

                      if (setCurrentStep) {
                        setCurrentStep(1);
                      }
                    }}
                    className={`flex gap-2 items-center px-2 py-1 min-w-[200px] w-full cursor-pointer rounded transition-all duration-300 ease-in-out hover:bg-border-divider ${
                      activeFolderId === f.id ? "bg-border-divider" : ""
                    }`}
                  >
                    <Image
                      src={activeFolderId === f.id ? "/folder-open.svg" : "/folder-closed.svg"}
                      height={12}
                      width={12}
                      alt="folder icon"
                    />
                    <span>{f.name}</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingFolderId(f.id);
                      setEditingName(f.name);
                    }}
                    className="cursor-pointer p-[0.4rem] rounded transition-colors duration-300 ease-in-out hover:bg-secondary"
                  >
                    <Image
                      src="/pen.svg"
                      alt="modify icon"
                      width={12}
                      height={12}
                    />
                  </button>
                  <button
                    onClick={() => onDeleteFolder(f.id)}
                    className="cursor-pointer p-[0.4rem] rounded transition-colors duration-300 ease-in-out hover:bg-secondary"
                  >
                    <Image
                      src="/trash.svg"
                      alt="delete icon"
                      width={12}
                      height={12}
                    />
                  </button>
                </>
              )}
            </div>
          ))
        ) : (
          <span className="text-primary flex gap-2 items-center px-2 py-1 min-w-[265.6px] w-full cursor-pointer rounded">
            No Folders
          </span>
        )}
      </div>
      <div className="flex gap-4 justify-between items-center px-2 pb-2 border-r border-r-border-divider">
        <div className="flex gap-2 items-center">
          <Image
            className="rounded-full"
            src={session.user?.image || ""}
            alt="user image"
            width={32}
            height={32}
          />
          <span>{session.user?.name || ""}</span>
        </div>
        <button
          className="w-fit cursor-pointer"
          onClick={() => signOut()}
        >
          <Image
            src="/right-from-bracket.svg"
            alt="log out"
            width={18}
            height={18}
          />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
