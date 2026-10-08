'use client'

import { convertFileToUrl } from "@/lib/utils";
import Image from "next/image";
import React, {useCallback} from "react";
import {useDropzone} from "react-dropzone";

type FileUploaderProps = {
    files: File[] | undefined;
    onChange: (files: File[]) => void;
}

const FileUploader = ({files, onChange}: FileUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    onChange(acceptedFiles);
  }, [onChange]);

  const {getRootProps, getInputProps} = useDropzone({onDrop});

  return (
    <div {...getRootProps()}  className="file-upload">
      <input {...getInputProps()} />
      {files && files.length > 0 ? (
        <Image
          src={convertFileToUrl(files[0])}
          width={1000}
          height={1000}
          alt="Fichier téléversé"
          className="max-h-[400px] overflow-hidden object-cover" 
        />
      ): (
        <> 
          <Image
            src="/assets/icons/upload.svg"
            width={40}
            height={40}
            alt="Icône de téléversement"
          /> 
          <div className="file-upload-label">
            <p>
              <span className="text-green-500">Importer un fichier</span>
              {" "}ou glissez-déposez-le ici
            </p>
            <p>
              SVG, PNG, JPG ou GIF (800 × 400 px maximum)
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default FileUploader
