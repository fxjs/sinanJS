# sinanJS

中文数字量提取工具

### 灵感来自

[yiyujianghu/sinan](https://github.com/yiyujianghu/sinan) - `Python`版

### 功能说明

#### 1、数量词提取

可提取文本信息中的数量信息，例如：

-   "在二楼，有三人被困，面积有三四十平米" 可提取出 "2 楼，3 人，40 平米"的信息

目前内置支持长度(m)、时间(s)、质量(kg)、货币(元)、人数(人)、楼层（楼/层）、面积(平方米)等常见信息提取，可通过扩充词典增加匹配项。

#### 2、汉字转换数字

可将文本中的数量词汉字转为相关数字，例如：

-   "一千两百五十八点二"转换为"1258.2"
-   "四分之三"转换为"0.75"

### 安装

npm

> npm install sinanjs

yarn

> yarn add sinanjs

### 使用说明

#### 1、引用

```js
// ES6
import { CreateParser } from 'sinanjs';
const si = new CreateParser({ onlyPickMax: false });

// UMD
// var si = new Sinan.CreateParser({ onlyPickMax: false });

const result = si.pick('在二楼 有三人被困 面积有三四十平米');
// 提取信息 { area: [40], floor: [2], people: [3] }
```

#### 2、参数说明

-   `onlyPickMax` 是否只拾取最大值
-   `measureDict` 扩展量词字典(格式{std: '', ...})

#### 3、返回信息

| 参数名      | 含义     | 示例(量, 默认单位) |
| :---------- | :------- | :----------------- |
| people      | 人数信息 | (2, '人')          |
| area        | 面积信息 | (2, '平方米')      |
| floor       | 楼层信息 | (2, '楼')          |
| length      | 长度信息 | (2, 'm')           |
| weight      | 质量信息 | (2, 'kg')          |
| time        | 时间信息 | (60, 's')          |
| temperature | 温度信息 | (20 '℃')           |
| money       | 钱数信息 | (30, '元')         |
