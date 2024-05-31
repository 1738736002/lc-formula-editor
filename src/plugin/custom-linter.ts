// 代码检查，提示
import { linter, Diagnostic } from "@codemirror/lint";
import { CompletionsType, FunctionType, HintPathType, variablesModel } from "../CodeEditor/interface";
import { regExpCheck } from "../CodeEditor/utils";
const ERROR_CLASS_NAME = 'custom-lintPoint-error';
// 递归检查函数
function checkParams(str:string, func:FunctionType) {
  let match;
  let valid = true;
  // 正则表达式，用于匹配函数调用及其参数
  const regex = /(\w+)\(([^()]*?)\)/g;
  regex.lastIndex = 0;
  while ((match = regex.exec(str)) !== null) {
    let [fullMatch, funcName, params] = match;
    params = params.replace(/\s/g, "");
    // 如果params中存在多余的逗号，说明参数不匹配，例如：params = "1,2,,3" 或者 "1,2,3," 或者 ",1,2,3"
    if (params.includes(',,') || params.startsWith(',') || params.endsWith(',')) {
      valid = false;
      break;
    }
    const paramsCount = params.replace(/\s/g, "").split(',').filter(Boolean).length;
    // 检查参数数量是否满足要求
    const numberOfParams = func.paramNum;
    if (numberOfParams === -1&&paramsCount<1) {
      valid = false;
      break;
    }
    if (paramsCount < ( numberOfParams || 0)) {
      valid = false;
      break;
    }
    // 递归检查参数中的函数调用
    if (!checkParams(params, func)) {
      valid = false;
      break;
    }
  }

  return valid;
}

const funcCheck = (diagnostics: Diagnostic[], text: string, functions: FunctionType[]) => {
  // 函数检查报错一下几个方面：1. 函数结构不完整 2. 函数名不匹配 3. 参数不匹配 4. 输入类型不匹配 5.对于嵌套函数的检查；
  // 遍历所有的函数
  let docs = text;
  functions.forEach((func:FunctionType) => {
    // 获取函数的名字
    const funcName = func.label;
    if (docs.includes(funcName)) {
      // 判断函数的结构是否完整: 左右括号是否匹配
      const leftBracketNum = (docs.match(/\(/g) || []).length;
      const rightBracketNum = (docs.match(/\)/g) || []).length;
      if (leftBracketNum !== rightBracketNum) {
        diagnostics.push({
          from: docs.indexOf(funcName),
          to: docs.indexOf(funcName) + funcName.length,
          severity: "error",
          message: `函数${funcName}结构不完整`,
          markClass: ERROR_CLASS_NAME
        });
      }
      // 根据函数的括号，把嵌套的函数一个个截取出来；
       // 正则表达式，用于匹配函数调用及其参数
      const res1 = checkParams(docs, func);
      if (!res1) {
        diagnostics.push({
          from: docs.indexOf(funcName),
          to: docs.indexOf(funcName) + funcName.length,
          severity: "error",
          message: `函数${funcName}参数不匹配`,
          markClass: ERROR_CLASS_NAME
        });
        return;
      }
    }
  });
}
export const customLinter = (
  completions: CompletionsType[],
  keywords: string[],
  functions: FunctionType[],
  hintPaths: HintPathType[],
  variables: variablesModel[]
) => {
  return linter((view) => {
    let diagnostics: Diagnostic[] = [];

    const docs = view.state.doc.toString();
    const hintPathLabels: string[] = [];
    const getLabels = (tree: HintPathType[], pre = "") => {
      tree.forEach((item) => {
        const label = pre ? `${pre}.${item.label}` : item.label;
        hintPathLabels.push(label);
        if (item.children) {
          getLabels(item.children, label);
        }
      });
    };
    getLabels(hintPaths);
    const allWordKeys = [...keywords,...hintPathLabels,...functions.map((it) => it.label), ...completions.map((item) => item.label)];
    if (docs) {
    const operators = "'++ -- ** && || >= <= === == !== != += -= *= /= %= &= |= ^= >>> >> << ?? ??= ? : ! ~ ^ > < + - * / %' ( ) [ ] { } , ; . $ //".split(" ");
    // 检测输入的字符是否为合法的字符；
    regExpCheck(docs, allWordKeys, operators, diagnostics, variables)
    // 执行函数检查
    funcCheck(diagnostics, docs, functions);
    // 判断参数是否有中文"，。；”“！（）"，如果有则报错
    const chineseRegex = /[，。；”“！（）]/;
    // // 除去字符串中""里面的内容
    let str = docs;
    const stringContent = str.replace(/".*?"/g, "");
    if (chineseRegex.test(stringContent)) {
      diagnostics.push({
        from: docs.length,
        to: docs.length+1,
        severity: "error",
        message: "表达式中不能包含中文标点符号",
        markClass: ERROR_CLASS_NAME
      });
    }
    }
    return diagnostics;
  });
};
