type PhotoReportState = {
  sessionId: number | null;
  photoSource: number | { uri: string } | null;
  templateIndex: number;
};

let state: PhotoReportState = {
  sessionId: null,
  photoSource: null,
  templateIndex: 0,
};

export function getPhotoReportState(): PhotoReportState {
  return { ...state };
}

export function setPhotoReportState(updates: Partial<PhotoReportState>) {
  state = { ...state, ...updates };
}
