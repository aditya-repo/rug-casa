import { API_URL } from "./config";
import { getClientAccessToken } from "./auth-storage";
import { ApiError } from "./fetch";

export type UploadFolder = "products" | "categories" | "banners" | "collections" | "reviews" | "seo";

export interface UploadedImage {
  path: string;
  thumbnail: string;
  relativePath: string;
  relativeThumbnail: string;
}

export async function uploadMediaClient(
  folder: UploadFolder,
  files: File | File[],
): Promise<UploadedImage[]> {
  const fileList = Array.isArray(files) ? files : [files];
  const formData = new FormData();
  for (const file of fileList) {
    formData.append("files", file);
  }

  const token = getClientAccessToken();
  const res = await fetch(`${API_URL}/media/${folder}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const body = (await res.json()) as {
    success: boolean;
    message?: string;
    data?: UploadedImage[];
    error?: { code?: string };
  };

  if (!res.ok || !body.success) {
    throw new ApiError(res.status, body.message ?? "Upload failed", body.error?.code);
  }

  return body.data ?? [];
}
