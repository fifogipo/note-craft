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
  }, [folders, activeFolderId, changeFolder, isMobile]);

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
    <div
      className="bg-effect flex-1 flex flex-col h-full bg-background min-w-[250px] w-full md:w-auto"
      role="region"
      aria-label="Barra laterale delle cartelle"
    >
      <div className="bg-primary p-2 h-[50px] border-b border-b-border-divider">
        <button
          onClick={onAddFolder}
          className="flex gap-2 items-center h-full cursor-pointer"
          aria-label="Aggiungi nuova cartella"
        >
          <span className="border border-white flex items-center justify-center rounded-full w-[18px] h-[18px]">
            <Image
              src="/plus.svg"
              alt="Icona aggiungi"
              height={8}
              width={8}
            />
          </span>
          <span>New Folder</span>
        </button>
      </div>
      <div
        className="flex-1 p-4 flex flex-col gap-2 border-r border-r-border-divider overflow-y-auto"
        role="list"
      >
        {folders && folders.length > 0 ? (
          folders.map((f) => (
            <div
              key={f.id}
              role="listitem"
              className="flex items-center gap-2"
            >
              {editingFolderId === f.id ? (
                <>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="px-2 py-1 w-full rounded border border-border-divider"
                    aria-label="Modifica nome cartella"
                  />
                  <button
                    onClick={() => handleRenameConfirm(f.id)}
                    className="cursor-pointer p-[0.4rem] rounded transition-colors duration-300 ease-in-out hover:bg-secondary"
                    aria-label="Conferma modifica cartella"
                  >
                    <Image
                      src="/check.svg"
                      alt="Icona salva"
                      width={12}
                      height={12}
                    />
                  </button>
                  <button
                    onClick={handleRenameCancel}
                    className="cursor-pointer p-[0.4rem] rounded transition-colors duration-300 ease-in-out hover:bg-secondary"
                    aria-label="Annulla modifica cartella"
                  >
                    <Image
                      src="/xmark.svg"
                      alt="Icona annulla"
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
                    className={`flex gap-2 items-center px-2 py-1 w-full cursor-pointer rounded transition-all duration-300 ease-in-out hover:bg-border-divider ${activeFolderId === f.id ? "bg-border-divider" : ""}`}
                    aria-current={activeFolderId === f.id ? "true" : "false"}
                    aria-label={`Seleziona cartella ${f.name}`}
                  >
                    <Image
                      src={activeFolderId === f.id ? "/folder-open.svg" : "/folder-closed.svg"}
                      height={12}
                      width={12}
                      alt="Icona cartella"
                    />
                    <span>{f.name}</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingFolderId(f.id);
                      setEditingName(f.name);
                    }}
                    className="cursor-pointer p-[0.4rem] rounded transition-colors duration-300 ease-in-out hover:bg-secondary"
                    aria-label={`Modifica cartella ${f.name}`}
                  >
                    <Image
                      src="/pen.svg"
                      alt="Icona modifica"
                      width={12}
                      height={12}
                    />
                  </button>
                  <button
                    onClick={() => onDeleteFolder(f.id)}
                    className="cursor-pointer p-[0.4rem] rounded transition-colors duration-300 ease-in-out hover:bg-secondary"
                    aria-label={`Elimina cartella ${f.name}`}
                  >
                    <Image
                      src="/trash.svg"
                      alt="Icona elimina"
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
            alt="Immagine utente"
            width={32}
            height={32}
          />
          <span>{session.user?.name || ""}</span>
        </div>
        <button
          className="w-fit cursor-pointer"
          onClick={() => signOut()}
          aria-label="Esci"
        >
          <Image
            src="/right-from-bracket.svg"
            alt="Icona logout"
            width={18}
            height={18}
          />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
