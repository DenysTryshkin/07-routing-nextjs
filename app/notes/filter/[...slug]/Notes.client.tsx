"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import css from "./NotesPage.module.css";

import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

import { createNote, deleteNote, fetchNotes } from "@/lib/api";
import type { NewNote, NoteTag } from "@/types/note";

interface NotesClientProps {
  tag?: NoteTag;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 300);

  const handleSearchInput = (value: string) => {
    setSearchInput(value);
    handleSearch(value);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, search, tag],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 12,
        search,
        tag,
      }),
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });

      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
    },
  });

  const handleDelete = (noteId: string) => {
    deleteMutation.mutate(noteId);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchInput} onSearch={handleSearchInput} />

        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSubmit={(values: NewNote) => {
              createMutation.mutate(values);
            }}
            onCancel={() => setIsModalOpen(false)}
            isSubmitting={createMutation.isPending}
          />

          {createMutation.isError && <p>Failed to create note.</p>}
        </Modal>
      )}

      {isLoading && <p>Loading...</p>}

      {isError && <p>Something went wrong.</p>}

      {data && data.notes.length > 0 && (
        <NoteList notes={data.notes} onDelete={handleDelete} />
      )}

      {deleteMutation.isError && <p>Failed to delete note.</p>}
    </div>
  );
}
