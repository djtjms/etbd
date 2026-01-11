import { useState, useRef } from "react";
import { Upload, X, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GalleryUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  maxImages?: number;
  className?: string;
}

export function GalleryUpload({ 
  value = [], 
  onChange, 
  folder = "gallery", 
  maxImages = 10,
  className = "" 
}: GalleryUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadImage = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Error", description: "Please upload an image file", variant: "destructive" });
      return null;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Error", description: "Image must be less than 5MB", variant: "destructive" });
      return null;
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("uploads")
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (value.length + files.length > maxImages) {
      toast({ 
        title: "Error", 
        description: `Maximum ${maxImages} images allowed`, 
        variant: "destructive" 
      });
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = files.map(uploadImage);
      const urls = await Promise.all(uploadPromises);
      const validUrls = urls.filter(Boolean) as string[];
      
      onChange([...value, ...validUrls]);
      toast({ title: "Success", description: `${validUrls.length} image(s) uploaded` });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleRemove = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {value.map((url, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
            <img
              src={url}
              alt={`Gallery ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        {value.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 bg-secondary/50 flex flex-col items-center justify-center gap-2 transition-colors"
          >
            {uploading ? (
              <Loader2 size={24} className="text-primary animate-spin" />
            ) : (
              <>
                <Plus size={24} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Add Image</span>
              </>
            )}
          </button>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground mt-2">
        {value.length}/{maxImages} images
      </p>
      
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
