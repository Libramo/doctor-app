import { convertFileToUrl } from "@/lib/utils";
import Image from "next/image";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

type FileUploaderProps = {
  files: File[] | undefined;
  onChange: (files: File[]) => void;
};

const FileUploder = ({ files, onChange }: FileUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    onChange(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="file-upload" {...getRootProps()}>
      <input {...getInputProps()} />
      {files && files?.length > 0 ? (
        <Image
          src={convertFileToUrl(files[0])}
          width={1000}
          height={1000}
          alt="uploaded image"
          className="max-h-[400px] overflow-hidden object-cover"
        />
      ) : (
        <>
          <Image
            src="/assets/icons/upload.svg"
            height={40}
            width={40}
            alt="uplaod"
          />
          <div className="file-upload_label">
            <p className="text-text-14-regular">
              <span className="text-green-500">
                Cliquer ici pour telecharger
              </span>{" "}
              ou glisser ici votre fichier
            </p>
            <p>SVG, PNG, PDF, max (400x800)</p>
          </div>
        </>
      )}
    </div>
  );
};

export default FileUploder;
