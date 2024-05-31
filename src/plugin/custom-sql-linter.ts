/**
 * 校验输入的sql是否合法
 */
import { Diagnostic, linter } from "@codemirror/lint";
import { regExpCheck, sqlKeys, tins } from "../CodeEditor/utils";
import { CompletionsType } from "../CodeEditor/interface";

export default function customSqlLinter(completions:CompletionsType[], variables:any[]) {
    return linter((view)=>{
        const sqlDiagnostics: Diagnostic[] = [];
        let docs = view.state.doc.toString();
        const comKeys = completions.map(it=>it.label)??[];
        const keys = sqlKeys.split(" ")??[];
        const tinKeys = tins.split(" ")??[];
        const allWordKeys = [...comKeys, ...keys, ...tinKeys];
        if(docs) {
            // 检测docs中是否包含 [[字段.字段1:字段2]] 的字符，有则替换为 字段1的值；

            const operators = "! && || & | ^ >> << + - * % = <=> <> != < <= > >= ~ ( ) [ ] { } , ; . $ # @".split(" ");
            // 检测输入的字符是否为合法的字符；
            regExpCheck(docs, allWordKeys, operators, sqlDiagnostics, variables)
        }
        return sqlDiagnostics;
    })
}
