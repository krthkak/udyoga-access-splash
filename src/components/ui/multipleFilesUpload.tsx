"use client";

import React, { useState } from "react";
import { File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface FileUploaderProps {
  label?: string;
  onChange?: (files: File[]) => void;
}

export const MultipleFilesUpload: React.FC<FileUploaderProps> = ({
  label = "Upload files",
  onChange,
}) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const newFiles = [...files, ...selected];
    setFiles(newFiles);
    onChange?.(newFiles);
  };

  const handleRemove = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onChange?.(updated);
  };

  const handleDownload = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      <Label className="font-medium">{label}</Label>

      <div className="flex flex-col items-start gap-3">
        <input
          id="fileInput"
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          Choose Files
        </Button>

        {files.length > 0 && (
          <div className="w-full flex flex-wrap items-center">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center  px-2 py-1  gap-0.5"
              >
                <Button
                  type="button"
                  variant={"link"}
                  onClick={() => handleDownload(file)}
                >
                  <File />
                  {file.name}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-0 -m-2.5  text-sm text-red-500"
                  onClick={() => handleRemove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
