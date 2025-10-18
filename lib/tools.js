import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import CodeTool from "@editorjs/code";
import Embed from "@editorjs/embed";
import ImageTool from "@editorjs/image";
import Table from "@editorjs/table";
import LinkTool from "@editorjs/link";
import InlineCode from "@editorjs/inline-code";
import Marker from "@editorjs/marker";
import InlineImage from "editorjs-inline-image";
import ColorPicker from "editorjs-color-picker";
import Delimiter from "@editorjs/delimiter";

export const EDITOR_JS_TOOL = {
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
  //   image: {
  //     class: ImageTool,
  //     config: {
  //       // Provide uploader: try imageUploadUrl if given; otherwise fallback to base64
  //       uploader: {
  //         async uploadByFile(file) {
  //           if (imageUploadUrl) {
  //             try {
  //               const form = new FormData();
  //               form.append("image", file);
  //               const res = await fetch(imageUploadUrl, {
  //                 method: "POST",
  //                 body: form,
  //               });
  //               const json = await res.json();
  //               if (json && json.success && json.file && json.file.url) {
  //                 return { success: 1, file: { url: json.file.url } };
  //               }
  //               if (json && json.url) {
  //                 return { success: 1, file: { url: json.url } };
  //               }
  //             } catch (e) {
  //               console.error("Upload failed", e);
  //               return { success: 0 };
  //             }
  //           }
  //           // base64 fallback
  //           const toBase64 = (f) =>
  //             new Promise((resolve, reject) => {
  //               const reader = new FileReader();
  //               reader.onload = () => resolve(reader.result);
  //               reader.onerror = reject;
  //               reader.readAsDataURL(f);
  //             });
  //           const dataUrl = await toBase64(file);
  //           return { success: 1, file: { url: dataUrl } };
  //         },
  //         async uploadByUrl(url) {
  //           return { success: 1, file: { url } };
  //         },
  //       },
  //     },
  //   },
};
