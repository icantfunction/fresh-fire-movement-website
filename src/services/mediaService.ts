import type {
  MediaArchiveItem,
  MediaSubmissionRequest,
  MediaUploadUrlRequest,
  MediaUploadUrlResponse,
} from "@/types/media";

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://y5w6n0i9vc.execute-api.us-east-1.amazonaws.com/prod";
const MEDIA_API = `${API_BASE}/media`;

export async function requestMediaUploadUrl(
  payload: MediaUploadUrlRequest
): Promise<MediaUploadUrlResponse> {
  const response = await fetch(`${MEDIA_API}/upload-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to request upload URL: ${response.status}`);
  }

  const data = await response.json();
  if (!data?.ok) {
    throw new Error("Upload URL request failed");
  }

  return data as MediaUploadUrlResponse;
}

export async function uploadMediaFile(
  uploadUrl: string,
  uploadFields: Record<string, string>,
  file: File,
  contentType: string
) {
  const formData = new FormData();
  Object.entries(uploadFields).forEach(([key, value]) => {
    formData.append(key, value);
  });
  if (!uploadFields["Content-Type"]) {
    formData.append("Content-Type", contentType);
  }
  formData.append("file", file);

  const response = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`S3 upload failed: ${response.status}`);
  }
}

export async function submitMediaForApproval(payload: MediaSubmissionRequest) {
  const response = await fetch(`${MEDIA_API}/submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to submit media: ${response.status}`);
  }

  const data = await response.json();
  if (!data?.ok) {
    throw new Error("Media submission failed");
  }

  return data;
}

export async function fetchMediaArchive(): Promise<MediaArchiveItem[]> {
  const response = await fetch(`${MEDIA_API}/archive`);

  if (!response.ok) {
    throw new Error(`Failed to fetch archive: ${response.status}`);
  }

  const data = await response.json();
  if (!data?.ok || !Array.isArray(data.items)) {
    return [];
  }

  return data.items as MediaArchiveItem[];
}
