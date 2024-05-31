import React, { forwardRef, useImperativeHandle, useRef } from "react";
import CodeEditor, { ITextEditorProps } from "./CodeEditor/CodeEditor";
import WithSelectCodemirror from "./CodeEditor/WithSelectCodemirror";
import "./style/index.less";
import WithSelectSqlCodeEditor from "./CodeEditor/WithSelectSqlCodemirror";
export type {
  FunctionType,
  CommonPlaceholderTheme,
  CompletionsType,
  ScriptEditorRef,
  PlaceholderThemesType,
  HintPathType,
} from "./CodeEditor/interface";

interface IEditorProps extends ITextEditorProps {
  actionBoxHeight?: string; // 选择区域的最大高度
  showHeader?: boolean; // 是否展示头部
  withSelect?: boolean; // 是否展示选择区域
}

const Editor = (props: IEditorProps, ref: any) => {
  const { withSelect = false } = props;
  const editorRef = useRef(null);
  useImperativeHandle(ref, () => editorRef.current);
  return (
    <>
      {withSelect ? (
        props.mode === "sql" ? (
          <WithSelectSqlCodeEditor ref={editorRef} {...props} />
        ) : (
          <WithSelectCodemirror ref={editorRef} {...props} />
        )
      ) : (
        <CodeEditor ref={editorRef} {...props} />
      )}
    </>
  );
};
export default forwardRef<any, IEditorProps>(Editor);
