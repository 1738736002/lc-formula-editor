import {
  Decoration,
  ViewPlugin,
  MatchDecorator,
  EditorView,
  ViewUpdate,
  DecorationSet,
  WidgetType,
} from "@codemirror/view";
import { PlaceholderThemesType, variablesModel } from "../CodeEditor/interface";
import { variablesToCompletions } from "../CodeEditor/utils";

export const variablesPlugin = (
  variables: variablesModel[] = [],
  themes: PlaceholderThemesType,
  placeholderThemeFiled: string
) => {
  const tranVariables = variablesToCompletions(variables,placeholderThemeFiled);
  class FunctionWidget extends WidgetType {
    text: string;

    constructor(text: string) {
      super();
      this.text = text;
    }

    eq(other: FunctionWidget) {
      return this.text == other.text;
    }

    toDOM() {
      const elt = document.createElement("span");
      if (!this.text) return elt;
      elt.textContent = this.text;
      return elt;
    }
    ignoreEvent() {
      return true;
    }
  }
  // 正在匹配tranVariables中的template字段
  const regexp = new RegExp(
    tranVariables.map((item) => item.label).join("|"),
    "g"
  );

  const variablesMatcher = new MatchDecorator({
    regexp,
    decoration: (match,view, pos) => {
      const { state } = view;
      const lineText = state.doc.lineAt(pos).text;
      const [matchText] = match;
      if (
        lineText?.[pos + matchText.length] &&
        lineText?.[pos + matchText.length] !== " "
      ) {
        return Decoration.mark({});
      }
      if (lineText?.[pos - 1] && lineText?.[pos - 1] !== " ") {
        return Decoration.mark({});
      }
      const currentVariable = tranVariables.find(
        (o) => o.label === matchText
      );
      if (tranVariables.some((o) => o.label === matchText)) {
        return Decoration.replace({
          widget: new FunctionWidget(`${currentVariable?.label || matchText}`),
        });
      }
      return null;
    },
  });

  return ViewPlugin.fromClass(
    class {
      variables: DecorationSet;
      constructor(view: EditorView) {
        // 创建所有的keywords的集合
        this.variables = variablesMatcher.createDeco(view);
      }
      update(update: ViewUpdate) {
        this.variables = variablesMatcher.updateDeco(update, this.variables);
      }
    },
    // 插件规范
    {
      decorations: (instance: any) => {
        // 允许插件提供装饰
        return instance.variables;
      },
    }
  );
};
