import { ViewUpdate } from '@codemirror/view';
import { DecorationSet } from '@codemirror/view';
import {
  Decoration,
  ViewPlugin,
  MatchDecorator,
  EditorView,
  WidgetType,
} from '@codemirror/view';

import { PlaceholderThemesType, variablesModel } from '../CodeEditor/interface';
import { variablesToCompletions } from '../CodeEditor/utils';

export const placeholdersPlugin = (themes: PlaceholderThemesType, variables:variablesModel[], placeholderThemeFiled="",mode: string = 'name') => {
  const varLabels = variablesToCompletions(variables,placeholderThemeFiled).map(c=>c.label);
  class PlaceholderWidget extends WidgetType {
    curFlag!: string;
    text!: string;
    // var 被删除了
    isDelVar: boolean | undefined;

    constructor(text: string) {
      super();
      if (text) {
        const [curFlag, ...texts] = text.split('.');
        if (curFlag && texts.length) {
          // mode为code时，显示code字段，否则显示name字段
          if (texts.length === 2) {
            this.text = texts.map(t => t.split(':')[mode === 'code' ? 1 : 0])[1];
          } else {
            this.text = texts.map(t => t.split(':')[mode === 'code' ? 1 : 0])[0];
          }
          if (!varLabels.some(it=>it === this.text)) {
            this.isDelVar = true;
          }
          this.curFlag = curFlag;
        }
      }
    }

    eq(other: PlaceholderWidget) {
      return this.text == other.text;
    }

    toDOM() {
      let elt = document.createElement('span');
      const spanInner = document.createElement('span');
      elt.style.cssText = `
        line-height: 1;
        vertical-align: top;
      `
      if (!this.text) return elt;
      if (this.isDelVar) {
        spanInner.style.cssText = `
        border-radius: 4px;
        background: #fee;
        color: #f00;
        font-size: 12px;
        padding: 4px 8px;
        display: inline-block;
        font-family: Microsoft YaHei;
        `;
        spanInner.textContent = `${this.text}-已删除`;
        elt.appendChild(spanInner);
        return elt;
      }
      const { backgroudColor, textColor } = themes[this.curFlag];
      spanInner.style.cssText = `
        border-radius: 4px;
        background: ${backgroudColor};
        color: ${textColor};
        font-size: 12px;
        margin: 1px;
        display: inline-block;
        padding: 4px 8px;
        font-family: Microsoft YaHei;
      `;
      spanInner.textContent = this.text;
      elt.appendChild(spanInner);
      return elt;
    }
    ignoreEvent() {
      return true;
    }
  }
  // 插入标签匹配器
  const placeholderMatcher = new MatchDecorator({
    regexp: /\[\[(.+?)\]\]/g,
    decoration: (match) => {
      return Decoration.replace({
        widget: new PlaceholderWidget(match[1]),
      });
    },
  });

  return ViewPlugin.fromClass(
    class {
      placeholders: DecorationSet;
      constructor(view: EditorView) {
        this.placeholders = placeholderMatcher.createDeco(view);
      }
      update(update: ViewUpdate) {
        this.placeholders = placeholderMatcher.updateDeco(
          update,
          this.placeholders
        );
      }
    },
    {
      decorations: (instance: any) => {
        return instance.placeholders;
      },
      provide: (plugin: any) =>
        EditorView.atomicRanges.of((view: any) => {
          return view.plugin(plugin)?.placeholders || Decoration.none;
        }),
    }
  );
}