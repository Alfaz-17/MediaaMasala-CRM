"use client"

import dynamic from "next/dynamic"
import { useMemo } from "react"
import "react-quill-new/dist/quill.snow.css"

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["link"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["clean"],
  ],
}

const formats = [
  "header",
  "bold", "italic", "underline", "strike",
  "list",
  "blockquote", "code-block",
  "link",
  "color", "background",
  "align",
]

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const memoizedModules = useMemo(() => modules, [])

  return (
    <div className={`rich-text-editor ${className || ""}`}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={memoizedModules}
        formats={formats}
        placeholder={placeholder || "Write something amazing..."}
      />
      <style jsx global>{`
        .rich-text-editor .ql-container {
          min-height: 120px;
          font-size: 13px;
          border-radius: 0 0 8px 8px;
          border-color: hsl(var(--border));
          background: hsl(var(--background));
        }
        .rich-text-editor .ql-toolbar {
          border-radius: 8px 8px 0 0;
          border-color: hsl(var(--border));
          background: hsl(var(--muted) / 0.3);
        }
        .rich-text-editor .ql-toolbar button:hover,
        .rich-text-editor .ql-toolbar button.ql-active {
          color: hsl(var(--primary));
        }
        .rich-text-editor .ql-toolbar button:hover .ql-stroke,
        .rich-text-editor .ql-toolbar button.ql-active .ql-stroke {
          stroke: hsl(var(--primary));
        }
        .rich-text-editor .ql-toolbar button:hover .ql-fill,
        .rich-text-editor .ql-toolbar button.ql-active .ql-fill {
          fill: hsl(var(--primary));
        }
        .rich-text-editor .ql-editor {
          color: hsl(var(--foreground));
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: hsl(var(--muted-foreground));
          font-style: normal;
          font-size: 12px;
        }
      `}</style>
    </div>
  )
}
