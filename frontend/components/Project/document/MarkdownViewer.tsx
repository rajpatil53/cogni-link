import Editor from "@/components/Project/document/Editor";
import React from "react";

type Props = {
  markdown: string;
};

const MarkdownViewer = ({ markdown }: Props) => {
  return <Editor markdown={markdown} readOnly />;
};

export default MarkdownViewer;
