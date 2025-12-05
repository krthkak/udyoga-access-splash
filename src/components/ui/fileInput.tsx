"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

interface FileInputProps {
  label?: string;
  value?: FileList | null;
  onChange?: (files: File | File[] | null) => void;
  multiple?: boolean;
  accept?: string;
}

export function FileInput({
  value,
  onChange,
  multiple = false,
  accept,
}: FileInputProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleClick = () => inputRef.current?.click();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return onChange?.(null);
    onChange?.(multiple ? Array.from(files) : files[0]);
  };

  const fileLabel = React.useMemo(() => {
    if (!value) return "No file selected";
    if (Array.from(value) && Array.from(value).length > 1)
      return `${value.length} file(s) selected`;

    return (value as unknown as File).name;
  }, [value]);

  return (
    <div className="flex items-center gap-3 mt-2">
      <Button type="button" variant="outline" onClick={handleClick}>
        {multiple ? "Upload Files" : "Upload File"}
      </Button>
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        accept={accept}
        multiple={multiple}
        className="hidden"
      />
      <p className="text-sm text-muted-foreground truncate max-w-[200px]">
        {fileLabel}
      </p>
    </div>
  );
}
