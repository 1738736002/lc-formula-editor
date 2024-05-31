import React from "react";
import { FunctionType } from "../CodeEditor/interface";

interface IFunctionExplainProps {
  data: FunctionType | undefined; // 当前选中的函数；
  handleMouseOver: (e:any, container:string) => void;
  handleMouseOut: (e:any) => void;
}
function FunctionExplain(props: IFunctionExplainProps) {
  const { data,handleMouseOver, handleMouseOut} = props;
  // 给用法和示例中的函数名添加样式，通过匹配data.label
  const HighlightKeyword = ({ text, keyword }:{text:string,keyword:string}) => {
    // 使用正则表达式拆分文本，保留关键字
    const parts = text.split(new RegExp(`(${keyword})`, 'g'));
    return (
      <>
        {parts.map((part:string, index:number) =>
          part&&part.toLowerCase() === keyword.toLowerCase() ? (
            // 对关键字应用样式
            <mark key={index} className="high-light-keywords">
              {part}
            </mark>
          ) : (
            // 非关键字部分保持不变
            <span key={index}>{part}</span>
          )
        )}
      </>
    );
  };
  return <div className="function-explain-container" onMouseOver={(e) => handleMouseOver(e, "functionDetail")} onMouseOut={handleMouseOut}>
    {
      data&&Object.keys(data).length ? (<>
      {data?.label&&<div className="header-fun">{data?.label}</div>}
      <ul className="in-wrapper">
        <li className="item-explain">函数说明: {data?.detail||'暂无函数说明'} </li>
        <li className="item-explain">用法: {HighlightKeyword({ text: data?.instruction||'暂无用法说明', keyword: data?.label})} </li>
        <li className="item-explain">示例: {HighlightKeyword({text: data?.example||'暂无示例说明', keyword: data?.label})} </li>
      </ul></>) : (<div className="not-select-func">
        <ul>
          <li>从左侧面板选择字段名和函数，或输入函数</li>
          <li>此列会给出函数的使用说明</li>
        </ul>
      </div>)
    }
  </div>;
}

export default FunctionExplain;
