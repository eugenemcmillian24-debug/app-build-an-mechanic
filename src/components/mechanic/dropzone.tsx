'use client';

import { useCallback, useState } from 'react';
import { Upload, FileCode, X } from 'lucide-react';

interface FileItem {
  path: string;
  content: string;
}

interface DropzoneProps {
  onFilesLoaded: (files: FileItem[]) => void;
}

export default function Dropzone({ onFilesLoaded }: DropzoneProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const items = e.dataTransfer.items;
      const newFiles: FileItem[] = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) {
            const content = await file.text();
            newFiles.push({ path: file.name, content });
          }
        }
      }

      const updated = [...files, ...newFiles];
      setFiles(updated);
      onFilesLoaded(updated);
    },
    [files, onFilesLoaded]
  );

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = e.target.files;
      if (!fileList) return;

      const newFiles: FileItem[] = [];
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const content = await file.text();
        newFiles.push({ path: file.name, content });
      }

      const updated = [...files, ...newFiles];
      setFiles(updated);
      onFilesLoaded(updated);
    },
    [files, onFilesLoaded]
  );

  const removeFile = useCallback(
    (index: number) => {
      const updated = files.filter((_, i) => i !== index);
      setFiles(updated);
      onFilesLoaded(updated);
    },
    [files, onFilesLoaded]
  );

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
          isDragging
            ? 'border-violet-500 bg-violet-950/20'
            : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-600'
        }`}
      >
        <input
          type="file"
          multiple
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
          accept=".js,.jsx,.ts,.tsx,.vue,.svelte,.html,.css,.json,.py,.dart"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="h-10 w-10 text-zinc-500 mx-auto mb-3" />
          <p className="text-sm font-medium text-zinc-300">
            Drop files here or click to upload
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            Supports JS, TS, JSX, TSX, Vue, Svelte, HTML, CSS, JSON, Python, Dart
          </p>
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-400">
            {files.length} file{files.length !== 1 ? 's' : ''} loaded
          </p>
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <FileCode className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-mono text-zinc-300">{file.path}</span>
                <span className="text-xs text-zinc-600">
                  {(file.content.length / 1024).toFixed(1)}KB
                </span>
              </div>
              <button
                onClick={() => removeFile(i)}
                className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
