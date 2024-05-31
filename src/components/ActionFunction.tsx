import React from "react";
import { FunctionType } from "../CodeEditor/interface";
import SearchTree from "./SearchTree";
interface IActionFuncProps {
  funcList: FunctionType[];
  callback: (funcData: any, type: string) => void;
  handleHover: (funcData: any) => void;
  handleMouseOver: (e:any,container:any) => void;
  handleMouseOut: (e:any) => void;
  callbackSelect: (funcData: any) => void;
}

function ActionFunction(props: IActionFuncProps) {
  const { funcList = [], handleHover, callback,handleMouseOver, callbackSelect, handleMouseOut } = props;
  const handleSelect = (item: any) => {
    callback && callback(item, "function");
    callbackSelect(item);
  };
  return (
    <SearchTree
      callback={handleSelect}
      data={funcList}
      handleHover={handleHover}
      treeKey={"template"}
      handleMouseOver={handleMouseOver}
      handleMouseOut={handleMouseOut}
    ></SearchTree>
  );
}

export default ActionFunction;
