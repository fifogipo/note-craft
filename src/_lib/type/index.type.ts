type Note = {
  id: number;
  title: string;
  content: string;
  folderId: number;
  userId: string;
  createdAt: string;
};

type Folder = {
  id: number;
  name: string;
  userId: string;
  createdAt: Date;
};
