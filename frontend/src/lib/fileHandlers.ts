import { FileShare } from "@/types/file.types";
import getFileURL from "@/lib/openS3File";

export const handleOpenFile = async (
  fileShare: FileShare,
  sessionToken: string,
  setError: (error: string | null) => void
) => {
  console.log(`openining file`, fileShare.userFileID);
  console.log(`the session token is`, sessionToken);

  //check that the user has a valid userFileKey by hitting the server endpoint
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/file/share/${fileShare.id}`,
    {
      credentials: "include", // Ensure cookies are sent with the request
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );
  console.log(`the response is`, response);
  const data = await response.json();
  console.log(`the data from the server is`, data);
  if (data.error) {
    console.error(`Error:`, data.error);
    setError(data.error);
    return;
  }
  const fileURL = await getFileURL(fileShare.userFile.id);

  // open file in new tab
  window.open(fileURL, "_blank");
};
