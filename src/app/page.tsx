"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import SignIn from "@/_lib/components/SignIn";
import Sidebar from "@/_lib/components/Sidebar";
import { RichNote } from "@/_lib/components/RichNote";
import FileList from "@/_lib/components/FileList";

const Home = () => {
  const { data: session } = useSession();
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [activeNote, setActiveNote] = useState<Note | undefined>(undefined);
  const [newNote, setNewNote] = useState<Partial<Note>>({ title: "", content: "" });

  const fetchData = async () => {
    try {
      const foldersRes = await fetch(`/api/folders?email=${session?.user?.email}`);
      const foldersData: Folder[] = await foldersRes.json();
      setFolders(foldersData);

      if (foldersData.length > 0) {
        const firstFolderId = foldersData[0].id;
        await getNotesByFolder(firstFolderId);
      }
    } catch (error) {
      console.error("Errore nel fetching dei dati", error);
    }
  };

  const getNotesByFolder = useCallback(async (folderId: number) => {
    try {
      const notesRes = await fetch(`/api/notes?email=${session?.user?.email}&folderId=${folderId}`);
      const notesData: Note[] = await notesRes.json();
      setNotes(notesData);
    } catch (error) {
      console.error("Errore nel fetching delle note della cartella", error);
    }
  }, [session?.user?.email]);

  const getNoteDetail = useCallback(async (fileId: number) => {
    try {
      const noteRes = await fetch(`/api/notes/${fileId}?email=${session?.user?.email}`);
      const noteData: Note = await noteRes.json();
      setActiveNote(noteData);
    } catch (error) {
      console.error("Errore nel fetching della note", error);
    }
  }, [session?.user?.email]);

  const changeFolderHandler = (folderId: number) => getNotesByFolder(folderId).then();
  const changeFileHandler = (fileId: number) => getNoteDetail(fileId).then();

  const handleAddNote = async () => {
    if (!session) return;
    try {
      const folderId = folders.length > 0 ? folders[0].id : undefined;
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newNote,
          userId: session.user?.email,
          folderId,
        }),
      });
      if (!response.ok) {
        throw new Error("Errore durante l'inserimento della nota");
      }
      const insertedNote: Note = await response.json();

      setNotes((prevNotes) => [...prevNotes, insertedNote]);
      setNewNote({ title: "", content: "" });
    } catch (error) {
      console.error("Errore nella aggiunta della nota", error);
    }
  };

  useEffect(() => {
    if (session?.user?.email) fetchData().then();
  }, [session]);

  return (
    <div>
      {!session ? (
        <SignIn />
      ) : (
        <div className="flex justify-center items-center h-screen p-4">
          <Sidebar
            session={session}
            folder={folders}
            changeFolder={changeFolderHandler}
          />
          <FileList files={notes} changeFiles={changeFileHandler} />
          <RichNote
            disableLeftBorder
            onNoteSaved={(e) => console.log("save", e.detail)}
            title={activeNote ? activeNote.title : ""}
            content={activeNote ? activeNote.content : ""}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
