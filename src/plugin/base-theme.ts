import { EditorView } from "@codemirror/view";

// 主题配置
export const baseTheme: any = EditorView.baseTheme({
    '&': {
        color: '#586e75',
        backgroundColor: '#fff',
        caretColor: '#657b83',
        fontSize: "16px"
    },
    ".cm-content": {
        "white-space": "pre-wrap"
    },
    ".cm-line": {
        lineHeight: "1.4",
        fontFamily: "consolas, menlo, monaco, 'Ubuntu Mono', 'source-code-pro', monospace"
    },
    '&.cm-focused .cm-cursor': { borderLeftColor: '#657b83' },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection": {
        backgroundColor: "#bfe3ff",
        color: "inherit",
        height: '100%',
    },

    '.cm-panels': { backgroundColor: '#eee8d5', color: '#586e75' },
    '.cm-panels.cm-panels-top': { borderBottom: '2px solid black' },
    '.cm-panels.cm-panels-bottom': { borderTop: '2px solid black' },

    '.cm-searchMatch': {
        backgroundColor: '#f1faff',
        outline: `1px solid #d3af86`
    },
    '.cm-searchMatch.cm-searchMatch-selected': {
        backgroundColor: '#bfe3ff'
    },
    '.cm-activeLine': { backgroundColor: '#f1faff45' },
    '.cm-selectionMatch': { backgroundColor: '#bfe3ff' },

    '.cm-matchingBracket, .cm-nonmatchingBracket': {
        backgroundColor: '#bad0f847',
        outline: 'none'
    },
    '.cm-gutters': {
        backgroundColor: '#fff',
        color: '#586e75',
        border: 'none'
    },
    '.cm-lineNumbers, .cm-gutterElement': {
        color: 'inherit',
    },
    '.cm-lineNumbers, .cm-gutterElement:not(:first-child)': {
        minHeight: "22px"
    },
    '.cm-foldPlaceholder': {
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '16px',
        color: '#586e75'
    },

    '.cm-tooltip': {
        border: '1px solid #ccc',
        backgroundColor: '#fff',
        padding: '5px',
    },
    '.cm-tooltip-autocomplete': {
        background: '#fff',
        borderRadius: '4px',
        '& > ul > li': {
            height: '30px',
            lineHeight: '30px',
            borderRadius: '4px',
            verticalAlign: 'middle'
        },
        '& > ul > li[aria-selected]': {
            backgroundColor: '#f0f1f4',
            color: '#141e31',
        }
    },
    '.cm-lintPoint:after': {
        bottom: '-3px',
        left: "-3px",
        borderLeftWidth: "6px",
        borderRightWidth: "6px",
        borderBottomWidth: "8px"
    },
    ".tip-completion-custom": {
        padding: '5px',
        '&>ul':{
            '&::-webkit-scrollbar-thumb': {
                background: '#ddd',
                borderRadius: '100px',
                backgroundClip: 'content-box',
                border: '4px solid transparent',
            },
            '&::-webkit-scrollbar-track': {
                background: 'transparent',
                height: '20px',
                borderRadius: 0,
            },
            '&::-webkit-scrollbar-corner': {
                display: 'none',
            },
            '&::-webkit-scrollbar': {
                width: '14px',
                height: '14px',
            },
        },
        '& > ul > li': {
            minHeight: '34px',
            height: 'auto',
            color: '#141e31',
            verticalAlign: 'middle',
            position: 'relative',
            overflow: 'hidden'
        }
    },
    '.tip-completion-custom .cm-completionDetail': {
        display: 'none',
    },
    '.tip-completion-custom .hq-completionDetail': {
        fontStyle: 'normal',
        display: 'inline-block',
        color: 'inherit',
        position: 'absolute',
        right: '8px',
        bottom: '10px',
        fontSize: '12px'
    },
    '.tip-completion-custom .other-show-tip': {
        color: '#999',
        display: 'block',
        fontSize: '14px',
        padding: '11px 0 5px 8px',
        width: 'calc(100% + 10px)',
        margin: '0 0 34px -5px',
        backgroundColor: '#fff !important',
        borderTop: '1px solid #ccc',
    },
    '.tip-completion-custom > ul > li:first-child': {
        '& > .other-show-tip': {
            borderTop: '1px solid transparent',
            marginTop: '-2px'
        }
    },
    '.tip-completion-custom .cm-completionLabel': {
        position: 'absolute',
        left: '5px',
        bottom: '8px',
        color: '#666',
        fontSize: '14px'
    },
    '.tip-completion-custom .cm-completionMatchedText': {
        color: '#5BC686',
    },
})
