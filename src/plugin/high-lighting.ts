import { syntaxHighlighting, HighlightStyle } from '@codemirror/language';
import { tags as t  } from '@lezer/highlight';

export const LightHighlight = syntaxHighlighting(HighlightStyle.define([
    // const, let, function, if
    { tag: t.keyword, color: '#A04CEA', fontWeight: "bold" },
    // document
    { tag: [t.name, t.deleted, t.character, t.macroName], color: '#657b83' },
    // getElementById
    { tag: [t.propertyName], color: '#268BD2' },
    { tag: t.comment, color: "#93A1A1", fontStyle: "italic"},
    // "string"
    { tag: [t.processingInstruction, t.string, t.inserted, t.special(t.string)], color: '#2AA198' },
    // render
    { tag: [t.function(t.variableName), t.labelName], color: '#268DCC' },
    // ???
    { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: '#CB4B16' },
    // btn, count, fn render()
    { tag: [t.definition(t.name), t.separator], color: '#657b83' },
    { tag: [t.className], color: '#268BD2' },
    { tag: [t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace], color: '#D33682' },
    { tag: [t.typeName], color: '#859900', fontStyle: '' },
    { tag: [t.operator, t.operatorKeyword], color: '#859900' },
    { tag: [t.url, t.escape, t.regexp, t.link], color: '#D30102' },
    { tag: [t.meta, t.comment], color: '#93A1A1' },
    { tag: t.strong, fontWeight: 'bold' },
    { tag: t.emphasis, fontStyle: 'italic' },
    { tag: t.link, textDecoration: 'underline' },
    { tag: t.heading, fontWeight: 'bold', color: '#268BD2' },
    { tag: t.variableName, color: '#d46b08'},
    { tag: [t.atom, t.bool, t.special(t.variableName)], color: '#657b83' },
    { tag: t.invalid, color: '' }
] as any[]));
