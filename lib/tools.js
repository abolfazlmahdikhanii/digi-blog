import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import CodeTool from "@editorjs/code";
import Embed from "@editorjs/embed";
import ImageTool from "@pawritharya/editorjs-image-tool-delete";
import Table from "@editorjs/table";
import LinkTool from "@editorjs/link";
import InlineCode from "@editorjs/inline-code";
import Marker from "@editorjs/marker";
import InlineImage from "editorjs-inline-image";
import ColorPicker from "editorjs-color-picker";
import Delimiter from "@editorjs/delimiter";

// Function that returns the editor config with current ID
export const getEditorTools = (id) => {


  return {
    header: {
      class: Header,
      inlineToolbar: true,
    },
    list: {
      class: List,
      inlineToolbar: true,
    },
    quote: {
      class: Quote,
      inlineToolbar: true,
    },
    code: {
      class: CodeTool,
    },
    embed: {
      class: Embed,
    },
    table: {
      class: Table,
      inlineToolbar: true,
    },
    linkTool: {
      class: LinkTool,
      config: {
        // optional: endpoint for link preview
        // endpoint: '/link-preview'
      },
    },
    inlineCode: {
      class: InlineCode,
    },
    marker: {
      class: Marker,
    },
    simpleImage: {
      class: InlineImage,
      inlineToolbar: true,
      config: {
        embed: {
          display: true,
        },
      },
    },
    ColorPicker: {
      class: ColorPicker,
    },
    delimiter: {
      class: Delimiter,
      config: {
        styleOptions: ["star", "dash", "line"],
      },
      inlineToolbar: true,
    },
    image: {
      class: ImageTool,
      config: {
        uploader: {
          async uploadByFile(file) {
            if (file) {
              try {
                const form = new FormData();
                form.append("image", file);
                const res = await fetch(
                  `/api/upload/post-images?imgType=post&id=${id}`,
                  {
                    method: "POST",
                    body: form,
                  }
                );
                if (res.ok) {
                  const data = await res.json();

                  if (data && data.success && data.url) {
                    return { success: 1, file: { url: data.url } };
                  }
                  if (data && data.url) {
                    return { success: 1, file: { url: data.url } };
                  }
                }
              } catch (e) {
                console.error("Upload failed", e);
                return { success: 0 };
              }
            }
            // base64 fallback
            const toBase64 = (f) =>
              new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(f);
              });
            const dataUrl = await toBase64(file);
            return { success: 1, file: { url: dataUrl } };
          },
          async uploadByUrl(url) {
            return { success: 1, file: { url } };
          },
        },
        deleter: {
          deleteFile: async (url) => {
            if (url) {
              await fetch(`/api/upload/post-images?url=${url}`, {
                method: "DELETE",
              });
            }
          },
        },
      },
    },
  };
};

// For backward compatibility, export the function result as well
export const EDITOR_JS_TOOL = getEditorTools();
