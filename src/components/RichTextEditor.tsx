'use client';

import { useState, useEffect, useRef } from 'react';

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
      if (value) {
        editorRef.current.innerHTML = value;
        setIsEmpty(false);
      } else {
        editorRef.current.innerHTML = '';
        setIsEmpty(true);
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
      setIsEmpty(content === '' || content === '<br>');
      
      // Ensure the text direction is always left-to-right
      editorRef.current.style.direction = 'ltr';
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
    <div className="border theme-border rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center p-2 border-b theme-border flex-wrap" style={{ backgroundColor: 'var(--editor-toolbar-bg)' }}>
        <button
          type="button"
          onClick={() => formatText('bold')}
          className="p-2 theme-hover rounded mr-1 theme-text-primary"
          title="Bold"
        >
          <span className="font-bold">B</span>
        </button>
        <button
          type="button"
          onClick={() => formatText('italic')}
          className="p-2 theme-hover rounded mr-1 theme-text-primary"
          title="Italic"
        >
          <span className="italic">I</span>
        </button>
        <button
          type="button"
          onClick={() => formatText('underline')}
          className="p-2 theme-hover rounded mr-1 theme-text-primary"
          title="Underline"
        >
          <span className="underline">U</span>
        </button>
        <div className="h-6 w-px mx-2" style={{ backgroundColor: 'var(--border-color)' }}></div>
        <button
          type="button"
          onClick={() => formatText('insertUnorderedList')}
          className="p-2 theme-hover rounded mr-1 theme-text-primary"
          title="Bullet List"
        >
          <span>•</span>
        </button>
        <button
          type="button"
          onClick={() => formatText('insertOrderedList')}
          className="p-2 theme-hover rounded mr-1 theme-text-primary"
          title="Numbered List"
        >
          <span>1.</span>
        </button>
        <div className="h-6 w-px mx-2" style={{ backgroundColor: 'var(--border-color)' }}></div>
        <button
          type="button"
          onClick={() => formatText('justifyLeft')}
          className="p-2 theme-hover rounded mr-1 theme-text-primary"
          title="Align Left"
        >
          <span>≡</span>
        </button>
        <button
          type="button"
          onClick={() => formatText('justifyCenter')}
          className="p-2 theme-hover rounded mr-1 theme-text-primary"
          title="Align Center"
        >
          <span>≡</span>
        </button>
        <button
          type="button"
          onClick={() => formatText('justifyRight')}
          className="p-2 theme-hover rounded mr-1 theme-text-primary"
          title="Align Right"
        >
          <span>≡</span>
        </button>
        <div className="h-6 w-px mx-2" style={{ backgroundColor: 'var(--border-color)' }}></div>
        <button
          type="button"
          onClick={() => formatText('strikeThrough')}
          className="p-2 theme-hover rounded mr-1 theme-text-primary"
          title="Strike Through"
        >
          <span className="line-through">S</span>
        </button>
        <button
          type="button"
          onClick={() => formatText('formatBlock', 'H1')}
          className="p-2 theme-hover rounded mr-1 theme-text-primary"
          title="Heading"
        >
          <span className="text-lg font-bold">T</span>
        </button>
      </div>

      {/* Editor */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          className="w-full h-64 md:h-96 p-4 outline-none overflow-y-auto"
          onInput={handleInput}
          style={{ minHeight: '200px', direction: 'ltr' }}
          data-placeholder={placeholder}
        />
        {isEmpty && placeholder && (
          <div className="absolute top-4 left-4 pointer-events-none" style={{ color: 'var(--editor-placeholder)' }}>
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
} 