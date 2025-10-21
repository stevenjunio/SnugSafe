import { useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const FileUpload = ({
  onFileUpload,
}: {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Button variant="outline" onClick={handleButtonClick}>
        <Upload className="mr-2 h-4 w-4" />
        Upload File
      </Button>
      <Input
        ref={fileInputRef}
        id="file-upload"
        type="file"
        className="hidden"
        onChange={onFileUpload}
      />
    </>
  );
};
