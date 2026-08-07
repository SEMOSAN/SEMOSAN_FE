import { useState } from "react";

export function useWriteForm(initialTitle = "", initialBody = "") {
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);

  const isSubmittable = title.trim().length > 0;

  return { title, setTitle, body, setBody, isSubmittable };
}
