import { Button, message } from 'antd'
import React, { useMemo, useState } from 'react'
import { IParseFunctionResult, variablesModel } from '../CodeEditor/interface';
import RunResult from './RunResult';
import { parseToFunction } from "../CodeEditor/utils";
import copyTo from 'copy-to-clipboard';
interface ICodeEditorHeaderProps {
  showTool?: boolean;
  codeRef?: any;
  functions: any[];
  variables?: variablesModel[];
  filedName: string | '';
  renderHeader?: React.ReactNode | string;
  customTool?: React.ReactNode | string;
  clickDebug?: (result: IParseFunctionResult) => void;
}
interface IFunctionMap {
  [k: string]: any;
}
function CodeEditorHeader(props: ICodeEditorHeaderProps) {
  const { codeRef, functions, customTool, variables=[], showTool=false, filedName, renderHeader='公式=', clickDebug } = props;
  const [formatFunctions, setFormatFunctions] = useState('');
  const [runResult,setRunResult] = useState('');
  const [runResultOpen,setRunResultOpen] = useState(false);

  const handleCopy = () => {
    const view = codeRef.current;
    if (!view) return;
    const code = codeRef.current.getValue();
    copyTo(code,{message:'已复制内容'});
    message.success("复制成功！", 1)
  };

  const handleDebug = () => {
    const view = codeRef.current;
    if (!view) return;
    const codeStr = codeRef.current.getValue();
    const res = parseToFunction({codeStr, placeholderThemeFiled: filedName, functions, variables});
    if (res) {
      if (clickDebug) {
        clickDebug(res);
        return;
      }
      const { func, funcs, data, formatResult } = res;
      const runRes = func(
        funcs,
        data
      );
      setFormatFunctions(`return ${formatResult}`);
      setRunResult(runRes);
      setRunResultOpen(true);
    }
  };
  const handleRunResultClose = () => {
    setRunResultOpen(false);
  }
  const handleClear = () => {
    if (codeRef?.current?.clearText) {
      codeRef?.current?.clearText();
    }
  };
  return (
    <div className="hq-codeEditor-header">
      <div className='header-left'>{
        renderHeader
      }</div>
      {showTool&&<div className='header-right'>
        <Button className='header-btn' type='link' onClick={handleCopy}>复制</Button>
        <Button className='header-btn' type='link' onClick={handleClear}>清空</Button>
        <Button className='header-btn' type='link' onClick={handleDebug}>调试</Button>
      </div>}
      {customTool&&<div className='header-right'>{customTool}</div>}
      <RunResult open={runResultOpen} formatFunctions={formatFunctions} result={runResult} onClose={handleRunResultClose} ></RunResult>
    </div>
  )
}

export default CodeEditorHeader;
