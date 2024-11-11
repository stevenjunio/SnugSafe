import { Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
export const FileUpload = ({
  onFileUpload,
}: {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <>
    <label htmlFor="file-upload">
      <Button variant="outline" asChild>
        <span>
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </span>
      </Button>
    </label>
    <Input
      id="file-upload"
      type="file"
      className="hidden"
      onChange={onFileUpload}
    />
  </>
);
