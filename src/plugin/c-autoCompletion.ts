import { currentCompletions } from "@codemirror/autocomplete";
import { normalizeType } from "../CodeEditor/utils";
type TxtKey = 'variable' | 'function' | 'class' | 'enum' | 'keyword' | 'method' | 'text' | 'property' | 'namespace' | 'constant' | 'type' | 'interface';
export default function customAutoCompleteConfig() {
    return ({
        icons: false,
        tooltipClass: () => "tip-completion-custom",
        addToOptions: [
            {
                render: function(completion:any, state:any) {
                    const completionsList = currentCompletions(state);
                    const uniqueTypes = new Map();
                    const txtMap = {
                        variable: "字段",
                        function: "函数",
                        class: "类",
                        enum: '枚举',
                        keyword: '关键字',
                        method: '方法',
                        text: "文本",
                        property: "属性",
                        namespace: "命名空间",
                        constant: "常量",
                        type: "类型",
                        interface: "接口",
                    };
                    completionsList.forEach(item => {
                        const type = item?.type ?? "";
                        if (type && !uniqueTypes.has(type)) {
                            uniqueTypes.set(type, item);
                        }
                    });
                    let typeTitle: any = null;
                    // 判断是否同时存在函数和变量
                    if (uniqueTypes.size >= 1) {
                        uniqueTypes.forEach((value, key:TxtKey) => {
                            if (value.label === completion.label) {
                                typeTitle = document.createElement("div");
                                typeTitle.className = "other-show-tip";
                                typeTitle.textContent = txtMap[key] ?? "";
                                return;
                            }
                        });
                    }
                    return typeTitle;
                },
                position: 20,
            },
            {
                render: (completion:any)=>{
                    const { type, detail } = completion;
                    if (type === "variable") {
                        const spanType = document.createElement("span");
                        const info = normalizeType(detail);
                        spanType.className = `hq-completionDetail ${info?.cls??""}`;
                        spanType.textContent = info?.label??"";
                        return spanType;
                    } else {
                        const spanDom = document.createElement("span");
                        spanDom.className = "hq-completionDetail";
                        spanDom.textContent = detail;
                        return spanDom;
                    }
                },
                position: 80,
            }
        ],
        compareCompletions: (a:any, b:any) => {
            return a.type.localeCompare(b.type);
        },
        // 严格匹配
        filterStrict: true,
    });
}
