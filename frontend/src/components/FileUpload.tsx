import { Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
export const FileUpload = ({
  onFileUpload,
}: {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <>
    <Button variant="outline" asChild>
      <label htmlFor="file-upload" className="cursor-pointer">
        <Upload className="mr-2 h-4 w-4" />
        Upload File
      </label>
    </Button>
    <Input
      id="file-upload"
      type="file"
      className="hidden"
      onChange={onFileUpload}
    />
  </>
);
