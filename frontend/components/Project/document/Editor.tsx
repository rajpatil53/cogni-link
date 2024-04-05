import { MDXEditorMethods, MDXEditorProps } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import { forwardRef } from "react";

const EditorComponent = dynamic(() => import("./EditorComponent"), {
  ssr: false,
});

export const Editor = forwardRef<MDXEditorMethods, MDXEditorProps>(
  (props, ref) => <EditorComponent {...props} editorRef={ref} />
);

Editor.displayName = "Editor";

export default Editor;
