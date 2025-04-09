import { FC, useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";

type TSidebarProps = {
  session: Session;
  folder: Folder[];
  changeFolder: (folderId: number) => void;
}

const Sidebar: FC<TSidebarProps> = ({ session, folder, changeFolder }) => {
  const [activeFolderId, setActiveFolderId] = useState<number | null>(null);

  useEffect(() => {
    if (folder && folder.length > 0 && activeFolderId === null) {
      setActiveFolderId(folder[0].id);
      changeFolder(folder[0].id);
    }
  }, [folder, activeFolderId]);

  useEffect(() => {
    if (activeFolderId !== null) {
      changeFolder(activeFolderId);
    }
  }, [activeFolderId]);

  return (
    <div className="flex flex-col h-full rounded-l-lg bg-[#1c1c1c] min-w-[250px] w-full md:w-auto">
      <div className="bg-[#008080] p-2 rounded-tl-lg h-[50px] border-b border-b-[#333333]">
        <button className="flex gap-2 items-center h-full cursor-pointer">
          <span className="border border-white flex items-center justify-center rounded-full w-[18px] h-[18px]">
            <img src="/plus.svg" alt="add icon" height={8} width={8} />
          </span>
          <span>Nuova cartella</span>
        </button>
      </div>
      <div className="flex-1 p-4 border-r border-r-[#333333]">
        {folder && folder.length > 0 ? (
          folder.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFolderId(f.id)}
              className={`flex gap-2 items-center px-2 py-1 w-full cursor-pointer rounded transition-all duration-300 ease-in-out hover:bg-[#333333] ${
                activeFolderId === f.id ? "bg-[#333333]" : ""
              }`}
            >
              <img
                src="/folder-closed.svg"
                height={12}
                width={12}
                alt="folder icon"
              />
              <span>{f.name}</span>
            </button>
          ))
        ) : null}
      </div>
      <div className="flex gap-4 justify-between items-center px-2 pb-2 border-r border-r-[#333333]">
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
        <button className="w-fit cursor-pointer" onClick={() => signOut()}>
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