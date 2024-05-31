## 公式编辑器、代码编辑器，支持sql,html,js,json,customScript

---
title: 代码/公式编辑器；
order: 11

nav:
    title: 组件
    order: 1
    path: /components

group:
    title: 基本元素控件
    order: 1,
    path: "/basic"
demo:
    tocDepth: 4
---

## 介绍

-   技术栈：`react:^16.14.0`, `typescript` `less` `codemirror 6.x`
-   目标：实现一个编辑器组件，支持`javaScript`，`json`，`html`，`sql`，以及自定义的公式编辑器`customScript`；
-   实现：基于`codemirror`二次封装实现；[文档地址](https://codemirror.net/)
-   优势：
    Codemirror6 和 Codemirror5 的主要区别体现在以下几个方面：

    -   架构：CM6 是对 CM5 进行了全面重写和重构的版本，采用了新的架构。CM6 的设计目标是提供更好的可扩展性、模块化和定制性，以适应不同的编辑器需求。
    -   模块化：CM6 引入了模块化的概念，使得编辑器的功能可以以更灵活的方式组织和扩展。它提供了一套核心模块，以及可选的插件和扩展模块，使开发人员能够根据自己的需求选择和组合功能。
    -   插件系统：CM6 的插件系统更加强大和灵活。它采用了新的基于状态和触发器的机制，使得插件能够更好地与编辑器交互并响应变化。这使得开发人员能够创建更复杂和定制化的编辑器功能。
    -   渲染方式：CM6 使用新的渲染引擎，采用了虚拟 DOM 的概念，以提高性能和响应能力。它还支持可选的受限制的线性渲染模式，可以在大型文档上提供更好的性能。

-   使用的插件集合
    ```json
      "@codemirror/lang-html": "^6.4.9",
      "@codemirror/lang-javascript": "^6.2.2",
      "@codemirror/lang-json": "^6.0.1",
      "@codemirror/lang-sql": "^6.6.4",
      "@lezer/highlight": "^1.2.0",
      "codemirror": ^6.0.1;
      "antd": "3.x"
    ```

## Demo
基础场景下使用
```tsx
import React from "react";
import { Radio } from "antd";
import { HqCodemirror } from "hquipro";
import { parseToFunction } from "./utils";
import "./style/index.less";
import { variables, functionList, completions, hintPaths } from "./mockData.ts";
const { useState } = React;
export default () => {
    const [mode, setMode] = useState<"json" | "javascript" | "sql" | "html" | "customScript">("customScript");
    const placeholderThemeFiled = "id";
    const placeholderThemes = {
        [placeholderThemeFiled]: {
            textColor: "#d46b08",
            backgroudColor: "#fff7e6",
            borderColor: "#ffd591"
        }
    };
    const changeRadio = (e: any) => {
        setMode(e.target.value);
    };
    return (
      <div>
        <Radio.Group onChange={changeRadio} value={mode} buttonStyle="solid">
            <Radio.Button value="json">JSON</Radio.Button>
            <Radio.Button value="javascript">JavaScript</Radio.Button>
            <Radio.Button value="sql">SQL</Radio.Button>
            <Radio.Button value="html">HTML</Radio.Button>
            <Radio.Button value="customScript">自定义脚本</Radio.Button>
        </Radio.Group>
        <HqCodemirror
            completions={completions}
            mode={mode}
            variables={variables}
            withSelect={mode === "customScript"}
            height={180}
            showTool={true}
            showOutLine={false}
            defaultValue={"SUM([[id.常量:var.姓名:name]],[[id.常量:var.年龄:age]],[[id.常量:var.年龄2:age2]], [[id.哈哈哈:ha]])"}
            hintPaths={hintPaths}
            placeholderThemes={placeholderThemes}
            placeholderThemeFiled={placeholderThemeFiled}
            keywordsColor="#081cd4"
            keywords={["let", "const", "wen", "if", "else", "for", "while", "switch"]}
            functions={functionList}
            onChange={(data: any) => {
                const res = parseToFunction({
                    codeStr: data,
                    placeholderThemeFiled,
                    functions: functionList,
                    variables
                });
                console.log("func", res);
                if (res) {
                    const { func, funcs, data, funIng } = res;
                    console.log('res',funIng())
                    console.log("res", func(funcs, data));
                }
            }}
        />
      </div>
    );
};
```

在 sql 中使用

```tsx
import React from "react";
import { HqCodemirror } from "hquipro";
import "./style/index.less";
import { variables, functionSqlList, tablesData } from "./mockData.ts";
const { useState } = React;
export default () => {
    const placeholderThemeFiled = 'sql'
    const placeholderThemes = {
        [placeholderThemeFiled]: {
            textColor: "#4284D3",
            backgroudColor: "rgba(66,132,211,0.1)",
        }
    };
    return (
        <div>
            <HqCodemirror
                mode={"sql"}
                variables={variables}
                withSelect={true}
                showHeader={false}
                actionBoxHeight={"180px"}
                height={120}
                defaultValue={"单行输入框"}
                placeholderThemeFiled={placeholderThemeFiled}
                placeholderThemes={placeholderThemes}
                showOutLine={false}
                tables={tablesData}
                functions={functionSqlList}
                onChange={(data: any) => {
                    console.log(data);
                }}
            />
        </div>
    );
};
```

## API

| 属性　       | 描述　                                           | 　值                                                     | 　备注                     |
| ------------ | ------------------------------------------------ | -------------------------------------------------------- | -------------------------- |
| defaultValue | 文档的默认值  | string        |            |
| mode         | 编辑器支持的语言类型       | "json" / "javascript" / "sql" / "html" / "customScript"; | 必填      |
| trigger      | 触发长 change 的方式， blur 触发还是 change 触发 | "blur"/"change" | 默认值 blur |
| editable     | 编辑器是否可编辑    | Boolean    | true       |
| showOutLine | 是否focus聚焦时显示外层的虚线边框 | Boolean    | 默认值true       |
| height       | 编辑器的高度      | Number    |       |
| minHeight    | 编辑器的最小高度          | Number    |         |
| placeholder  | 编辑器的 placeholder    | string / HTMLElement    |       |
| tables       | mode = sql 时，注入表格的一些字段到 sql 语言库中 | ITableSchema   |       |
| extensions   | codemirror 的扩展配置    | Extension[] | 如果现有配置不满足可以覆盖 |
| themeStyle | 对于codemirror View.them的扩展，会覆盖掉hqcodemirror的一些默认配置 | 对象格式{[K: string]: {} } | eg：{".cm-content": {minHeight: `80px`} } |
| onChange     | change 回调函数                                  | (value: string, rely?: any) => void                      |                            |

**自定义的情况下（mode=customScript|sql）,会用到的api**
| 属性 | 描述 | 值 | 备注 |
|-----|-----|-----|-----|
| withSelect|是否展示选择区域|Boolean| 默认值 false |
| actionBoxHeight | 选择区域的最大高度 | String | 200px |
| showHeader | 编译器是否需要展示头部 | Boolean | true |
| showTool | 是否展示工具栏,当且showHeader=true时生效 | Boolean | false |
| customTool | 自定义工具栏，当showHeader=true&showTool=false生效 | React.ReactNode/string | |
| renderHeader | 头部左边区域的内容过可自定义 | React.ReactNode/string | 默认值“公式=” |
| keywordsClassName | 给关键字 Dom 添加的 className | | |
| keywords | 关键字集合，没需要可不传 | String[] | [] |
| keywordsColor | 关键字的颜色值 | 色值 | |
| functions | 自定义函数集合，可用于自动提示，或者操作区域的可选函数 | [FunctionType](####1.函数的定义)[] | |
| variables | 外部的一些变量,可用于自动提示，或者操作区域的可选变量 | [variablesModel](####2.变量)[] | |
| hintPaths | 设置一些含有子集的对象，来激活自动匹配的，例如对象 a:{age:{b:1}}, 输入 a.会弹出可选项 age,输入 a.age.同样弹出 b 可选项； | [HintPathType](####5.Hint链式)[] | |
| completions | 设置自动匹配的值，这里做了优化，变量 variables 和函数 functions 的值会被自动合到这个数组里； | [CompletionsType](####3.completions定义)[] | |
| placeholderThemes | 定义变量的样式 | PlaceholderThemesType | |
| placeholderThemeFiled| 定义变量的 filed, 主要用于最后解析显示用 | String | |
| clickDebug | 调试按钮的回调函数，返回[IParseFunctionResult](####6自定义函数的解析结果) | clickDebug?: (result: IParseFunctionResult) => void; | |

**组件向外暴露的方法**

> 通过 ref 获取组件实例，可以调用以下方法

1. insertText: 插入文本
    - 参数：text: string; isTemplate: boolean;
    - 作用：插入文本到编辑器中，isTemplate 为 true 时，会将 text 包裹在模板字符串中
2. clearText: 清空文本
    - 作用：清空编辑器中的文本
3. setText: 设置文本
    - 参数：text: string;
    - 作用：设置编辑器中的文本
4. getValue: 获取编辑器中的文本内容； - 作用：getValue();

**解析方法**
> parseToFunction: 用在 customScript 的解析;
```
import {parseToFunction} from "hquipro/es/hq-codemirror/utils";
const res = parseToFunction({codeStr: data, placeholderThemeFiled, functions: functionList, variables});
const {func, funcs, data, formatResult} = res;
```

## 数据说明

### 数据结构

#### 1.函数的定义

```ts
interface FunctionType {
    template: string;
    label: string;
    detail: string;
    type: string; // 类型 function
    parent?: any;
    handle?: any; // 函数的具体实现方法
    returnType?: string; // 函数的返回值类型
    briefly?: string; // 函数的简要描述
    paramNum?: number; // 函数的参数个数，-1表示多个参数。大于等于1个
    example?: string; // 函数的使用示例
    instruction?: string; // 函数的详细说明
    children?: FunctionType[];
}

// data
const functionList: FunctionType[] = [
    {
        label: "基础函数",
        detail: "基础函数",
        template: "基础函数",
        paramNum: 0,
        type: "groupName",
        children: [
            {
                label: "sum1",
                detail: "求和函数,求和函数，把所有参数加一起返回",
                template: "func.sum1(${1})",
                paramNum: -1, // 表示多个参数。大于等于1个
                type: "function",
                returnType: "number",
                instruction: "该求和方法需要传递数值变量, 参数可以为多个",
                example: "sum1(1,2,3)，计算结果为6",
                briefly: "求和函数",
                handle: `(...args) => {
                    return args.reduce((prev, cur) => {
                      return prev + +cur;
                    }, 0);
                }`
            }
        ]
    }
];
```

#### 2.变量

```ts
interface variablesModel {
  code: string;
  name: string;  // 名称
  children?: variablesModel[];
  type: "model" | "field"; // 区分 分组和字段
  value?: any;
  fieldType?: string;  // 字段的类型
}
const variables: any[] = [
    {
      code: "var",
      name: "常量",
      type: "model",
      children: [
        {
          name: "userId",
          code: "id",
          type: "field",
          fieldType: "Number",
          value: 1,
        },
        ...
      ]
    }
]
```

#### 3.completions 定义

> 输入提示的集合；在自定义时生效；上面的 functions 和 variables 在程序内部会自动注入的；

```ts
interface CompletionsType {
    template: string;
    label: string;
    detail: string;
    type: string;
    parent?: any;
}
const completions: CompletionsType[] = [
    {
        label: "let",
        type: "variable",
        detail: "定义变量let",
        template: "let ${1:variable} = ${2:value};" // 模板形式注入
    }
];
```

#### 4.keywords 传入字符串数组

```ts
const keywords = ["a", "switch", "b"];
```

#### 5.Hint 链式

> 支持输入 a.b.c 的提示输入

```ts
interface HintPathType {
    label: string;
    detail: string;
    type: "function" | "keyword" | "variable" | "text" | "property";
    template: string;
    children?: HintPathType[];
}
const data = [
    {
        label: "user",
        template: "user",
        detail: "用户",
        type: "variable",
        children: [
            {
                label: "department",
                template: "department",
                detail: "部门",
                type: "property",
                children: [
                    {
                        label: "name",
                        template: "name",
                        detail: "名称",
                        type: "property"
                    }
                ]
            }
        ]
    }
];
```

#### 6.自定义函数的解析结果

```ts
interface IParseFunctionResult {
    funIng: Function; // 可直接用来执行的函数；
    func: Function;
    funcs: any[];
    data: any;
    formatResult: string;
}
```

#### 变量主题色

```ts
placeholderThemeFiled: string;
interface PlaceholderThemesType {
  [placeholderThemeFiled]: CommonPlaceholderTheme;
}
interface CommonPlaceholderTheme {
  textColor: string;
  backgroudColor: string;
}
```


### 类型Map
```ts
enum typeMap = {
    "string": "字符串",
    "number": "数字",
    "boolean": "布尔",
    "object": "对象",
    "array": "数组",
    "date": "日期",
    "function": "函数",
    "null": "空",
    "undefined": "未定义",
    "symbol": "符号",
    "bigInt": "大整数",
    "regExp": "正则表达式",
    "error": "错误对象",
    "promise": "Promise对象",
    "timeStamp": "时间",
    'decimal': "数字",
    'percentage':'数字',
    'integer': "数字",
    'multiOption': '字符串',
    'select': "字符串"
};
```

### 输出是怎么样的？

输出是一个字符串形式，现在的设计是，通过保存输出字符串，在使用的地方在进行解析执行；

```
// 自动选择的情况下：求和函数sum1，年龄求和
func.sum1([[id.常量:var.年龄:age]] ,[[id.常量:var.年龄:age]] )
// 手动输入的情况下：
sum1(1,2,3)
```

### 怎么解析执行的？

组件提供了统一的解析方法，只需要传入参数，即可获取返回的函数结果；

```ts
const res = parseToFunction({ codeStr: data, placeholderThemeFiled, functions: functionList, variables });
const { funIng, func, funcs, data } = res;
// 方式一：func是主体函数， funcs是对应的函数集合，data是对应的数据
func(funcs, data);
// 方式一：或者直接执行funIng；funIng内部实现了方式一的执行过程；
funIng();
```
实现：通过 new window.Function('func', 'data', `return ${result}`);
result即为`FunctionType`中的`handle`；

### 普通的加减运算也是可以直接执行的

> 符合基础的 JavaScript 的运算规则；

```
// 插入的变量
[[id.常量:var.年龄:age]] + [[id.常量:var.年龄:age]]
输出: 36
// 简单的计算:+ - * / %
12 + 34
输出: 46
// 字符串的拼接
"hello" + " world"
输出: "hello world"
// Boolean的运算
true && false
输出: false
34>=13 | 34<=32 ...
45!==21 | 23!=122 ...

```
