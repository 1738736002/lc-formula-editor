import { ITextEditorProps } from "./CodeEditor";

export interface CompletionsType {
  template: string;
  label: string;
  detail: string;
  type: string;
  parent?: any;
}

export interface FunctionType extends CompletionsType {
  handle?: any; // 函数的具体实现方法
  returnType?: string; // 函数的返回值类型
  briefly?: string; // 函数的简要描述
  paramNum?: number; // 函数的参数
  example?: string; // 函数的使用示例
  instruction?: string; // 函数的详细说明
  children?: FunctionType[];
}

export interface HintPathType {
  label: string;
  detail: string;
  type: "function" | "keyword" | "variable" | "text" | "property";
  template: string;
  children?: HintPathType[];
}

export interface PlaceholderThemesType {
  [K: string]: CommonPlaceholderTheme;
}
export interface CommonPlaceholderTheme {
  textColor: string;
  backgroudColor: string;
}

export interface ScriptEditorRef {
  insertText: (text: string, isTemplate: boolean) => void;
  clearText: () => void;
  setText: (text: string) => void;
  getValue: () => string | any;
  hasFocus?: boolean;
  originEditorRef: any;
}

export interface IWithSelectCodemirrorRef {}

export interface variablesModel {
  code: string;
  name: string;
  children?: variablesModel[];
  type: "model" | "field";
  value?: any;
  fieldType?: string;
}

export interface IParseFunctionResult {
  funIng: Function;
  func: Function;
  funcs: { [x: string]: any; };
  data: any;
  formatResult: string;
}

export interface IWithSelectCodemirrorProps extends ITextEditorProps {
  actionBoxHeight?: string; // 选择区域的最大高度
  showHeader?: boolean; // 是否展示头部
  // 自定义头部内容
  renderHeader?: React.ReactNode | string;
  customTool?: React.ReactNode | string;
  clickDebug?: (result: IParseFunctionResult) => void;
}
