import { SQLDialect } from "@codemirror/lang-sql";
import {
  CompletionsType,
  FunctionType,
  IParseFunctionResult,
  variablesModel,
} from "./interface";

export type ITableSchema = Array<{
  tableName: string;
  columns?: any[];
  namekey?: string;
}>;

// sparksql 3.3.0 api列表
export const appendkeys =
  "abs acos acosh add_months aes_decrypt aes_encrypt aggregate and any approx_count_distinct approx_percentile array array_contains array_agg array_size array_distinct array_except array_intersect array_join array_max array_min array_position array_remove array_repeat array_sort array_union arrays_overlap arrays_zip ascii asin asinh assert_true atan atan2 atanh avg base64 bigint bin binary bit_get bit_and bit_count bit_length bit_or bit_xor bool_and bool_or boolean bround btrim cardinality cast cbrt ceil ceiling contains char char_length character_length chr coalesce collect_list collect_set concat concat_ws conv corr cos cosh cot count count_if count_min_sketch covar_pop covar_samp crc32 cube cume_dist current_catalog current_database current_date current_timestamp current_timezone current_user csc date date_add date_format date_from_unix_date date_part date_sub date_trunc datediff day dayofmonth dayofweek dayofyear decimal decode degrees dense_rank div endswith double e element_at elt encode every exists exp explode explode_outer expm1 extract factorial filter find_in_set first first_value flatten float floor forall format_number format_string from_csv from_json from_unixtime from_utc_timestamp get_json_object getbit greatest grouping grouping_id hash hex hour hypot histogram_numeric if ifnull ilike in initcap inline inline_outer input_file_block_length input_file_block_start input_file_name instr int isnan isnotnull isnull java_method json_array_length json_object_keys json_tuple kurtosis lag last last_day last_value lcase lead least left length levenshtein like ln locate log log10 log1p log2 lower lpad ltrim make_date make_dt_interval make_interval make_timestamp map_contains_key make_ym_interval map map_concat map_entries map_filter map_from_arrays map_from_entries map_keys map_values map_zip_with max max_by md5 mean min min_by minute mod monotonically_increasing_id month months_between named_struct nanvl negative next_day not now nth_value ntile nullif nvl nvl2 octet_length or overlay parse_url percent_rank percentile percentile_approx pi pmod posexplode posexplode_outer position positive pow power printf quarter radians raise_error rand randn random rank regr_avgx regr_avgy regr_count regr_r2 reflect regexp_extract regexp_extract_all regexp_replace regexp_like repeat replace reverse right rint rlike rollup round row_number rpad rtrim schema_of_csv schema_of_json sec second sentences sequence session_window sha sha1 sha2 shiftleft shiftright shiftrightunsigned shuffle sign signum sin sinh size skewness slice smallint some sort_array soundex split_part space spark_partition_id split sqrt stack std stddev stddev_pop startswith stddev_samp str_to_map string struct substr substring substring_index sum tan tanh timestamp timestamp_micros timestamp_millis timestamp_seconds tinyint to_csv to_date to_json to_timestamp to_unix_timestamp to_utc_timestamp transform transform_keys transform_values to_binary to_number try_multiply try_subtract try_sum try_element_at try_avg try_to_number translate trim trunc try_add try_divide try_to_binary typeof ucase unbase64 unhex user unix_date unix_micros unix_millis unix_seconds unix_timestamp upper uuid var_pop var_samp variance version weekday weekofyear when width_bucket window xpath xpath_boolean xpath_double xpath_float xpath_int xpath_long xpath_number xpath_short xpath_string xxhash64 year zip_with";
const keys =
  "add after all alter analyze and anti archive array as asc at between bucket buckets by cache cascade case cast change clear cluster clustered codegen collection column columns comment commit compact compactions compute concatenate cost create cross cube current current_date current_timestamp database databases data dbproperties defined delete delimited deny desc describe dfs directories distinct distribute drop else end escaped except exchange exists explain export extended external false fields fileformat first following for format formatted from full function functions global grant group grouping having if ignore import in index indexes inner inpath inputformat insert intersect interval into is items join keys last lateral lazy left like limit lines list load local location lock locks logical macro map minus msck natural no not null nulls of on optimize option options or order out outer outputformat over overwrite partition partitioned partitions percent preceding principals purge range recordreader recordwriter recover reduce refresh regexp rename repair replace reset restrict revoke right rlike role roles rollback rollup row rows schema schemas select semi separated serde serdeproperties set sets show skewed sort sorted start statistics stored stratify struct table tables tablesample tblproperties temp temporary terminated then to touch transaction transactions transform true truncate unarchive unbounded uncache union unlock unset use using values view when where window with pivot";
export const tins =
  "tinyint smallint int bigint boolean float double string binary timestamp decimal map struct uniontype delimited serde sequencefile textfile rcfile inputformat outputformat";

const SparkSql = (appendKeyWords: any[]) =>
  SQLDialect.define({
    operatorChars: "*/+-%<>!=~&|^",
    // tslint:disable-next-line:max-line-length
    keywords: keys + " " + appendkeys,
    // tslint:disable-next-line:max-line-length
    builtin:
      tins + (appendKeyWords.length ? ` ${appendKeyWords.join(" ")}` : ""),
    charSetCasts: true,
    hashComments: true,
    spaceAfterDashes: true,
    doubleQuotedStrings: true,
    identifierQuotes: "`",
  });

// sql
export const sqlKeys = keys + appendkeys;
export const sqlThemeFiled = "sql";
// 图部分的常量
const HIDE_COLUMN_NAME = "extraInfo";
export const getTableSchema = (tables: ITableSchema) => {
  const schema: any = {};
  let keywords: string[] = [];
  tables.map((tableConf) => {
    const { columns = [], tableName, namekey = "name" } = tableConf;
    schema[tableName] = schema[tableName] || [];
    keywords.push(tableName);
    columns.map((col: { [x: string]: any }) => {
      const name = typeof col === "string" ? col : col[namekey];
      if (name !== HIDE_COLUMN_NAME) {
        schema[tableName].push(name);
        keywords.push(name);
        schema[name] = schema[name] || [];
      }
    });
  });
  keywords = keywords.filter((s, i, ary) => ary.indexOf(s) === i);
  return {
    schema,
    dialect: SparkSql(keywords),
  };
};
// 根据tables生成variables
export const tablesToVariables = (tables: ITableSchema) => {
  const variables: variablesModel[] = [];
  tables.forEach((table) => {
    const { columns = [], tableName, namekey = "name" } = table;
    // const tableVar:variablesModel = {
    //   name: tableName,
    //   code: tableName,
    //   type: "model",
    //   children: []
    // };
    columns.forEach((col: { [x: string]: any }) => {
      const name = typeof col === "string" ? col : col[namekey];
      const fileType = typeof col === "string" ? "" : col.dataType;
      if (name !== HIDE_COLUMN_NAME) {
        // @ts-ignore
        variables.push({
          name: name,
          code: name,
          type: "field",
          fieldType: fileType,
        });
      }
    });
    // variables.push(tableVar);
  });
  return variables;
};
// 针对sql格式化之后的变量复原操作；
export const getSqlRealText = (docs:string) => {
  if (!docs) return docs;
  // 检测docs中是否包含 [[字段.字段1:字段2]] 的字符，有则替换为 字段1的值；
  const pattern =
    /\[\[\w+\.((\w|[\u4e00-\u9fa5])+):((\w|[\u4e00-\u9fa5])+)\]\]/g;
  docs = docs.replace(pattern, (_:any, fieldName:string) => {
    // 如果fieldName是一个数字，则给他加``包裹;
    const str = fieldName.replace(/\s+/g, "");
    return isNaN(Number(str)) ? str : `\`${str}\``;
  });
  return docs;
};

export const variablesToCompletions = (
  variables: variablesModel[] = [],
  placeholderThemeFiled = "",
  parent?: variablesModel
) => {
  const completions: CompletionsType[] = [];
  variables.forEach((variable) => {
    if (variable.type === "field") {
      const theme = `${placeholderThemeFiled ?? ""}`;
      const parent1 = parent?.name
        ? `.${parent?.name}:${parent?.code ?? ""}`
        : "";
      const children1 = variable?.name
        ? `.${variable.name}:${variable.code}`
        : "";
      let temp = `[[${theme}${parent1}${children1}]]`;
      completions.push({
        label: variable.name,
        type: "variable",
        detail: variable.fieldType as string,
        template: temp,
        parent: parent,
      });
    }
    if (variable.children) {
      completions.push(
        ...variablesToCompletions(
          variable.children,
          placeholderThemeFiled,
          variable
        )
      );
    }
  });
  return completions;
};

export const functionsToCompletions = (functions: FunctionType[] = []) => {
  const completions: FunctionType[] = [];
  functions.forEach((func) => {
    if (func.type === "function") {
      completions.push({
        label: func.label,
        type: func.type,
        detail: func.briefly as string,
        template: func.template,
        handle: func.handle,
        paramNum: func.paramNum,
      });
    }
    if (func.children) {
      completions.push(...functionsToCompletions(func.children));
    }
  });
  return completions;
};

export const cnPhrases = {
  // @codemirror/view
  "Control character": "控制字符",
  // @codemirror/search
  "Go to line": "转到行",
  go: "确定",
  Find: "查找字符串",
  Replace: "替换字符串",
  next: "下一个",
  previous: "上一个",
  all: "全部",
  "match case": "区分大小写",
  replace: "替换",
  "replace all": "全部替换",
  close: "关闭",
  "current match": "当前匹配",
  regexp: "正则",
  "on line": "在行",
  "by word": "关键字",
};

// tree结构的搜索过滤
export const arrayTreeFilter = (
  data: any[],
  predicate: (node: any, t: string, treeKey: string) => boolean,
  filterText: string,
  treeKey: string
) => {
  const nodes = data;
  // 如果已经没有节点了，结束递归
  if (!(nodes && nodes.length)) {
    return;
  }
  const newChildren: any[] = [];
  for (const node of nodes) {
    // for..of循环， node即item
    if (predicate(node, filterText, treeKey)) {
      // 如果自己（节点）符合条件，直接加入到新的节点集
      newChildren.push(node);
      // 并接着处理其 children,（因为父节点符合，子节点一定要在，所以这一步就不递归了）
      if (node.children && node.children.length > 0) {
        node.children = arrayTreeFilter(
          node.children,
          predicate,
          filterText,
          treeKey
        );
      }
    } else {
      // 如果自己不符合条件，需要根据子集来判断它是否将其加入新节点集
      // 根据递归调用 arrayTreeFilter() 的返回值来判断
      const children = node.children || [];
      const subs = arrayTreeFilter(children, predicate, filterText, treeKey);
      // 以下两个条件任何一个成立，当前节点都应该加入到新子节点集中
      // 1. 子孙节点中存在符合条件的，即 subs 数组中有值
      // 2. 自己本身符合条件
      if ((subs && subs.length) || predicate(node, filterText, treeKey)) {
        node.children = subs;
        newChildren.push(node);
      }
    }
  }
  return newChildren;
};

export const filterFn = (data: any, filterText: string, key = "label") => {
  if (!filterText) {
    return true;
  }
  return new RegExp(filterText, "i").test(data[key]);
};
export const expandedKeysFun = (treeData: any[], key: string) => {
  // 展开 key函数
  if (treeData && treeData.length == 0) {
    return [];
  }
  let arr: string[] = [];
  const expandedFn = (treeData: any[]) => {
    treeData.map((item) => {
      arr.push(item[key]);
      if (item.children && item.children.length > 0) {
        expandedKeysFun(item.children, key);
      }
    });
  };
  expandedFn(treeData);
  return arr;
};
// 默认打开一级父节点
export const defaultOpenKeys = (data: any[], key = "value") => {
  const expandedKeys: string[] = [];
  data.forEach((item) => {
    expandedKeys.push(item[key]);
  });
  return expandedKeys;
};

/**
 * 解析成函数形式，针对js
 * @param {codeStr:String, placeholderThemeFiled:string, functions, variables}
 */
interface IParseFunctionProps {
  codeStr: string;
  placeholderThemeFiled: string;
  functions: any[];
  variables: any[];
}
function getData(variables: any[]) {
  return variables.reduce((prevModel: any, model: any) => {
    prevModel[model.code] =
      model.children && model.children.length > 0
        ? model.children.reduce((prevField: any, field: any) => {
            prevField[field.code] = field.value;
            return prevField;
          }, {})
        : model.value;
    return prevModel;
  }, {});
}
function getFunctions(functions: any[]) {
  const completions: any[] = [];
  functions.forEach((func) => {
    if (func.type === "function") {
      completions.push({
        label: func.label,
        type: func.type,
        detail: func.detail,
        template: func.template,
        handle: func.handle,
        paramNum: func.paramNum,
      });
    }
    if (func.children) {
      completions.push(...getFunctions(func.children));
    }
  });
  return completions;
}
export const parseToFunction = ({
  codeStr,
  placeholderThemeFiled,
  functions,
  variables,
}: IParseFunctionProps): IParseFunctionResult | undefined => {
  const code = codeStr;
  let result = code.replace(/\[\[(.+?)\]\]/g, (_: string, $2: string) => {
    const [type, ...rest] = $2.split(".");
    if (type === placeholderThemeFiled) {
      const [modelCode, fieldCode] = rest.map((t) => t.split(":")[1]);
      // 哪个模块下的哪个字段
      if (fieldCode) {
        return `data?.['${modelCode}']?.['${fieldCode}']`;
      }
      // 一级的情况
      return `data?.['${modelCode}']`;
    }
    return "";
  });
  if (!result) return;
  const data = getData(variables);
  const handleFunctions = getFunctions(functions);
  result = result.split("\n").pop() || "";
  if (!result) return;
  const funcs = handleFunctions.reduce((prev: { [k in string]: any }, cur) => {
    if (cur.handle) {
      const handle = new window.Function(`return ${cur.handle}`);
      prev[cur.label] = handle();
    }
    return prev;
  }, {});
  const funcKeys = funcs ? Object.keys(funcs) : [];
  funcKeys.forEach((key) => {
    // 检测result中是否有函数和funcKeys相同的值，避免存在sum，sum1这样类似的检测错误，有则判断该值的前面是为`func.`，如果不是则添加
    const reg = new RegExp(`\\b${key}\\b`, "g");
    const reg2 = new RegExp(`\\bfunc.${key}\\b`, "g");
    if (result.match(reg) && !result.match(reg2)) {
      result = result.replace(reg, `func.${key}`);
    }
  });
  // 创建函数
  const func = new window.Function("func", "data", `return ${result}`);
  const funIng = () => {
    return func(funcs, data);
  };
  return {
    funIng,
    func,
    funcs,
    data,
    formatResult: result,
  };
};
function removeQuotedText(str: string): string {
  // 正则表达式用于匹配单引号或双引号包裹的字符，包括引号本身
  const regex = /(["'])(?:(?=(\\?))\2.)*?\1/g;

  // 使用replace方法删除匹配到的被引号包裹的字符
  return str.replace(regex, "");
}
function replaceString(str:string) {
  // 第一种情况：[[sql.a:b]] sql.后面只有一对a:b
  // 使用正则表达式匹配模式并替换为所需格式
  let result = str.replace(
    /\[\[\w+\.((\w|[\u4e00-\u9fa5])+):(\w|[\u4e00-\u9fa5])+\]\]/g,
    "$1"
  );
  result = result.replace(
    /\[\[\w+\.(\w|[\u4e00-\u9fa5])+:(\w|[\u4e00-\u9fa5])+\.((\w|[\u4e00-\u9fa5])+):(\w|[\u4e00-\u9fa5])+\]\]/g,
    "$3"
  );
  result = result.replace(
    /\[\[\w+\.(\w|[\u4e00-\u9fa5])+:(\w|[\u4e00-\u9fa5])+\.(\w|[\u4e00-\u9fa5])+:((\w|[\u4e00-\u9fa5])+):(\w|[\u4e00-\u9fa5])+\]\]/g,
    "$4"
  );
  return result;
}
/**
 * 校验字符合法性
 * @param str
 */
export function regExpCheck(
  str: string,
  allKeys: string[],
  operator: string[],
  diagnostics: any[],
  variables: any[]
) {
  // 转义运算符以适用于正则表达式
  const escapedOperators = operator.map((op) =>
    op.replace(/[.*+-?^${}()|[\]\\]/g, "\\$&")
  );
  // 构造匹配运算符或其他字符序列的正则表达式
  const regex = new RegExp(`(${escapedOperators.join("|")})`);
  // 加一步截断处理，针对字符串的输入；如果存在变量中的值，没有[[x.b:c.a:c]]的格式，提示不合法字段；
  const varVerify = (variables:variablesModel[]) => {
    variables.forEach((item:variablesModel) => {
      if (item.children && item.children.length) {
        varVerify(item.children);
      } else {
        // 按符号分割，存在变量中的再去校验
        const tokens = str.replace(/\s+/g, "").split(regex).filter(Boolean);
        // str中存在重复的字段，一个合法另一个不合法的情况；例如：[[x.变量：12]], 变量；
        if (tokens.includes(item.name)) {
          const signReg = new RegExp(`${item.name}(?!:)`, "g");
          if (signReg.test(str)) {
            diagnostics.push({
              from: 0,
              to: 0,
              severity: "error",
              message: `“${item.name}”字符错误`,
            });
          }
        }
      }
    });
  };
  varVerify(variables);
  let newStr = replaceString(str);
  // 1.空格分割
  // 1.2为了避免字符串二次分割，先取出来，再进行二次分割
  newStr = removeQuotedText(newStr);
  const parts = newStr.split(/\s+/).filter(Boolean);
  // 1.1 检查是否为合法的字符（数字、字符串、布尔值、运算符）
  const isValidToken = (token:any) => {
    if (!isNaN(token)) return true; // 是数字
    if (
      (token.startsWith(`"`) && token.endsWith(`"`)) ||
      (token.startsWith(`'`) && token.endsWith(`'`))
    )
      return true; // 是字符串
    if (token === "true" || token === "false") return true; // 是布尔值
    if (operator.includes(token)) return true; // 是运算符
    return false;
  };
  try {
    parts.forEach((part) => {
      if (
        (part.startsWith(`"`) && part.endsWith(`"`)) ||
        (part.startsWith(`'`) && part.endsWith(`'`))
      ) {
        return true;
      }
      // 2. 检查是否在关键字中
      if (!allKeys.includes(part)) {
        // 3. 进一步按运算符分割；
        const tokens = part.split(regex).filter(Boolean);
        tokens.forEach((token) => {
          const isSomeToken = allKeys.some((it) => token == it);
          if (!isSomeToken) {
            if (!isValidToken(token)) {
              diagnostics.push({
                from: 0,
                to: 0,
                severity: "error",
                message: `“${token}”拼写错误或者其附近存在非法字符`,
                markClass: "error-class",
              });
            }
          }
        });
      }
    });
  } catch (error:any) {
    console.error(error.message);
  }
}

// 根据类型添加对应的样式文案map
export function normalizeType(
  type = ""
): null | { label: string; cls: string } {
  if (!type) return null;

  const normalizedType = type.toLowerCase();
  const typeInfo = {
    string: { label: "字符串", cls: "string-class" },
    number: { label: "数字", cls: "number-class" },
    date: { label: "日期", cls: "date-class" },
    boolean: { label: "布尔", cls: "boolean-class" },
    object: { label: "对象", cls: "object-class" },
    array: { label: "数组", cls: "array-class" },
    timeStamp: { label: "时间", cls: "date-class" },
    decimal: { label: "数字", cls: "number-class" },
    percentage: { label: "数字", cls: "number-class" },
    integer: { label: "数字", cls: "number-class" },
    multiOption: { label: "字符串", cls: "string-class" },
    select: { label: "字符串", cls: "string-class" },
    bigInt: { label: "大整数", cls: "number-class" },
    function: { label: "函数", cls: "default-class" },
    null: { label: "空", cls: "default-class" },
    undefined: { label: "未定义", cls: "default-class" },
    symbol: { label: "符号", cls: "default-class" },
    regExp: { label: "正则表达式", cls: "default-class" },
    error: { label: "错误对象", cls: "default-class" },
    promise: { label: "Promise对象", cls: "default-class" },
  }[normalizedType];

  // 当找不到匹配类型时，返回默认值
  if (!typeInfo) {
    return { label: "未知类型", cls: "default-class" };
  }

  return typeInfo;
}

// 回显当字段名称被修改，执行替换操作；
export // 查找匹配的项并替换 label1，同时保留原有的 code 部分
function replaceTemplatePlaceholders(template:string, variables:variablesModel[]|undefined) {
    if(!variables||variables&&variables.length==0) return template;
    return template.replace(/\[\[(.*?)\]\]/g, (_, match) => {
    const parts = match.split(":");
    const code1 = parts[parts.length - 1]; // 最后一个部分是 code1
    let found = false;
    // 定义一个函数来查找并替换变量
    function replaceVariable(variableList:variablesModel[]) {
      for (const variable of variableList) {
        if (variable.children) {
          const result:any = replaceVariable(variable.children);
          if (result) return result;
        } else if (variable.code === code1) {
          found = true;
          const newParts = parts.map((part:any, index:number) => {
            if (index === parts.length - 2) {
              // 倒数第二个部分是 label1
              const subParts = part.split(".");
              subParts[subParts.length - 1] = variable.name;
              return subParts.join(".");
            }
            return part;
          });
          return `[[${newParts.join(":")}]]`;
        }
      }
      return null;
    }
    const result = replaceVariable(variables);
    if (result) return result;
    // 没找到匹配项，返回原来的模板字符串
    if (!found) {
      return `[[${match}]]`;
    }
  });
}
