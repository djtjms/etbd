import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, GripVertical, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

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
  const [dragOver, setDragOver] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Error", description: "Please upload an image file", variant: "destructive" });
      return null;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Error", description: "Image must be less than 10MB", variant: "destructive" });
      return null;
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(fileName, file);

    if (uploadError) {
      if (import.meta.env.DEV) console.error("Upload error:", uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("uploads")
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleMultipleFiles = async (files: FileList) => {
    if (value.length + files.length > maxImages) {
      toast({ 
        title: "Limit Exceeded", 
        description: `Maximum ${maxImages} images allowed`, 
        variant: "destructive" 
      });
      return;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const url = await uploadImage(file);
        if (url) uploadedUrls.push(url);
      }

      if (uploadedUrls.length > 0) {
        onChange([...value, ...uploadedUrls]);
        toast({ 
          title: "Success", 
          description: `${uploadedUrls.length} image(s) uploaded successfully` 
        });
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Some images failed to upload",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files.length > 0) {
      handleMultipleFiles(e.dataTransfer.files);
    }
  }, [value, maxImages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleMultipleFiles(e.target.files);
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange(newUrls);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newUrls = [...value];
    const [draggedItem] = newUrls.splice(draggedIndex, 1);
    newUrls.splice(index, 0, draggedItem);
    onChange(newUrls);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className={className}>
      {/* Uploaded Images Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
          {value.map((url, index) => (
            <div
              key={url}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`
                relative group rounded-xl overflow-hidden bg-secondary border border-border
                aspect-video cursor-move transition-all
                ${draggedIndex === index ? "opacity-50 scale-95" : ""}
              `}
            >
              <img
                src={url}
                alt={`Screenshot ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <GripVertical size={16} className="absolute top-2 left-2 text-muted-foreground" />
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Eye size={14} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl p-2">
                    <img src={url} alt="Preview" className="w-full h-auto rounded-lg" />
                  </DialogContent>
                </Dialog>

                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleRemove(index)}
                >
                  <X size={14} />
                </Button>
              </div>

              <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {value.length < maxImages && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            relative h-32 rounded-xl border-2 border-dashed cursor-pointer
            transition-all flex flex-col items-center justify-center gap-2
            ${dragOver 
              ? "border-primary bg-primary/10" 
              : "border-border hover:border-primary/50 bg-secondary/50"
            }
          `}
        >
          {uploading ? (
            <>
              <Loader2 size={28} className="text-primary animate-spin" />
              <span className="text-sm text-muted-foreground">Uploading...</span>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <Upload size={20} className="text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm text-foreground font-medium">
                  Drop images or click to upload
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {value.length}/{maxImages} images • PNG, JPG up to 10MB each
                </p>
              </div>
            </>
          )}
        </div>
      )}
      
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
