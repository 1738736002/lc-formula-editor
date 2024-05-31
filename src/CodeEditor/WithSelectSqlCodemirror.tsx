// sql携带可选择框
import React, {
    forwardRef,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import { ITextEditorProps } from "./CodeEditor";
import { tablesToVariables } from "./utils";
import WithSelectCom from "../components/WithSelectCom";

interface IWithSelectSqlCodemirrorProps extends ITextEditorProps {
    actionBoxHeight?: string; // 选择区域的最大高度
    showHeader?: boolean; // 是否展示头部
    showTool?: boolean; // 是否展示工具栏
    // 自定义头部内容
    renderHeader?: React.ReactNode;
}
export default forwardRef<any, IWithSelectSqlCodemirrorProps>(
    function WithSelectSqlCodeEditor(props, ref) {
        const {
            variables = [],
            placeholderThemeFiled,
            tables = []} = props;
        const editorRef = useRef<any>(null);
        const [currentHoverFunc, setCurrentHoverFunc] = useState<any>();
        // 将表格转换为变量
        const tableVariables = tablesToVariables(tables).concat(variables);
        // 处理插入文本
        const insetDocValue = (info: any) => {
            const text = `[[${placeholderThemeFiled}.${info.title}:${info.code}]]`;
            if (editorRef?.current?.insertText) {
                editorRef?.current?.insertText(text, false);
            }
        };
        const handleDefaultValue = () => {
          // 判断默认值中是否存在tableVariables中的label，有则格式化
          let defaultValue = props?.defaultValue||'';
          if (defaultValue && tableVariables.length) {
            tableVariables.forEach(t=>{
              if (defaultValue.includes(t.name)) {
                defaultValue = defaultValue.replace(t.name, `[[${placeholderThemeFiled}.${t.name}:${t.code}]]`)
              }
            })
          }
          return defaultValue;
        }
        // 设置文本
        const insetFuncValue = (value: any) => {
            if (editorRef?.current?.insertText) {
                editorRef?.current?.insertText(`${value.template}`, true);
            }
        };
        useImperativeHandle(ref, () => editorRef.current);
        return (
            <WithSelectCom
                ref={editorRef}
                {...props}
                defaultValue={handleDefaultValue()}
                variables={tableVariables}
                currentHoverFunc={currentHoverFunc}
                setCurrentHoverFunc={setCurrentHoverFunc}
                insetDocValue={insetDocValue}
                insetFuncValue={insetFuncValue}
            />
        );
    },
);
