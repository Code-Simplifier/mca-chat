"use client";

import Image from "next/image";

import { bold, primary } from "@/app/fonts";
import { UploadDropzone } from "@/lib/uploadthing";

import "@uploadthing/react/styles.css";
import { RxCross2 } from "react-icons/rx";

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
  return (
    <UploadDropzone
      appearance={{
        label: `text-primary tracking-wide ${primary.className}`,
        allowedContent: `text-zinc-400 uppercase mt-2 ${bold.className}`,
        container: "border-dashed border-2 px-4 py-2 border-primary",
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
