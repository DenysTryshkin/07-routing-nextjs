import axios from "axios";
import type { NewNote, Note, NoteTag } from "@/types/note";

const API_URL = "https://notehub-public.goit.study/api";

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: NoteTag;
}

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async ({
  page,
  perPage,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await api.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage,
      search,
      ...(tag ? { tag } : {}),
    },
  });
  return response.data;
};

export const createNote = async (newNote: NewNote): Promise<Note> => {
  const response = await api.post<Note>("/notes", newNote);

  return response.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${noteId}`);

  return response.data;
};

export const fetchNoteById = async (noteId: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${noteId}`);

  return response.data;
};
