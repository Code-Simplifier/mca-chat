"use client";

import Image from "next/image";

import { bold, primary } from "@/app/fonts";
import { UploadDropzone } from "@/lib/uploadthing";

import "@uploadthing/react/styles.css";
import { RxCross2 } from "react-icons/rx";
import { FileIcon } from "lucide-react";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
}

export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image fill src={value} alt="Upload" className="rounded-full" />
        <button
          onClick={() => onChange("")}
          type="button"
          className="bg-tertiary text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
        >
          <RxCross2 className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (value && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md">
        <FileIcon className="h-10 w-10 fill-primary stroke-secondary" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-secondary hover:underline"
        >
          {value}
        </a>
        <button
          onClick={() => onChange("")}
          type="button"
          className="bg-tertiary text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
        >
          <RxCross2 className="h-4 w-4" />
        </button>
      </div>
    );
  }
  return (
    <UploadDropzone
      appearance={{
        label: `text-tertiary hover:text-secondary tracking-wide ${primary.className}`,
        allowedContent: `text-zinc-400 uppercase mt-2 ${bold.className}`,
        container: "border-dashed border-2 px-4 py-2 border-tertiary",
        button: "bg-tertiary",
      }}
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
};
