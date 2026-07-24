'use client';

import { FileText, Plus, FilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

type FileStat = {
  name: string;
  lastModified: number;
};

interface SidebarProps {
  files: FileStat[];
  currentFile: string | null;
  onSelect: (filename: string) => void;
  onNew: () => void;
}

export default function Sidebar({ files, currentFile, onSelect, onNew }: SidebarProps) {
  return (
    <div className="w-64 bg-[#fbfbfa] border-r border-[#e9e9e7] flex flex-col h-screen shrink-0">
      <div className="p-4 border-b border-[#e9e9e7] flex items-center justify-between">
        <h1 className="text-sm font-semibold text-[#37352f]">Private Workspace</h1>
        <Button 
          variant="ghost"
          size="icon"
          onClick={onNew}
          className="h-7 w-7 text-[#80807e] hover:bg-[#efefed] hover:text-[#37352f]"
          title="New Note"
        >
          <Plus size={18} />
        </Button>
      </div>
      <ScrollArea className="flex-1 py-2">
        {files.length === 0 && (
          <div className="px-4 py-8 text-center text-[#80807e] text-sm flex flex-col items-center">
            <FilePlus size={24} className="mb-2 opacity-30" />
            <p>No documents yet</p>
          </div>
        )}
        {files.map((file) => (
          <Button
            key={file.name}
            variant="ghost"
            onClick={() => onSelect(file.name)}
            className={`w-full justify-start px-4 h-8 rounded-none text-[14px] transition-colors ${
              currentFile === file.name 
                ? 'bg-[#efefed] font-medium text-[#37352f] hover:bg-[#efefed]' 
                : 'text-[#37352f] font-normal hover:bg-[#efefed]'
            }`}
          >
            <FileText size={16} className={`mr-2 shrink-0 ${currentFile === file.name ? 'text-[#37352f]' : 'text-[#80807e]'}`} />
            <span className="truncate">{file.name.replace('.md', '')}</span>
          </Button>
        ))}
      </ScrollArea>
    </div>
  );
}
