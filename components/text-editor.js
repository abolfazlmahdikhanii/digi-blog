import React, { memo, useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import { EDITOR_JS_TOOL } from "@/lib/tools";
const TextEditor = ({
  initialData,
  onChange,
  placeholder,
  readOnly = false,
}) => {
  const holderRef = useRef(null);
  const editorRef = useRef(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (editorRef.current) return;
    const editor = new EditorJS({
      holder: holderRef.current,
      placeholder,
      autofocus: true,
      data: initialData || { time: Date.now(), blocks: [] },
      readOnly,
      tools: EDITOR_JS_TOOL,
      style: { "background:": "#f65" },
      onReady: () => {
        editorRef.current = editor;
        setReady(true);
      },
      onChange: async () => {
        try {
          const output = await editor.save();
         
          onChange(output);
        } catch (err) {
          // ignore transient errors until editor is fully ready
        }
      },
    });
    return () => {
      if (editorRef.current && holderRef.current) {
        editorRef.current.destroy();
        // holderRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [ready]);

  return (
    <div className="medium-editor-shell w-full">
      <div className="medium-editor-column">
        <div className="medium-editor-holder w-full" ref={holderRef} />
      </div>
    </div>
  );
};

export default TextEditor;
