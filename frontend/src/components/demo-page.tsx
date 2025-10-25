import React, { useState, useEffect } from "react";
import { FileUpload } from "./FileUpload";
import { DemoFileList } from "./DemoFileList";
import { FileSystem } from "@/types/file.types";

export function DemoPageComponent() {
  const [files, setFiles] = useState<FileSystem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingFileName, setUploadingFileName] = useState("");

  // Load files from sessionStorage on mount
  useEffect(() => {
    const storedFiles = sessionStorage.getItem("demo-files");
    if (storedFiles) {
      setFiles(JSON.parse(storedFiles));
    }
  }, []);

  // Save files to sessionStorage whenever they change
  useEffect(() => {
    sessionStorage.setItem("demo-files", JSON.stringify(files));
  }, [files]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadingFileName(file.name);

      // Simulate upload delay for realism
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Read file as base64 for storage in sessionStorage
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target?.result as string;

        const newFile: FileSystem = {
          id: `demo-${Date.now()}-${file.name}`,
          name: file.name,
          size: file.size,
          itemType: "file",
          type: file.type,
        };

        // Store file data separately with base64 content
        const fileData = {
          ...newFile,
          content: base64Data,
        };

        // Store file content in sessionStorage
        sessionStorage.setItem(`demo-file-${newFile.id}`, JSON.stringify(fileData));

        // Add to files list
        setFiles((prev) => [...prev, newFile]);
        setIsUploading(false);
        setUploadingFileName("");
      };

      reader.readAsDataURL(file);
    }
    event.target.value = "";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 justify-between items-center sm:flex-row sm:gap-2">
        <h1 className="text-3xl font-bold">Your Files (Demo)</h1>
        <div className="flex space-x-2">
          <FileUpload onFileUpload={handleFileUpload} />
        </div>
      </div>
      {files.length === 0 && !isUploading && (
        <div className="text-gray-500 text-center py-8">
          No files yet. Upload your first file to try it out!
        </div>
      )}
      {isUploading && (
        <div className="text-blue-600">
          Uploading... <span className="font-bold">{uploadingFileName}</span>
        </div>
      )}
      {files.length > 0 && <DemoFileList files={files} setFiles={setFiles} />}
    </div>
  );
}
