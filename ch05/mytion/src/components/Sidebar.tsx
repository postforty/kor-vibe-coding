'use client';

import { FileText, Plus, FilePlus } from 'lucide-react';

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
        <button 
          onClick={onNew}
          className="p-1 hover:bg-[#efefed] rounded text-[#80807e] hover:text-[#37352f] transition-colors"
          title="New Note"
        >
          <Plus size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {files.length === 0 && (
          <div className="px-4 py-8 text-center text-[#80807e] text-sm flex flex-col items-center">
            <FilePlus size={24} className="mb-2 opacity-30" />
            <p>No documents yet</p>
          </div>
        )}
        {files.map((file) => (
          <button
            key={file.name}
            onClick={() => onSelect(file.name)}
            className={`w-full text-left px-4 py-1.5 flex items-center gap-2 text-[14px] transition-colors ${
              currentFile === file.name 
                ? 'bg-[#efefed] font-medium text-[#37352f]' 
                : 'text-[#37352f] hover:bg-[#efefed]'
            }`}
          >
            <FileText size={16} className={currentFile === file.name ? 'text-[#37352f]' : 'text-[#80807e]'} />
            <span className="truncate">{file.name.replace('.md', '')}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
