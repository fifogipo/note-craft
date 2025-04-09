// Custom hook per il fetching delle note in base alla cartella
import { useEffect, useState } from "react";

export const useNote = (email: string | null | undefined, folderId?: number) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!email || !folderId) return;
    setLoading(true);
    fetch(`/api/notes?email=${email}&folderId=${folderId}`)
      .then((res) => res.json())
      .then((data: Note[]) => {
        setNotes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore nel fetching delle note", err);
        setError(err);
        setLoading(false);
      });
  }, [email, folderId]);

  return { notes, loading, error, setNotes };
};
