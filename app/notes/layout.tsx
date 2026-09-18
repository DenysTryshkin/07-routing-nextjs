import type { ReactNode } from "react";

interface NotesLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

export default function NotesLayout({ children, modal }: NotesLayoutProps) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
