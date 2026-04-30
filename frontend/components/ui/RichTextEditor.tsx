"use client";
import React from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Dynamic import to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { 
  ssr: false,
  loading: () => <div className="h-32 w-full bg-white/5 animate-pulse rounded-xl" />
});

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "clean"],
    ],
  };

  const formats = [
    "header",
    "bold", "italic", "underline", "strike", "blockquote",
    "list", "bullet",
    "link",
  ];

  return (
    <div className="rich-text-editor-container">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-white/5 rounded-xl overflow-hidden border border-[#26262f] text-slate-200"
      />
      <style jsx global>{`
        .ql-toolbar.ql-snow {
          border-color: #26262f;
          background: #1e1e28;
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
        }
        .ql-container.ql-snow {
          border-color: #26262f;
          min-height: 150px;
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
        }
        .ql-editor.ql-blank::before {
          color: #475569;
          font-style: normal;
        }
        .ql-snow .ql-stroke {
          stroke: #94a3b8;
        }
        .ql-snow .ql-fill {
          fill: #94a3b8;
        }
        .ql-snow .ql-picker {
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
}
