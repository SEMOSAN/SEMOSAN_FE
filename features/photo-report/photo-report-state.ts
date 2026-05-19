type PhotoReportState = {
  photoSource: number | { uri: string } | null;
  templateIndex: number;
};

let state: PhotoReportState = {
  photoSource: null,
  templateIndex: 0,
};

export function getPhotoReportState(): PhotoReportState {
  return { ...state };
}

export function setPhotoReportState(updates: Partial<PhotoReportState>) {
  state = { ...state, ...updates };
}
