# 此项目标准
<ol>
    <li>参数统一以小驼峰命名，文件文件夹也是如此</li>
    <li>每一个api调用要做好错误处理</li>
    <li>界面内的分页参数统一使用state管理</li>
    <li>关于Api的注释请写清楚</li>
</ol>

# 文件目录

## public

```
存储首页文件、及首页所需的样式，以及统一的配置文件。
```

## browser Router出现问题 无法访问

```
在webpack配置中修改
module.export = {
    devServer: {
        open: true,
        host: 'localhost',
        port: 3000,
        inline: true, //用于解决问题：browser Router出现 can not find 问题
        historyApiFallback: true, //用于解决问题：browser Router出现 can not find 问题
  },
}

```

当然最后还是用了hashrouter 以后再研究router的问题吧，苦涩。

# 2021/5/13
初步完成通信的工作，初版已可以使用


