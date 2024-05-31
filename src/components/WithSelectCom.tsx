import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import CodeEditorHeader from './EditorHeader'
import CodeEditor from '../CodeEditor/CodeEditor'
import ActionVariable from './ActionVariable'
import ActionFunction from './ActionFunction'
import FunctionExplain from './FunctionExplain'
import { FunctionType, IWithSelectCodemirrorProps, ScriptEditorRef } from '../CodeEditor/interface'
import { Diagnostic } from '@codemirror/lint';
import { functionsToCompletions, variablesToCompletions } from '../CodeEditor/utils';
import { Icon } from 'antd';

const AntIcon = Icon as any;
interface IWithSelectComProps extends IWithSelectCodemirrorProps {
    insetDocValue: (value: any)=>void,
    insetFuncValue: (value: any)=>void,
    currentHoverFunc: FunctionType|undefined,
    setCurrentHoverFunc: (value: FunctionType|undefined)=>void,
}
interface IWithSelectComRef {
    editorRef: any;
}
function WithSelectCom(props:IWithSelectComProps,ref:any) {
  const { actionBoxHeight = "200px", renderHeader ,showHeader = true, placeholderThemeFiled='', insetDocValue, insetFuncValue, currentHoverFunc, setCurrentHoverFunc  } = props;
  const editorRef = useRef<ScriptEditorRef>(null);
  const [ errorInfo, setErrorInfo ] = useState<Diagnostic>();
  const [selectValue, setSelectValue] = useState<FunctionType>();
  const { completions = [], variables, functions } = props;
  const handleFunctions = useMemo(
    () => functionsToCompletions(functions),
    [functions]
  );
  const handleCompletions = useMemo(
    () => [
      ...completions,
      ...variablesToCompletions(variables, placeholderThemeFiled),
      ...handleFunctions,
    ],
    [completions, variables]
  );
  useImperativeHandle(ref, () => editorRef.current);
  const isHadError = errorInfo?.message
  // hover
  const currentHoverRef = useRef<any>(null);
  const currentDetail = useRef<any>(null);

  const handleMouseOver = useCallback((e:any, detail:any) => {
    currentDetail.current = detail
    currentHoverRef.current = e.currentTarget;
  }, []);

  const handleMouseOut = useCallback((e:any) => {
    if (!currentHoverRef.current?.contains(e.relatedTarget)) {
      if (currentDetail.current !== 'functionDetail') {
        if (!(e.relatedTarget?.classList.contains('in-wrapper')||
        e.relatedTarget?.classList.contains('item-explain'))) {
          setCurrentHoverFunc(selectValue);
        }
      } else {
        setCurrentHoverFunc(selectValue);
      }
      currentDetail.current = null;
      currentHoverRef.current = null;
    }
  }, [currentDetail.current, selectValue]);
  return (
    <div className="hq-have-select-container">
      {showHeader && <CodeEditorHeader customTool={props.customTool} clickDebug={props?.clickDebug} renderHeader={renderHeader} filedName={placeholderThemeFiled} variables={variables} functions={handleFunctions} codeRef={editorRef}></CodeEditorHeader>}
      <CodeEditor
        onError={(error) => {
            setErrorInfo(error)
        }}
        ref={editorRef}
        {...props}
        functions={handleFunctions}
        completions={handleCompletions}
      />
      <div className="hq-codeMirror-error" style={{background:isHadError?'rgba(255,82,82,0.1)':'#fff'}}>
        {isHadError&&<AntIcon type="info-circle" style={{color:'#FF5252',marginRight:'6px'}} />}
        <span>{isHadError}</span>
      </div>
      <div
        className="hq-codemirror-action-box"
        style={{ maxHeight: actionBoxHeight }}
      >
        {variables && variables.length && (
          <div className="action-variable">
            <ActionVariable
              callback={insetDocValue}
              variableList={variables}
            ></ActionVariable>
          </div>
        )}
        {functions && functions.length && (
          <div className="action-function">
            <ActionFunction
              callback={insetFuncValue}
              callbackSelect={setSelectValue}
              handleHover={setCurrentHoverFunc}
              funcList={functions}
              handleMouseOver={handleMouseOver}
              handleMouseOut={handleMouseOut}
            ></ActionFunction>
          </div>
        )}
        {functions && functions.length && (
          <div className="function-explain">
            <FunctionExplain
              data={currentHoverFunc}
              handleMouseOver={handleMouseOver}
              handleMouseOut={handleMouseOut}
            ></FunctionExplain>
          </div>
        )}
      </div>
    </div>
  )
}

export default forwardRef<IWithSelectComRef, IWithSelectComProps>(WithSelectCom);
