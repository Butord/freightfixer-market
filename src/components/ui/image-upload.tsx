
import { ImagePlus } from "lucide-react";

interface ImageUploadProps {
  previewUrl: string | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ImageUpload({ previewUrl, onChange }: ImageUploadProps) {
  return (
    <div className="flex items-center justify-center w-full">
      <label className="relative w-full h-32 flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
        {previewUrl ? (
          <div className="absolute inset-0 w-full h-full">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain p-2"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <ImagePlus className="w-8 h-8 mb-4 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Натисніть для завантаження</span> або перетягніть файл
            </p>
          </div>
        )}
        <input
          type="file"
          name="image"
          className="hidden"
          accept="image/*"
          onChange={onChange}
        />
      </label>
    </div>
  );
}
