'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { BaseDirectory, readDir, readTextFile, writeTextFile, mkdir, exists, stat } from '@tauri-apps/plugin-fs';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

type FileStat = {
  name: string;
  lastModified: number;
};

export default function Home() {
  const [files, setFiles] = useState<FileStat[]>([]);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [markdown, setMarkdown] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isNewFileDialogOpen, setIsNewFileDialogOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  
  const initDir = async () => {
    try {
      const dirExists = await exists('documents', { baseDir: BaseDirectory.AppData });
      if (!dirExists) {
        await mkdir('documents', { baseDir: BaseDirectory.AppData, recursive: true });
      }
    } catch (e) {
      console.error("Failed to init dir", e);
    }
  };

  const fetchFiles = async () => {
    try {
      await initDir();
      const entries = await readDir('documents', { baseDir: BaseDirectory.AppData });
      const mdFiles = entries.filter(e => e.name?.endsWith('.md'));
      
      const fileStats = await Promise.all(mdFiles.map(async (file) => {
        const fileStat = await stat(`documents/${file.name}`, { baseDir: BaseDirectory.AppData });
        return {
          name: file.name as string,
          lastModified: fileStat.mtime?.getTime() || 0,
        };
      }));

      fileStats.sort((a, b) => b.lastModified - a.lastModified);
      setFiles(fileStats);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleSelectFile = async (filename: string) => {
    try {
      const content = await readTextFile(`documents/${filename}`, { baseDir: BaseDirectory.AppData });
      setMarkdown(content);
      setCurrentFile(filename);
    } catch (e) {
      console.error(e);
    }
  };

  const handleNewFile = () => {
    setNewFileName('');
    setIsNewFileDialogOpen(true);
  };

  const submitNewFile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const name = newFileName.trim();
    if (!name) return;
    
    setIsNewFileDialogOpen(false);
    const filename = name.endsWith('.md') ? name : `${name}.md`;
    setCurrentFile(filename);
    const initialContent = `# ${name.replace('.md', '')}\n\n`;
    setMarkdown(initialContent);
    
    try {
      await writeTextFile(`documents/${filename}`, initialContent, { baseDir: BaseDirectory.AppData });
      fetchFiles();
    } catch (e) {
      console.error(e);
    }
  };

  // Auto-save logic
  useEffect(() => {
    if (!currentFile) return;

    const timeoutId = setTimeout(async () => {
      setIsSaving(true);
      try {
        await writeTextFile(`documents/${currentFile}`, markdown, { baseDir: BaseDirectory.AppData });
        // Fetch files silently to update order if needed
        fetchFiles();
      } catch (e) {
        console.error(e);
      }
      setIsSaving(false);
    }, 1000); // 1s debounce

    return () => clearTimeout(timeoutId);
  }, [markdown, currentFile]);

  return (
    <>
      <div className="flex h-screen bg-white text-[#37352f]">
      <Sidebar 
        files={files} 
        currentFile={currentFile} 
        onSelect={handleSelectFile} 
        onNew={handleNewFile} 
      />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-12 border-b border-transparent flex items-center justify-between px-6 bg-white shrink-0">
          <div className="text-sm font-medium text-[#37352f]">
            {currentFile ? currentFile.replace('.md', '') : ''}
          </div>
          <div className="text-xs text-[#80807e]">
            {isSaving ? '저장 중...' : currentFile ? '저장됨' : ''}
          </div>
        </header>

        {/* Editor Area */}
        <main className="flex-1 overflow-y-auto">
          {currentFile ? (
            <Editor key={currentFile} initialMarkdown={markdown} onChange={setMarkdown} />
          ) : (
            <div className="flex-1 h-full flex items-center justify-center text-[#80807e] flex-col gap-4">
              <div className="text-center">
                <h2 className="text-xl font-medium mb-2 text-[#37352f]">Notion 스타일 마크다운 에디터</h2>
                <p className="text-sm">사이드바에서 문서를 선택하거나 '+' 버튼을 눌러 새 문서를 작성해보세요.</p>
              </div>
              <Button onClick={handleNewFile}>새 문서 작성하기</Button>
            </div>
          )}
        </main>
      </div>
    </div>
      <Dialog open={isNewFileDialogOpen} onOpenChange={setIsNewFileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 문서 작성</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitNewFile} className="flex flex-col gap-4 py-4">
            <Input 
              placeholder="문서 이름을 입력하세요..." 
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              autoFocus
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsNewFileDialogOpen(false)}>취소</Button>
              <Button type="submit">생성</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

