import { useState } from "react";

export function useWriteForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const isSubmittable = title.trim().length > 0;

  return { title, setTitle, body, setBody, isSubmittable };
}
