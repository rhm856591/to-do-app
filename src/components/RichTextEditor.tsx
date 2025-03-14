'use client';

import { useState, useEffect, useRef } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Strikethrough, Heading1 } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(!value);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value || '';
      setIsEmpty(!value);
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
      setIsEmpty(!content || content === '<br>');
    }
  };

  const formatText = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      editorRef.current.focus();
    }
  };

  return (
    <div className="border rounded-xl shadow-md bg-white dark:bg-gray-900 transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap rounded-t-xl rounded-b-xl items-center p-2 border-b bg-gray-50 dark:bg-gray-800 gap-1">
        <ToolbarButton onClick={() => formatText('bold')} title="Bold">
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => formatText('italic')} title="Italic">
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => formatText('underline')} title="Underline">
          <Underline size={16} />
        </ToolbarButton>
        <Separator />
        <ToolbarButton onClick={() => formatText('insertUnorderedList')} title="Bullet List">
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => formatText('insertOrderedList')} title="Numbered List">
          <ListOrdered size={16} />
        </ToolbarButton>
        <Separator />
        <ToolbarButton onClick={() => formatText('justifyLeft')} title="Align Left">
          <AlignLeft size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => formatText('justifyCenter')} title="Align Center">
          <AlignCenter size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => formatText('justifyRight')} title="Align Right">
          <AlignRight size={16} />
        </ToolbarButton>
        <Separator />
        <ToolbarButton onClick={() => formatText('strikeThrough')} title="Strike Through">
          <Strikethrough size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => formatText('formatBlock', 'H1')} title="Heading">
          <Heading1 size={16} />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          className="w-full h-64 md:h-96 p-4 outline-none overflow-y-auto text-left"
          onInput={handleInput}
          style={{
            minHeight: '200px',
            direction: 'ltr',
            textAlign: 'left',
          }}
          data-placeholder={placeholder}
        />

        {isEmpty && placeholder && (
          <div className="absolute top-4 left-4 pointer-events-none text-gray-400">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
}

function ToolbarButton({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
      title={title}
    >
      {children}
    </button>
  );
}

function Separator() {
  return (
    <div className="h-5 w-px mx-1 bg-gray-300 dark:bg-gray-600"></div>
  );
}
