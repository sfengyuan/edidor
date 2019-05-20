# Edidor
[English](https://github.com/jacobsun/edidor/blob/master/README.md)

自带主题颜色生成器的主题, 从营销的角度看有无限主题. 😂

感谢 [@GoHugoIO](https://twitter.com/GoHugoIO)的[推荐](https://twitter.com/GoHugoIO/status/1127175277673631744)

# 截图
白色模式
![screenshot](https://raw.githubusercontent.com/jacobsun/edidor/master/images/screenshot.png)
暗色模式
![screenshot](https://raw.githubusercontent.com/jacobsun/edidor/master/images/dark.png)
狂野模式
![screenshot](https://raw.githubusercontent.com/jacobsun/edidor/master/images/wild_mode.png)
还是狂野模式
![screenshot](https://raw.githubusercontent.com/jacobsun/edidor/master/images/wild_mode2.png)
仍然是狂野模式
![screenshot](https://raw.githubusercontent.com/jacobsun/edidor/master/images/wild_mode3.png)

# 狂野模式
亲自试试狂野模式吧, 不用下载安装, 到我的网站 [my site](https://ziox.xyz/). 持续点击 'Theme > Wild mode' 🙃

**不保证你能得到满意的配色**

# 特色

- 视口单位, 测试了从 1920 x 1080 到 to 320 x 568 的分辨率
- 无框架, 只有一个lodash的throttle函数, 和d3.ease 的一个easing 函数
- 所有图标都是mask-image svg, 可以随意改变颜色
- highlight.js 提供语法高亮, 可关闭从而不加载文件
- Disqus 评论
- 多国语言

i18n 还没完成, 实在没空!!
不支持IE!!

# 安装
Hugo 网站根目录运行

```
cd themes
git submodule add https://github.com/jacobsun/edidor
```
或者(这种方式, 请删除隐藏的.git文件夹)
```
cd themes
git clone https://github.com/jacobsun/edidor
```

# 使用

 从 `exampleSite` 复制 `config.toml`到网站根目录中. 运行'hugo server' 预览.

# 配置

## Logo

Logo文件必须是 `svg` 格式, 以后会修改, 复制到 根目录/static/images/ 目录里. 你可以提供3种版本.

- logo.svg
- logo_light.svg
- logo_dark.svg

主题会自动载入合适的版本.

## 菜单
有些菜单条目不要修改.

下面的别改
- name是'Theme'的顶级菜单值不要改
- 所有主题自带的的'identifier' 的值不要改.

其他可随意修改

**为什么Theme不能改, 为什么不用identifier**
不知道为什么, 给顶级菜单加identifier会有奇怪的事情发生, 所以暂时只能用Name.

## 狂野模式
狂野模式的工作原理: 当你点击'Wild mode'时, 一份随机生成的样式会被插入到页面里, 同时保存到本地. 当你去其他页面时, 本地保存的样式会被读取. 如果你想把样式应用到服务器端, 你需要使用自定义css

## 自定义css

在配置文件中, 添加
```
[params]
    customCss = ["custom.css", ...]
```
把 `custom.css` 放到 根目录/static/css 目录里.

## 使用狂野样式
点击 `Export Wild mode`, 输入主题名字, 你会下载一份css文件. 用记事本打开会看到需要的代码.
类似这个样子:
```
/*
    Hugo Edidor theme wild mode exported.
    homepage: https://github.com/jacobsun/edidor
    Usage:
    1. Throw me to your site root folder/static/css directory, you can rename me to whatever you like.
    2. Copy below code to your config file.
    --------
    [[menu.main]]
    parent = "Theme"
    identifier = "adf-a--"
    name = "adf a -"
    url = "#"
    weight = 30
    --------
    3. Change the field 'name' and 'weight' to whatever you like. Leave others alone.
*/
      .adf-a---mode code {   background: #e7e7e7  }
```

你需要把这份文件复制到根目录/static/css 中, 文件名可修改, 然后复制中间的菜单的代码, 就是--(连字符)之间的, 你可以修改`name(菜单显示的文本`和`weight(菜单顺序)`, 但是`identifier(程序需要用)`不能改.

## 自定义JS

在配置文件中添加
```
[params]
    customJs = ["custom.js", ...]
```
把`custom.js` 放到 根目录/static/js 中.

## 自定义语法高亮

主题使用 [hightlight.js](https://highlightjs.org/), 如果你想添加自己的高亮文件,首先添加自定义JS文件, 然后在配置文件里添加:

```
useCustomSyntaxHighlight = true
```
你不用手动执行代码.

# Todo

# 其他
这是一个新主题, 如果你发现任何bug, 请发issue, 欢迎贡献代码! 😊

# FAQ

# License
MIT
