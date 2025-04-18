import React, { useEffect } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
  "link",
];

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  // pass placeholder into Quill options instead of on the div
  const { quill, quillRef } = useQuill({
    theme: "snow",
    modules,
    formats,
    placeholder,
  });

  useEffect(() => {
    if (quill) {
      // initialize HTML content
      quill.root.innerHTML = value;
      quill.on("text-change", () => {
        onChange(quill.root.innerHTML);
      });
    }
  }, [quill, value, onChange]);

  return (
    <div className="rich-text-editor">
      {/* quillRef attaches the editor */}
      <div ref={quillRef} />
    </div>
  );
};

export default RichTextEditor;
