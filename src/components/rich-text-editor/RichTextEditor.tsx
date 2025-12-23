"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

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
  const modules = useMemo(
    () => ({
      toolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
      ],
    }),
    []
  );

  const formats = [
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "ordered", // Added missing formats usually needed for lists
  ];

  const handleChange = (content: string) => {
    onChange(content === "<p><br></p>" ? "" : content);
  };

  return (
    <div className="rich-text-editor border border-gray-300 rounded-md">
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={handleChange}
        placeholder={placeholder || "Start typing…"}
        modules={modules}
        formats={formats}
        className="min-h-[150px]"
      />
      <style jsx global>{`
        .ql-editor {
          min-height: 150px;
        }
        .ql-container {
          border: none !important;
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
        }
        .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid #e5e7eb !important;
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
        }
      `}</style>
    </div>
  );
}
