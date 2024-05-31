import { snippetCompletion } from "@codemirror/autocomplete";
import { CompletionsType } from "../CodeEditor/interface";
// 对于自定义的补全项，需要将其转换为 snippetCompletion 的格式
/**
 * apply: (editor, completion, from, to) => {…} // 用于应用补全
 * detail: "wen常量"
 * label: "wen"
 * type: "keyword"
 */
export function customCompletions(completions: CompletionsType[]) {
  return (context: any) => {
    // 匹配当前输入前面的所有非空字符，包括中文、英文、数字、下划线
    let word = context.matchBefore(/[\u4E00-\u9FA5A-Za-z0-9_]*/);
    if (word.from == word.to && !context.explicit) return null;
    return {
      from: word.from,
      options:
        completions?.map((item) =>
          snippetCompletion(item.template, {
            label: item.label,
            detail: item.detail,
            type: item.type
          })
        ) || [],
    };
  };
}
