import { DecorationSet } from "@codemirror/view";
import { ViewUpdate } from "@codemirror/view";
import { EditorView, WidgetType } from "@codemirror/view";
import { Decoration, ViewPlugin, MatchDecorator } from "@codemirror/view";
import { FunctionType } from "../CodeEditor/interface";

export const functionPlugin = (functions: FunctionType[]) => {
  class FunctionWidget extends WidgetType {
    text: string;
    symbol: boolean;

    constructor(text: string, symbol: boolean = false) {
        super();
        this.text = text;
        this.symbol = symbol;
    }

    eq(other: FunctionWidget) {
        return this.text === other.text;
    }

    toDOM() {
        return this.createSpanElement(this.text, this.symbol);
    }

    ignoreEvent() {
        return true;
    }
    private createSpanElement(text: string, symbol: boolean = false) {
      const elt = document.createElement("span");
      const txtStr = document.createElement("span");
      txtStr.style.cssText = `
        color: #d73a49;
        line-height: 20px;
        display: inline-block;
        font-size: 16px;
        font-weight: bold;
        user-select: none;
      `;
      txtStr.textContent = text;
      elt.appendChild(txtStr);
      if (symbol) {
        const span = document.createElement("span");
        // span.classList.add("cm-matchingBracket");
        span.style.cssText = `color: #586e75;`;
        span.textContent = "(";
        elt.appendChild(span);
      }
      return elt;
    }
  }

  // 正在匹配tranVariables中的template字段
  const regexp = new RegExp(functions.map(item => item.label).join("|"), "g");

  const createFunctionMatcher = (
      regexp: RegExp,
      index: number,
      symbol: boolean,
      classWidget: any,
  ) => {
      return new MatchDecorator({
          regexp,
          decoration: match => {
              const funcName = match[index];
              if (functions.some(o => o.label === funcName)) {
                  return Decoration.replace({
                      widget: new classWidget(funcName, symbol),
                      // WidgetBefore: new FunctionLftWidget(),
                  });
              }
              return null;
          },
      });
  };


  const functionMatcher = createFunctionMatcher(/func\.(.+?)\(/g, 1, true, FunctionWidget);
  const functionMatcher2 = createFunctionMatcher(regexp, 0, false, FunctionWidget);

  const createViewPlugin = (functionMatcher: MatchDecorator) => {
    return ViewPlugin.fromClass(
      class {
        function: DecorationSet;
        constructor(view: EditorView) {
          // 通过装饰器创建 deco (装饰范围的集合)
          this.function = functionMatcher.createDeco(view);
        }
        update(update: ViewUpdate) {
          this.function = functionMatcher.updateDeco(
            update,
            this.function,
          );
        }
      },
      {
        decorations: (instance: any) => {
          return instance.function;
        },
        // 指定插件在添加到编辑器配置时提供其他扩展。
        provide: (plugin: ViewPlugin<any>) => {
          return EditorView.atomicRanges.of(view => {
            return view.plugin(plugin)?.function || Decoration.none;
          })
        }
      },
    );
  };
  return [createViewPlugin(functionMatcher), createViewPlugin(functionMatcher2)];
};
