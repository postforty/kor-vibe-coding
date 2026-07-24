'use client';

import { marked } from 'marked';
import { useEffect, useState } from 'react';
import { BlockNoteEditor } from '@blocknote/core';
import { BlockNoteView } from '@blocknote/mantine';
import "@blocknote/core/fonts/inter.css";
import '@blocknote/mantine/style.css';

interface EditorProps {
  initialMarkdown: string;
  onChange: (markdown: string) => void;
}

export default function Editor({ initialMarkdown, onChange }: EditorProps) {
  const [editor, setEditor] = useState<BlockNoteEditor | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function init() {
      const e = BlockNoteEditor.create({
        uploadFile: async (file: File) => {
          try {
            const { BaseDirectory, writeFile, exists, mkdir } = await import('@tauri-apps/plugin-fs');
            const { appDataDir, join } = await import('@tauri-apps/api/path');
            const { convertFileSrc } = await import('@tauri-apps/api/core');

            const buffer = await file.arrayBuffer();
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const filename = uniqueSuffix + '-' + file.name.replace(/[^a-zA-Z0-9.]/g, '_');
            
            const dirExists = await exists('uploads', { baseDir: BaseDirectory.AppData });
            if (!dirExists) {
              await mkdir('uploads', { baseDir: BaseDirectory.AppData, recursive: true });
            }

            await writeFile(`uploads/${filename}`, new Uint8Array(buffer), { baseDir: BaseDirectory.AppData });
            
            const appDataPath = await appDataDir();
            const fullPath = await join(appDataPath, 'uploads', filename);
            return convertFileSrc(fullPath);
          } catch (e) {
            console.error("Upload error", e);
            return "";
          }
        }
      });
      if (initialMarkdown) {
        const html = await marked.parse(initialMarkdown, { gfm: true, breaks: true });
        const blocks = await e.tryParseHTMLToBlocks(html);
        e.replaceBlocks(e.document, blocks);
      } else {
        e.replaceBlocks(e.document, []); // clear if empty
      }
      
      if (isMounted) {
        setEditor(e);
      }
    }
    init();

    return () => {
      isMounted = false;
    };
  }, []); // 빈 배열로 수정하여 처음 렌더링(또는 key 변경) 시에만 초기화되도록 설정

  if (!editor) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-16 px-12 md:px-24">
      <BlockNoteView 
        editor={editor} 
        onChange={async () => {
          const blocks = editor.document;
          if (blocks.length > 0) {
            const lastBlock = blocks[blocks.length - 1];
            if (lastBlock.type === "image") {
              editor.insertBlocks([{ type: "paragraph", content: "" }], lastBlock, "after");
            }
          }
          const markdown = await editor.blocksToMarkdownLossy(editor.document);
          onChange(markdown);
        }}
        theme="light"
      />
    </div>
  );
}
