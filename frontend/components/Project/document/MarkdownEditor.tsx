import React, { MutableRefObject, useState } from "react";
import Editor from "@/components/Project/document/Editor";
import { MDXEditorMethods, MDXEditorProps } from "@mdxeditor/editor";
import { uploadFile } from "@/app/actions";

const MarkdownEditor: React.FC<MDXEditorProps> = ({
  markdown,

  ...editorProps
}) => {
  const ref = React.useRef<MDXEditorMethods>(null);

  const onSaveClick = async () => {
    const content = ref.current?.getMarkdown();
    try {
      if (content) {
        const file = new File([content], "data.md");
        console.log(file);
        const formData = new FormData();
        formData.append("file", file);
        const cid = await uploadFile(formData);
        console.log(cid);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Editor markdown={markdown} ref={ref} />
      <button className="btn" onClick={onSaveClick}>
        Save
      </button>
    </>
  );
};

export default MarkdownEditor;
