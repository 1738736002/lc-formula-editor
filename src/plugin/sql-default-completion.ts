import { snippetCompletion } from "@codemirror/autocomplete";
import { appendkeys, tins } from "../CodeEditor/utils";
import { CompletionsType } from "../CodeEditor/interface";
// 对于自定义的补全项，需要将其转换为 snippetCompletion 的格式
export function sqlDefaultCompletions(completions: CompletionsType[]) {
    return (context: any) => {
        // 匹配当前输入前面的所有非空字符，包括中文、英文、数字、下划线
        let word = context.matchBefore(/[\u4E00-\u9FA5A-Za-z0-9_]*/);
        if (word.from == word.to && !context.explicit) return null;
        const tinsArr = tins.split(" ") || [];
        const appendkeysArr = appendkeys.split(" ") || [];
        const filteredTinsArr = tinsArr.filter(item => !appendkeysArr.includes(item));
        const defaultValues = (
            appendkeysArr.map(item =>
                snippetCompletion(item, {
                    label: item,
                    type: "function",
                }),
            ) || []
        ).concat(
            filteredTinsArr.map(item =>
                snippetCompletion(item, {
                    label: item,
                    type: "keyword",
                }),
            )
        );
        // 然后遍历completions，先判断当前项是否在defaultValues中，如果在就覆盖，不在就添加
        completions.forEach((item) => {
            const index = defaultValues.findIndex((o) => o.label === item.label);
            const res = snippetCompletion(item.template, {
                label: item.label,
                detail: item.detail,
                type: item.type,
            })
            if (index !== -1) {
                defaultValues[index] = res;
            } else {
                defaultValues.push(res)
            }
        });
        return {
            from: word.from,
            options: defaultValues,
        };
    };
}
