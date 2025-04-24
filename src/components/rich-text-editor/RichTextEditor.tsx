"use client";

import React, { useEffect, useRef } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string | null | undefined;
  onChange: (value: string | null) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const { quill, quillRef } = useQuill({
    theme: "snow",
    modules: {
      toolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
      ],
    },
    formats: ["bold", "italic", "underline", "list"],
    placeholder: placeholder || "Start typing…",
    bounds: ".rich-text-editor",
  });

  const editorRef = useRef<HTMLDivElement>(null);

  // propagate changes out
  useEffect(() => {
    if (!quill) return;
    const handler = () => {
      const html = quill.root.innerHTML;
      onChange(html === "<p><br></p>" ? "" : html);
    };
    quill.on("text-change", handler);
    return () => {
      quill.off("text-change", handler);
    };
  }, [quill, onChange]);

  // sync when value differs
  useEffect(() => {
    if (!quill) return;
    const current = quill.root.innerHTML;
    const incoming = value ?? "";
    if (current !== incoming) {
      quill.clipboard.dangerouslyPasteHTML(incoming);
    }
  }, [quill, value]);

  return (
    <div
      ref={editorRef}
      className="rich-text-editor border border-gray-300 rounded-md"
    >
      <div ref={quillRef} className="min-h-[150px]" />
      <style jsx global>{`
        .ql-editor {
          padding: 0.75rem 1rem;
          position: relative;
          min-height: 150px;
        }
        .ql-editor.ql-blank::before {
          content: attr(data-placeholder);
          position: absolute;
          top: 0.75rem;
          left: 1rem;
          color: #9ca3af;
          pointer-events: none;
        }
        .ql-container {
          border: none !important;
        }
        .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid #e5e7eb !important;
        }
      `}</style>
    </div>
  );
}
