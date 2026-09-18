import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";
import type { NoteTag } from "@/types/note";

const noteTags: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

interface NotesFilterPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function NotesFilterPage({
  params,
}: NotesFilterPageProps) {
  const { slug } = await params;

  const currentTag = slug[0];

  const tag =
    currentTag === "all" || !noteTags.includes(currentTag as NoteTag)
      ? undefined
      : (currentTag as NoteTag);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        search: "",
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
