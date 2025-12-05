"use client";

import React, { useState } from "react";
import { Camera, X } from "lucide-react";

interface Props {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
}

export default function ImageUpload({ setFile }: Props) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Create a preview for UI
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  return (
    <div className="relative">
      <label className="cursor-pointer">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <div
          className={`
              w-32 h-32 rounded-full flex items-center justify-center 
              border-2 border-dashed border-gray-300 overflow-hidden
              hover:border-gray-400 transition
              bg-gray-50
            `}
        >
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="object-cover w-full h-full rounded-full"
            />
          ) : (
            <Camera className="w-8 h-8 text-gray-500" />
          )}
        </div>
      </label>

      {preview && (
        <button
          onClick={removeFile}
          className="absolute top-0 right-0 bg-white p-1 rounded-full shadow hover:bg-gray-100"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      )}
    </div>
  );
}
