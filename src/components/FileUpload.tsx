import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
  UploadResponse,
} from "@imagekit/next";
import { useRef, useState } from "react";
import { ShimmerButton } from "./magicui/shimmer-button";

interface FileUploadProps {
  onSuccess: (res: UploadResponse) => void;
  onProgress: (Progress: number) => void;
  fileType?: "image" | "video";
}

const FileUpload = ({ onSuccess, onProgress, fileType }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //optional validation
  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("upload valid type");
      }
    }

    if (file.size > 100 * 1024 * 1024) {
      setError("file size should be less than 100mb");
    }

    return true;
  };

  // handle file change if file is valid 
  const handleFileChange = async (e : React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if(!file || !validateFile(file)) return;

    setUploading(true);
    setError(null);
    

    // upload file allows us to upload file to imagekit
    try {

        //fetch auth params from backend
        const authRes = await fetch("/api/auth/imagekit-auth")
        const authData = await authRes.json();
       
        const res = await upload({
             expire : authData.expire,
                token : authData.token,
                signature : authData.signature,
                publicKey : process.env.NEXT_PUBLIC_PUBLIC_KEY!,
                file,
                fileName: file.name,                
    
                onProgress: (event) => {

                    if(event.lengthComputable && onProgress) {
                        const percent = Math.round((event.loaded / event.total) * 100);
                        onProgress(percent);
                    }   
                },
        })

        console.log("authData", authData);

        onSuccess(res);

    } catch (error) {

        console.log("Error uploading file" , error);
        
    }finally {
        setUploading(false);
    }
  }

  return (
<>
  <div className="w-full flex flex-col items-center justify-center gap-4 p-4 border border-dashed border-gray-500 rounded-xl  transition duration-200 ease-in-out">
    <label className="text-sm font-semibold text-gray-700">
      Upload {fileType === "video" ? "Video" : "Image"}
    </label>

    <input
      type="file"
      accept={fileType === "video" ? "video/*" : "image/*"}
      onChange={handleFileChange}
      className="block w-fit text-sm text-gray-700
                 file:mr-4 file:py-2 file:px-4
                 file:rounded-lg file:border-0
                 file:text-sm file:font-semibold
                 file:bg-neutral-300 file:text-neutral-700
                 cursor-pointer"
    />

    {uploading && (
      <p className="text-sm text-blue-400 animate-pulse">⏳ Uploading...</p>
    )}

    {error && (
      <p className="text-sm text-red-500 font-medium">❌ {error}</p>
    )}
  </div>
</>

  );
};

export default FileUpload;
