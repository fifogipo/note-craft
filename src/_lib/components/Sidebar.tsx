import { FC, useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";

type TSidebarProps = {
  session: Session;
  folder: Folder[];
  changeFolder: (folderId: number) => void;
  onAddFolder: () => void;
  onRenameFolder: (folderId: number, newName: string) => Promise<void>;
  onDeleteFolder: (folderId: number) => Promise<void>;
};

const Sidebar: FC<TSidebarProps> = ({ session, folder, changeFolder, onAddFolder, onRenameFolder, onDeleteFolder }) => {
  const [activeFolderId, setActiveFolderId] = useState<number | null>(null);
  const [editingFolderId, setEditingFolderId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>("");

  useEffect(() => {
    if (folder && folder.length > 0) {
      if (activeFolderId === null || !folder.some((f) => f.id === activeFolderId)) {
        setActiveFolderId(folder[0].id);
        changeFolder(folder[0].id);
      } else {
        changeFolder(activeFolderId);
      }
    }
  }, [folder, activeFolderId, changeFolder]);

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
    <div className="flex flex-col h-full rounded-l-lg bg-background min-w-[250px] w-full md:w-auto">
      <div className="bg-primary p-2 rounded-tl-lg h-[50px] border-b border-b-border-divider">
        <button
          onClick={onAddFolder}
          className="flex gap-2 items-center h-full cursor-pointer"
        >
          <span className="border border-white flex items-center justify-center rounded-full w-[18px] h-[18px]">
            <img
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
        {folder && folder.length > 0 ? (
          folder.map((f) => (
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
                    className="px-2 py-1 w-[200px] rounded border border-border-divider"
                  />
                  <button
                    onClick={() => handleRenameConfirm(f.id)}
                    className="cursor-pointer p-[0.4rem] rounded transition-colors duration-300 ease-in-out hover:bg-secondary"
                  >
                    <img
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
                    <img
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
                    }}
                    className={`flex gap-2 items-center px-2 py-1 w-[200px] cursor-pointer rounded transition-all duration-300 ease-in-out hover:bg-border-divider ${
                      activeFolderId === f.id ? "bg-border-divider" : ""
                    }`}
                  >
                    <img
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
                    <img
                      src="/pen.svg"
                      alt="modify icon"
                      width={12}
                      height={12}
                    />
                  </button>
                  <button onClick={() => onDeleteFolder(f.id)} className="cursor-pointer p-[0.4rem] rounded transition-colors duration-300 ease-in-out hover:bg-secondary">
                    <img
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
          <span className="text-primary flex gap-2 items-center px-2 py-1 w-[265.6px] cursor-pointer rounded">
            No Folders
          </span>
        )}
      </div>
      <div className="flex gap-4 justify-between items-center px-2 pb-2 border-r border-r-border-divider">
        <div className="flex gap-2 items-center">
          <img
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
          <img
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
