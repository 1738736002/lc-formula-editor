import React, {
    forwardRef,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import { ITextEditorProps } from "./CodeEditor";
import {
    FunctionType,
    IParseFunctionResult,
    IWithSelectCodemirrorRef
} from "./interface";
import WithSelectCom from "../components/WithSelectCom";
import { replaceTemplatePlaceholders } from "./utils";
interface IWithSelectCodemirrorProps extends ITextEditorProps {
    actionBoxHeight?: string; // 选择区域的最大高度
    showHeader?: boolean; // 是否展示头部
    showTool?: boolean; // 是否展示工具栏
    // 自定义头部内容
    renderHeader?: React.ReactNode | string;
    clickDebug?: (result: IParseFunctionResult) => void;
}

export default forwardRef<IWithSelectCodemirrorRef, IWithSelectCodemirrorProps>(
    function WithSelectCodemirror(props, ref) {
        const editorRef = useRef<any>(null);
        const [currentHoverFunc, setCurrentHoverFunc] = useState<
            FunctionType
        >();
        // 处理插入文本
        const insetDocValue = (info: any) => {
          const theme = `${props.placeholderThemeFiled ?? ""}`;
          const parent1 = info.parent?.title
              ? `.${info.parent?.title}:${info.parent?.code ?? ""}`
              : "";
          const children1 = info?.title
              ? `.${info.title}:${info.code}`
              : "";
          let temp = `[[${theme}${parent1}${children1}]]`;
          if (editorRef?.current?.insertText) {
              editorRef?.current?.insertText(temp, false);
          }
        };
        // 设置文本
        const insetFuncValue = (value: any) => {
            if (editorRef?.current?.insertText) {
                editorRef?.current?.insertText(`${value.template}`, true);
            }
        };
        useImperativeHandle(ref, () => editorRef.current);
        const handleDefaultValue = () => {
          if (props.defaultValue) {
            return replaceTemplatePlaceholders(props.defaultValue, props.variables);
          } else {
            return "";
          }
        };
        return (
            <WithSelectCom
                ref={editorRef}
                {...props}
                currentHoverFunc={currentHoverFunc}
                setCurrentHoverFunc={setCurrentHoverFunc}
                insetDocValue={insetDocValue}
                insetFuncValue={insetFuncValue}
                defaultValue={handleDefaultValue()}
            />
        );
    },
);
