const imgbbApiKey =
  process.env.NEXT_PUBLIC_IMGBB_API_KEY;

const supportedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const maximumFileSize = 5 * 1024 * 1024;

export async function uploadPromptCover(file) {
  if (!file) {
    throw new Error(
      "Choose a marketplace prompt thumbnail.",
    );
  }

  if (!supportedTypes.includes(file.type)) {
    throw new Error(
      "Use a JPG, PNG, or WebP prompt thumbnail.",
    );
  }

  if (file.size > maximumFileSize) {
    throw new Error(
      "The prompt thumbnail must be smaller than 5 MB.",
    );
  }

  if (!imgbbApiKey) {
    throw new Error(
      "The ImgBB API key is not configured.",
    );
  }

  const formData = new FormData();

  formData.append("image", file);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${encodeURIComponent(
      imgbbApiKey,
    )}`,
    {
      method: "POST",
      body: formData,
    },
  );

  const data = await response.json().catch(() => null);

  if (
    !response.ok ||
    !data?.success ||
    !data?.data?.url
  ) {
    throw new Error(
      data?.error?.message ||
        "The prompt thumbnail could not be uploaded to ImgBB.",
    );
  }

  return {
    id: data.data.id,
    url: data.data.url,
    displayUrl:
      data.data.display_url || data.data.url,
    viewerUrl: data.data.url_viewer,
    deleteUrl: data.data.delete_url,
  };
}