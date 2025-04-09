import { useState, useEffect, useCallback } from "react";

export const useFolder = (email: string | null | undefined) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchFolders = useCallback(() => {
    if (!email) return;
    setLoading(true);
    fetch(`/api/folders?email=${email}`)
      .then((res) => res.json())
      .then((data: Folder[]) => {
        setFolders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore nel fetching delle cartelle", err);
        setError(err);
        setLoading(false);
      });
  }, [email]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  const refreshFolders = () => {
    fetchFolders();
  };

  return { folders, loading, error, refreshFolders, setFolders };
};
