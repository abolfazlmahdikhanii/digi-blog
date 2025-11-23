import React, { memo, useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import { getEditorTools } from "@/lib/tools";
import { useRouter } from "next/router";
import { useIsMobile } from "@/hooks/use-mobile";

const TextEditor = ({
  initialData,
  onChange,
  placeholder,
  readOnly = false,
  onDraft,
  id,
  title,
  content,
  setEditor,
  isPublish = false,
  saveTimeoutRef,
}) => {
  const holderRef = useRef(null);

  const editorRef = useRef(null);
  const savingRef = useRef(false); // prevent concurrent saves
  const lastBlockCountRef = useRef(0); // track block count changes
  const hasChangesRef = useRef(false); // track if changes were made since last save
  const lastSavedDataRef = useRef(null); // store last saved data for comparison

  const [ready, setReady] = useState(false);
  const isMobile = useIsMobile();
  const { query } = useRouter();

  const saveDraft = async () => {
    if (!editorRef.current || savingRef.current || !hasChangesRef.current)
      return;
    try {
      savingRef.current = true;
      const output = await editorRef.current.save();

      if (id && output?.blocks.length > 0) {
        await onDraft(output);
        hasChangesRef.current = false; // reset after successful save
        lastSavedDataRef.current = JSON.stringify(output);
      }
    } catch (err) {
      // ignore transient errors
      // console.warn("draft save failed", err);
    } finally {
      savingRef.current = false;
    }
  };

  useEffect(() => {
    if (editorRef.current) return;
    const editor = new EditorJS({
      holder: holderRef.current,
      placeholder,
      autofocus: true,
      data: initialData || { time: Date.now(), blocks: [] },
      readOnly,

      tools: getEditorTools(query.postId || id),
      // style: { "background:": "#f65" },
      onReady: () => {
        editorRef.current = editor;
        setReady(true);
        if (setEditor) {
          setEditor(editor);
        }
        if (!readOnly) {
          editor.save().then((output) => {
            lastBlockCountRef.current = output.blocks.length;

            // Set caret to the end of the last block
            if (output.blocks.length > 0) {
              const lastBlockIndex = output.blocks.length - 1;
              editor.caret.setToBlock(lastBlockIndex, "end");
            } else {
              editor.caret.setToFirstBlock("end", 0);
            }
          });
        }
      },
      onChange: async (api, event) => {
        try {
          const output = await editor.save();
          onChange(output);

          const currentBlockCount = output.blocks.length;
          const blockCountChanged =
            currentBlockCount !== lastBlockCountRef.current;
          lastBlockCountRef.current = currentBlockCount;

          // Mark that changes were made
          hasChangesRef.current = true;

          // Save draft if: no id exists OR blocks were added/removed (like images)
          if (!id) {
            if (saveTimeoutRef?.current) {
              clearTimeout(saveTimeoutRef.current);
            }

            // Set new timeout for debounced save
            saveTimeoutRef.current = setTimeout(async () => {
              if (hasChangesRef.current) {
                await onDraft(output);
                hasChangesRef.current = false;
              }
            }, 1500); // Wait 1.5 seconds after typing stops
          }
        } catch (err) {
          // ignore transient errors until editor is fully ready
        }
      },
    });

    const handlePointerDown = async (e) => {
      if (!holderRef.current) return;
      if (
        e.target.closest('input[type="file"]') ||
        e.target.closest("textarea") ||
        e.target.closest(".ce-toolbar") ||
        e.target.closest(".ce-inline-toolbar") ||
        e.target.closest(".ce-conversion-toolbar") ||
        e.target.closest(".ce-settings") ||
        e.target.closest("button")
      ) {
        return;
      }
      // if click/tap is outside the editor holder, save draft only if changes exist
      if (!holderRef.current.contains(e.target)) {
        await saveDraft();
      }
    };
    const handleKeyDown = async (e) => {
      if (!holderRef.current) return;
      if (e.key === "F5") {
        await saveDraft();
      } else if (e.key === "Enter" || e.key === "Space") {
        await saveDraft();
      }
    };

    // when tab/window loses focus, save draft
    const handleWindowBlur = async () => {
      // Small delay to check if focus moved to file input or editor toolbar

      const activeElement = document.activeElement;

      // Don't save if focus is on file input or within editor toolbars
      if (
        activeElement.closest('input[type="file"]') ||
        activeElement.closest("input") ||
        activeElement?.type === "file" ||
        activeElement?.closest(".ce-toolbar") ||
        activeElement?.closest(".ce-inline-toolbar") ||
        activeElement?.closest(".ce-conversion-toolbar") ||
        activeElement?.closest(".ce-settings") ||
        activeElement?.closest(".cdx-input") ||
        holderRef.current?.contains(activeElement)
      ) {
        return;
      }

      setTimeout(async () => {
        await saveDraft();
      }, 2000);
    };

    // when document becomes hidden (switch tab), save draft
    const handleVisibilityChange = async () => {
      const activeElement = document.activeElement;

      // Don't save if focus is on file input or within editor toolbars
      if (
        activeElement?.type === "file" ||
        activeElement?.closest(".ce-toolbar") ||
        activeElement?.closest(".ce-inline-toolbar") ||
        activeElement?.closest(".ce-conversion-toolbar") ||
        activeElement?.closest(".ce-settings") ||
        activeElement?.closest(".cdx-input") ||
        holderRef.current?.contains(activeElement)
      ) {
        return;
      }
      if (document.visibilityState === "hidden") {
        await saveDraft();
      }
    };

    if (!readOnly || !isPublish) {
      if (!isMobile) {
        document.addEventListener("mouseover", handlePointerDown, true);
        document.addEventListener("mousedown", handlePointerDown, true);
        document.addEventListener("keydown", handleKeyDown);
      }
      document.addEventListener("touchstart", handlePointerDown, {
        passive: true,
      });

      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      if (saveTimeoutRef?.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      // document.removeEventListener("focusout", handleWindowBlur);
      document.removeEventListener("touchstart", handlePointerDown);
      if (!isMobile) {
        document.removeEventListener("mousedown", handlePointerDown, true);
        document.removeEventListener("mouseover", handlePointerDown, true);
        document.removeEventListener("keydown", handleKeyDown);
      }
      // document.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (editorRef.current && holderRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [ready]);

  return (
    <div className="medium-editor-shell w-full">
      <div className="medium-editor-column">
        <div
          className="medium-editor-holder w-full"
          ref={holderRef}
          dir="auto"
        />
      </div>
    </div>
  );
};

export default TextEditor;
