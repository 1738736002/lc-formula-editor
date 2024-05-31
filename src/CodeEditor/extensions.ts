import {
  EditorView,
  ViewUpdate,
  keymap,
  placeholder as placeholderExe,
} from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { autocompletion, closeCompletion } from "@codemirror/autocomplete";
import { baseTheme } from "../plugin/base-theme";
import { LightHighlight } from "../plugin/high-lighting";
import { basicSetup } from "codemirror";
import { json as jsonLang, jsonParseLinter } from "@codemirror/lang-json";
import { javascript as javascriptLang } from "@codemirror/lang-javascript";
import { sql as sqlLang } from "@codemirror/lang-sql";
import { html as htmlLang } from "@codemirror/lang-html";
import { linter, forEachDiagnostic, Diagnostic } from "@codemirror/lint";
import { cnPhrases, getTableSchema } from "./utils";
import { keywordsPlugin } from "../plugin/keywords";
import { customCompletions } from "../plugin/custom-completion";
import { functionPlugin } from "../plugin/functions";
import { indentWithTab, defaultKeymap } from "@codemirror/commands";
import { customLinter } from "../plugin/custom-linter";
import { placeholdersPlugin } from "../plugin/placeholder";
import { hintPlugin } from "../plugin/hint";
import { variablesPlugin } from "../plugin/custom-var";
import { ITextEditorProps } from "./CodeEditor";
import customSqlLinter from "../plugin/custom-sql-linter";
import customAutoCompleteConfig from "../plugin/c-autoCompletion";
import { sqlDefaultCompletions } from "../plugin/sql-default-completion";

export const extensions = (
  props: ITextEditorProps,
  callback: (data: any, error: any) => void,
  handleError: (error: any) => void
) => {
  const {
    mode,
    trigger = "blur",
    editable = true,
    placeholder,
    tables = [],
    minHeight = 0,
    height,
    completions = [],
    keywords = [],
    keywordsColor,
    keywordsClassName,
    functions = [],
    placeholderThemes = {},
    hintPaths = [],
    variables = [],
    placeholderThemeFiled = "id",
    showOutLine = true,
    withSelect = false,
    themeStyle = {},
    onFocusChange,
  } = props;
  const autoCompletionConfig: any = {
    ...(mode === "customScript"
      ? {
          override: [
            // 覆盖默认的自动补全
            customCompletions(completions),
            hintPaths?.length ? hintPlugin(hintPaths) : null,
          ].filter((o) => !!o),
          ...customAutoCompleteConfig(),
        }
      : mode === "sql" && withSelect
      ? {
          override: [sqlDefaultCompletions(completions)].filter((o) => !!o),
          ...customAutoCompleteConfig(),
        }
      : {}),
  };
  return [
    baseTheme,
    LightHighlight,
    basicSetup,
    keymap.of([...defaultKeymap, indentWithTab]),
    autocompletion(autoCompletionConfig),
    ...(mode === "json"
      ? [jsonLang(), linter(jsonParseLinter())]
      : mode === "html"
      ? [htmlLang()]
      : mode === "javascript"
      ? [javascriptLang({ jsx: false, typescript: true })]
      : mode === "customScript"
      ? [
          keywords.length &&
            keywordsPlugin(keywords, keywordsColor, keywordsClassName),
          functions.length && functionPlugin(functions),
          variables.length &&
            variablesPlugin(
              variables,
              placeholderThemes,
              placeholderThemeFiled
            ),
          customLinter(completions, keywords, functions, hintPaths, variables),
        ]
      : [
          sqlLang(getTableSchema(tables)),
          customSqlLinter(completions, variables),
        ]),
    // change触发
    EditorView.updateListener.of((v: ViewUpdate) => {
      let error: any = null;
      forEachDiagnostic(v.state, (d: Diagnostic) => {
        error = d;
      });
      handleError(error);
      if (v.docChanged && trigger !== "blur") {
        callback(v, error);
      }
    }),
    // 换行
    EditorView.lineWrapping,
    // blur
    EditorView.domEventHandlers({
      blur: (e: DocumentEventMap["blur"], view: EditorView) => {
        closeCompletion(view);
        if (trigger === "blur") {
          let error: any = null;
          forEachDiagnostic(view.state, (d: Diagnostic) => {
            error = d;
          });
          callback(view, error);
        }
      },
    }),
    EditorView.focusChangeEffect.of((state: any, focusing: boolean) => {
      onFocusChange && onFocusChange(focusing);
      return null;
    }),
    // 是否可编辑
    EditorView.editable.of(editable),
    // 最小高度
    EditorView.theme({
      ".cm-content": minHeight
        ? {
            minHeight: `${minHeight}px`,
          }
        : {},
      "&": height
        ? {
            height: `${height}px`,
          }
        : {},
      "&.cm-focused": showOutLine
        ? {
            outline: `1px dotted #212121`,
          }
        : {
            outline: `none`,
          },
      ".cm-lintPoint-error:after": withSelect
        ? {
            display: "none",
          }
        : {
            display: "inline-block",
          },
      ...themeStyle,
    }),
    placeholdersPlugin(placeholderThemes, variables, placeholderThemeFiled),

    placeholderExe(
      placeholder ||
        (mode === "javascript"
          ? "请输入函数内容"
          : mode === "html"
          ? "请输入html"
          : mode === "json"
          ? "请输入json"
          : mode === "customScript"
          ? "请输入..."
          : "请输入表达式")
    ),
    EditorState.phrases.of(cnPhrases),
  ];
};
