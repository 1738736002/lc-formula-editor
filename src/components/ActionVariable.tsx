import React, { useMemo } from "react";
import { variablesModel } from "../CodeEditor/interface";
import SearchTree from "./SearchTree";
interface IActionVariableProps {
  variableList?: variablesModel[];
  isParentSelect?: boolean;
  callback?: (varData: any, type: string) => void;
}
function ActionVariable(props: IActionVariableProps) {
  const { variableList = [], callback, isParentSelect=false } = props;

  const handleSelect = (item: any) => {
    callback && callback(item, "variable");
  };
  const formatTree = (list: variablesModel[], parent?: any): any[] => {
    return list.map((item: variablesModel) => {
      const data: any = {
        title: item.name,
        key: `${parent?.key || ""}${item.code}`,
        code: item.code,
        parent: {title: parent?.title || "", code: parent?.code || ""},
        fieldType: item.fieldType,
      };
      data.children = formatTree(item.children || [], data);
      return data;
    });
  };

  const treeData: any[] = useMemo(() => {
    return formatTree(variableList);
  }, [variableList]);

  return (
    <SearchTree
        callback={handleSelect}
        data={treeData}
        treeKey={"key"}
        isParentSelect={isParentSelect}
        treeLabel={"title"}
      ></SearchTree>
  );
}

export default ActionVariable;
