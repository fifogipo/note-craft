"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import SignIn from "@/_lib/components/SignIn";
import Sidebar from "@/_lib/components/Sidebar";
import { RichNote } from "@/_lib/components/RichNote";
import FileList from "@/_lib/components/FileList";
import { useDebounced } from "@/_lib/hooks/useDebounce";

const Home = () => {
  const { data: session } = useSession();
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [activeNote, setActiveNote] = useState<Note | undefined>(undefined);
  const activeNoteRef = useRef<Note | undefined>(activeNote);

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

  const handleAddNote = async (newNote: Partial<Note>) => {
    if (!session || !activeNoteRef.current) return;
    try {
      const tempNote: Note = {
        ...activeNoteRef.current,
        content: newNote.content ? newNote.content : activeNoteRef.current.content,
        title: newNote.title ? newNote.title : activeNoteRef.current.title,
      };
      const response = await fetch(`/api/notes/${tempNote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tempNote),
      });

      if (!response.ok) {
        throw new Error("Errore durante l'inserimento della nota");
      }
      const insertedNote: Note = await response.json();

      setActiveNote(insertedNote);
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === insertedNote.id ? insertedNote : note
        )
      );

    } catch (error) {
      console.error("Errore nella aggiunta della nota", error);
    }
  };
  const debouncedHandleAddNote = useDebounced(handleAddNote, 1500);

  useEffect(() => {
    if (session?.user?.email) fetchData().then();
  }, [session]);

  useEffect(() => {
    activeNoteRef.current = activeNote;
  }, [activeNote]);

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
            onNoteSaved={(e) => debouncedHandleAddNote(e.detail)}
            title={activeNote ? activeNote.title : ""}
            content={activeNote ? activeNote.content : ""}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
