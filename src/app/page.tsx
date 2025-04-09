"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import SignIn from "@/_lib/components/SignIn";
import Sidebar from "@/_lib/components/Sidebar";
import { RichNote } from "@/_lib/components/RichNote";
import FileList from "@/_lib/components/FileList";
import { useDebounced } from "@/_lib/hooks/useDebounce";
import { useFolder } from "@/_lib/hooks/useFolder";
import { useNote } from "@/_lib/hooks/useNote";

const Home = () => {
  const { data: session } = useSession();
  const email = session?.user?.email;

  const [activeFolderId, setActiveFolderId] = useState<number | undefined>(undefined);
  const [activeNote, setActiveNote] = useState<Note | undefined>(undefined);

  const { folders, loading: foldersLoading, error: foldersError, refreshFolders } = useFolder(email);
  const { notes, loading: notesLoading, error: notesError, setNotes } = useNote(email, activeFolderId);

  const getNoteDetail = useCallback(
    async (noteId: number | null) => {
      if (noteId === null) {
        setActiveNote(undefined);
        return;
      }
      try {
        const res = await fetch(`/api/notes/${noteId}?email=${email}`);
        const noteData: Note = await res.json();
        setActiveNote(noteData);
      } catch (error) {
        console.error("Errore nel fetching della nota", error);
      }
    },
    [email],
  );

  const handleNewNote = async () => {
    if (!email) return;
    await upsertNote({ title: "New Note", content: "" });
  };

  const handleSaveNote = async (noteData: Partial<Note>) => {
    if (!email) return;
    await upsertNote(noteData, activeNote);
  };

  const debouncedSaveNote = useDebounced(handleSaveNote, 1500);

  const upsertNote = async (newNote: Partial<Note>, currentNote?: Note) => {
    try {
      const noteToSend: Note = currentNote ? { ...currentNote, ...newNote } : { ...(newNote as Note), id: Date.now() };

      const method = currentNote ? "PATCH" : "POST";
      const endpoint = currentNote ? `/api/notes/${noteToSend.id}` : `/api/notes?email=${email}`;
      const body = currentNote ? noteToSend : { ...noteToSend, folderId: activeFolderId };

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Errore durante l'invio della nota");
      }

      const savedNote: Note = await response.json();
      setActiveNote(savedNote);
      setNotes((prevNotes) => {
        const noteExists = prevNotes.some((n) => n.id === savedNote.id);
        return noteExists ? prevNotes.map((n) => (n.id === savedNote.id ? savedNote : n)) : [...prevNotes, savedNote];
      });
    } catch (error) {
      console.error("Errore durante l'upsert della nota", error);
    }
  };

  const handleNewFolder = async () => {
    if (!email) return;
    try {
      const response = await fetch(`/api/folders?email=${email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "New Folder" }),
      });
      if (!response.ok) {
        throw new Error("Errore durante la creazione della cartella");
      }

      refreshFolders();
    } catch (error) {
      console.error("Errore nella creazione della cartella", error);
    }
  };

  const handleRenameFolder = async (folderId: number, newName: string) => {
    try {
      const response = await fetch(`/api/folders/${folderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      if (!response.ok) {
        throw new Error("Errore durante l'aggiornamento della cartella");
      }

      refreshFolders();
    } catch (error) {
      console.error("Errore nella rinominazione della cartella", error);
    }
  };

  const handleDeleteFolder = async (folderId: number) => {
    try {
      const response = await fetch(`/api/folders/${folderId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Errore durante l'eliminazione della cartella");
      }
      if (folderId === activeFolderId) {
        setActiveFolderId(undefined);
        setActiveNote(undefined);
      }
      refreshFolders();
    } catch (error) {
      console.error("Errore nell'eliminazione della cartella", error);
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    try {
      debugger
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Errore durante l'eliminazione della nota");
      }
      setNotes((prevNotes) => prevNotes.filter((n) => n.id !== noteId));
      if (activeNote && activeNote.id === noteId) {
        setActiveNote(undefined);
      }
    } catch (error) {
      console.error("Errore nell'eliminazione della nota", error);
    }
  };

  const handleSelectNote = (fileId: number | null) => {
    getNoteDetail(fileId).then();
  };

  useEffect(() => {
    if (folders && folders.length > 0 && !activeFolderId) {
      setActiveFolderId(folders[0].id);
    }
  }, [folders, activeFolderId]);

  return (
    <div>
      {!session ? (
        <SignIn />
      ) : (
        <main className="flex">
          <Sidebar
            session={session}
            folder={folders}
            changeFolder={(folderId) => setActiveFolderId(folderId)}
            onAddFolder={handleNewFolder}
            onRenameFolder={handleRenameFolder}
            onDeleteFolder={handleDeleteFolder}
          />
          <FileList
            files={notes}
            changeFiles={handleSelectNote}
            onAddNote={handleNewNote}
            onDeleteNote={handleDeleteNote}
          />
          <RichNote
            disableLeftBorder
            onNoteSaved={(e) => debouncedSaveNote(e.detail)}
            title={activeNote ? activeNote.title : ""}
            content={activeNote ? activeNote.content : ""}
          />
        </main>
      )}
    </div>
  );
};

export default Home;
