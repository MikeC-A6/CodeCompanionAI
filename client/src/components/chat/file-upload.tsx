import { FC, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileUpload: (files: { name: string; content: string }[]) => void;
}

export const FileUpload: FC<FileUploadProps> = ({ onFileUpload }) => {
  const { toast } = useToast();

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const fileContents = await Promise.all(
      files.map(async (file) => {
        const text = await file.text();
        return { name: file.name, content: text };
      })
    );

    onFileUpload(fileContents);
    toast({
      title: 'Files uploaded',
      description: `${files.length} file(s) added to context`,
    });
  }, [onFileUpload, toast]);

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        multiple
        accept=".ts,.tsx,.js,.jsx,.txt"
        onChange={handleFileChange}
      />
      <Button
        variant="outline"
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <Upload className="h-4 w-4 mr-2" />
        Upload Files
      </Button>
    </div>
  );
};
