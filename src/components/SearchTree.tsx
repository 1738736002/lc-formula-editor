import React, { useEffect, useMemo, useState } from "react";
import {
  arrayTreeFilter,
  defaultOpenKeys,
  expandedKeysFun,
  filterFn,
  normalizeType,
} from "../CodeEditor/utils";
import { Icon, Input, Tree } from "antd";


const AntIcon = Icon as any;
interface ITreeData {
  [key: string]: any;
  children?: ITreeData[];
}
interface ISearchTreeProps {
  treeKey: string;
  searchPlaceholder?: string;
  treeLabel?: string;
  isParentSelect?: boolean;
  data: ITreeData[];
  handleHover?: (item: ITreeData | string) => void;
  callback: (item: ITreeData) => void;
  handleMouseOver?: (e: any, container: string) => void;
  handleMouseOut?: (e: any) => void;
}

const { TreeNode, DirectoryTree } = Tree;

function SearchTree(props: ISearchTreeProps) {
  const {
    data,
    treeKey,
    isParentSelect = false,
    treeLabel = "label",
    searchPlaceholder = "搜索",
    handleHover,
    callback,
    handleMouseOut,
    handleMouseOver,
  } = props;
  const [copyTreeData, setCopyTreeData] = useState<ITreeData[]>([]);
  const [treeData, setTreeData] = useState<ITreeData[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>("");
  useEffect(() => {
    if (data.length) {
      const funcListCopy: ITreeData[] = JSON.parse(JSON.stringify(props.data));
      setCopyTreeData(funcListCopy);
      setTreeData(funcListCopy);
      setExpandedKeys(defaultOpenKeys(funcListCopy, treeKey));
    }
  }, [data]);
  // get Type
  const getFileType = (
    type: string,
    isFunc: string
  ): { label: string; cls: string } => {
    return normalizeType(type) ?? { label: "", cls: "" };
  };
  // 搜索功能
  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (value == "") {
      setTreeData(copyTreeData);
      setExpandedKeys(defaultOpenKeys(copyTreeData, treeKey));
    } else {
      const treeData = JSON.parse(JSON.stringify(copyTreeData));
      let filterTreeData = arrayTreeFilter(
        treeData,
        filterFn,
        value,
        treeLabel
      ) as ITreeData[];
      let openKeys = expandedKeysFun(filterTreeData, treeKey);
      setTreeData(filterTreeData);
      setExpandedKeys(openKeys);
      setAutoExpandParent(true);
    }
  };
  const onExpand = (expandedKeys: any) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };
  const handleSelect = (info: any) => {
    const selectedData = info.node.props.dataRef;
    callback && callback(selectedData);
  };
  const handleHoverEvent = (item: ITreeData | string) => {
    handleHover && handleHover(item);
  };
  // 处理搜索高亮大小写问题
  const handleHightLineText = (str: string) => {
    const hasLettersAtoB = /[a-z]/i.test(str);
    if (!hasLettersAtoB) {
      return searchValue;
    }
    // 检测字母是否为大写
    const containsUppercase = /[A-Z]/.test(str);
    if (containsUppercase) {
      return searchValue.toUpperCase();
    }
    // 检测字母是否为小写
    const containsLowercase = /[a-b]/.test(str);
    if (containsLowercase) {
      return searchValue.toLowerCase();
    }
    return searchValue;
  };
  const renderNodeTitle = (item: ITreeData) => {
    const title = item[treeLabel];
    const lowerStr = searchValue.toLowerCase();
    const index = title.toLowerCase().indexOf(lowerStr);
    const beforeStr = title.substring(0, index);
    const afterStr = title.substring(index + searchValue.length);
    return (
      <>
        {index > -1 ? (
          <div
            className="custom-tree-title-box"
            onMouseEnter={() => handleHoverEvent(item)}
          >
            <div className="action-tree-box">
              <span className="action-tree-title" title={title}>
                {beforeStr}
                <span style={{ color: "#f50" }}>
                  {handleHightLineText(title)}
                </span>
                {afterStr}
              </span>
              <span
                className={
                  getFileType(item.fieldType || item.returnType, item.type)?.cls
                }
              >
                {
                  getFileType(item.fieldType || item.returnType, item.type)
                    ?.label
                }
              </span>
            </div>
            <div className="briefly">{item.briefly}</div>
          </div>
        ) : (
          <div
            className="custom-tree-title-box"
            onMouseEnter={() => handleHoverEvent(item)}
          >
            <div className="action-tree-box">
              <span className="action-tree-title" title={title}>
                {title}
              </span>
              <span
                className={
                  getFileType(item.fieldType || item.returnType, item.type)?.cls
                }
              >
                {
                  getFileType(item.fieldType || item.returnType, item.type)
                    ?.label
                }
              </span>
            </div>
            <div className="briefly">{item.briefly}</div>
          </div>
        )}
      </>
    );
  };
  const renderTreeNodeFunc = (data: ITreeData[]) => {
    return data.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode
            selectable={isParentSelect}
            title={item[treeLabel]}
            key={item[treeKey]}
            dataRef={item}
          >
            {renderTreeNodeFunc(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item[treeKey]}
          selectable={true}
          isLeaf
          title={renderNodeTitle(item)}
          dataRef={item}
        />
      );
    });
  };
  const renderTreeNodes = useMemo(() => {
    return renderTreeNodeFunc(treeData);
  }, [treeData, searchValue]);
  return (
    <div
      className="search-tree-content"
      onMouseOver={(e) => handleMouseOver && handleMouseOver(e, "functionList")}
      onMouseOut={handleMouseOut ? handleMouseOut : (e) => {}}
    >
      <Input.Search
        className="code-search-tree-box"
        value={searchValue}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={searchPlaceholder}
        prefix={
          searchValue && (
            <AntIcon
              className="search-clear-all"
              onClick={() => handleSearch("")}
              type="close"
            />
          )
        }
      ></Input.Search>
      <div className="show-content">
        <DirectoryTree
          expandedKeys={expandedKeys}
          onExpand={onExpand}
          autoExpandParent={autoExpandParent}
          blockNode={true}
          showIcon={false}
          onSelect={(_, info: any) => {
            handleSelect(info);
          }}
        >
          {renderTreeNodes}
        </DirectoryTree>
        {treeData.length == 0 && (
          <div style={{ textAlign: "center", padding: "20px" }}>无搜索结果</div>
        )}
      </div>
    </div>
  );
}

export default SearchTree;
