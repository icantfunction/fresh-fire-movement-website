export interface MediaUploadUrlRequest {
  fileName: string;
  contentType: string;
  capturedAt: string;
}

export interface MediaUploadUrlResponse {
  ok: boolean;
  submissionId: string;
  objectKey: string;
  uploadUrl: string;
  uploadFields: Record<string, string>;
}

export interface MediaSubmissionRequest {
  submissionId: string;
  objectKey: string;
  fileName: string;
  contentType: string;
  title: string;
  description?: string;
  capturedAt: string;
  submittedBy: string;
}

export interface MediaArchiveItem {
  submissionId: string;
  title: string;
  description?: string;
  mediaType: "image" | "video";
  previewUrl: string;
  capturedAt: string;
  approvedAt: string;
}
