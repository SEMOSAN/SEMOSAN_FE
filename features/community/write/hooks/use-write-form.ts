import { useState } from "react";

export function useWriteForm(initialTitle = "", initialBody = "") {
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);

  // 서버는 title·content를 모두 필수로 받고 비면 400("본문 누락")을 준다.
  // 제목만 검사하면 버튼이 열려 요청이 나가고 실패 토스트만 뜬다.
  const isSubmittable = title.trim().length > 0 && body.trim().length > 0;

  return { title, setTitle, body, setBody, isSubmittable };
}
