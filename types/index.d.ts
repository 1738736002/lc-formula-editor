// types/src/MyComponent.d.ts
declare module 'l-formula-editor' {
    import * as React from 'react';
    export interface LFormulaEditor extends ITextEditorProps {
      actionBoxHeight?: string; // 选择区域的最大高度
      showHeader?: boolean; // 是否展示头部
      withSelect?: boolean; // 是否展示选择区域
    }
    const LFormulaEditor: React.FC<LFormulaEditor>;
    export default LFormulaEditor;
}