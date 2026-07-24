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
          const body = new FormData();
          body.append("file", file);
          const ret = await fetch("/api/upload", {
            method: "POST",
            body: body,
          });
          const data = await ret.json();
          return data.url;
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
