import React, {
  useRef,
  useEffect,
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
  useCallback,
} from "react";
import { EditorView } from "@codemirror/view";
import { EditorState, Extension } from "@codemirror/state";
import { snippet } from "@codemirror/autocomplete";
import { Diagnostic } from "@codemirror/lint";
import { getSqlRealText, ITableSchema } from "./utils";
import { extensions } from "./extensions";
import {
  CompletionsType,
  FunctionType,
  HintPathType,
  PlaceholderThemesType,
  ScriptEditorRef,
  variablesModel,
} from "./interface";

export interface ITextEditorProps {
  defaultValue?: string;
  showOutLine?: boolean;
  mode: "json" | "javascript" | "sql" | "html" | "customScript";
  placeholderThemes?: PlaceholderThemesType;
  placeholderThemeFiled?: string;
  onChange: (value: string, rely?: any) => void;
  onError?: (error: Diagnostic) => void;
  onFocusChange?: (focus: boolean) => void;
  // blur触发还是change触发
  trigger?: "blur" | "change";
  editable?: boolean;
  height?: number;
  minHeight?: number;
  placeholder?: string | HTMLElement;
  tables?: ITableSchema;
  keywords?: string[];
  keywordsClassName?: string;
  keywordsColor?: string;
  functions?: FunctionType[];
  extensions?: Extension[];
  variables?: variablesModel[];
  hintPaths?: HintPathType[];
  completions?: CompletionsType[];
  withSelect?: boolean;
  themeStyle?: {
    [K: string]: any;
  };
}

const HqCodemirrir: ForwardRefRenderFunction<
  ScriptEditorRef,
  ITextEditorProps
> = (props, ref) => {
  const {
    mode,
    onChange,
    onError,
    defaultValue = "",
    extensions: extensionsProps,
    withSelect = false,
  } = props;

  const lastMode = useRef<string>("");
  const editorRef = useRef<any>(null);
  const editorView = useRef<EditorView | null>(null);

  const insertText = useCallback((text: string, isTemplate?: boolean) => {
    if (!editorView.current) return;

    const { state } = editorView.current;
    if (!state) return;

    const [range] = state?.selection?.ranges || [];

    editorView.current.focus();
    if (isTemplate) {
      snippet(text)(
        {
          state,
          dispatch: editorView.current.dispatch,
        },
        {
          label: text,
          detail: text,
        },
        range.from,
        range.to
      );
    } else {
      editorView.current.dispatch({
        changes: {
          from: range.from,
          to: range.to,
          insert: text,
        },
        selection: {
          anchor: range.from + text.length,
        },
      });
    }
  }, []);

  const clearText = useCallback(() => {
    const view = editorView.current;
    if (!view) return;
    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: "",
      },
      selection: {
        anchor: 0,
      },
    });
    view.focus();
  }, []);

  const setText = useCallback((text: string) => {
    const view = editorView.current;
    if (!view) return;
    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: text,
      },
      selection: {
        anchor: text.length,
      },
    });
    view.focus();
  }, []);

  const getValue = useCallback(() => {
    const view = editorView.current;
    if (!view) return;
    return view.state.doc.toString();
  }, []);
  useImperativeHandle(
    ref,
    () => {
      return {
        insertText,
        clearText,
        setText,
        getValue,
        hasFocus: editorView.current?.hasFocus,
        originEditorRef: editorView,
      };
    },
    [insertText, clearText, setText]
  );

  useEffect(() => {
    const callback = (v: any, error:null|Diagnostic, rely?: any) => {
      let docstring = v.state.doc.toString();
      if (onChange) {
        docstring = !error ? docstring : "";
        // sql解构为基础字段
        if (mode === "sql" && withSelect) {
          onChange(getSqlRealText(docstring), rely);
          return;
        }
        onChange(docstring, rely);
      }
    };
    const handleError = (err: Diagnostic) => {
      onError && onError(err);
    };
    if (editorRef.current) {
      const stateStart = EditorState.create({
        doc: defaultValue,
        extensions: [
          ...extensions(props, callback, handleError),
          ...(extensionsProps || []),
        ],
      });
      if (editorView.current && mode === lastMode.current) {
        editorView.current.setState(stateStart);
      } else {
        lastMode.current = mode;
        editorView.current = new EditorView({
          state: stateStart,
          parent: editorRef.current || document.body,
        });
      }
    }

    return () => {
      editorView.current?.destroy();
    };
  }, [mode]);

  return <div ref={editorRef}></div>;
};

export default forwardRef<ScriptEditorRef, ITextEditorProps>(HqCodemirrir);
