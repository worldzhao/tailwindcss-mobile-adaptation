## 使用 CSS 变量进行 TailwindCSS 移动端适配

## 示例

请查阅本仓库下的 `apps/example-*` 下对应的 `flexible.js` 文件

## 前言

在将设计师提供的字体、字号以及颜色等规范集成到项目中后，我们开始享受使用 TailwindCSS 编写样式的便利。无需频繁在 HTML 与 CSS 之间切换，不用纠结命名问题，也不会产生各种奇怪的魔法字段。然而，在使用过程中也会遇到一些小问题。

本文不做 TailwindCSS 的推广，仅从日常使用过程中遇到的一些场景提出解决方案。关于使用 TailwindCSS 的好处，可以阅读 [Why Tailwind CSS](https://bytedance.larkoffice.com/wiki/wikcnhS9YBoRAbkjGcLw0VdCWgd) 一文。

## 前置知识

新手开发者在上手 TailwindCSS 时，通常会被告知一个基本规则：在 TailwindCSS 体系中，间距或宽高的基本单位为 `4px`。例如，`mr-1` 等价于 `margin-right: 4px`。

在遇到设计稿上右边距为 `16px` 时，会下意识地除以 4 得到 `mr-4`。

![编译结果](https://raw.githubusercontent.com/worldzhao/blog/master/images/0a9a17e0c059baaecc2130d6156203aca1c01a2e2b345f7774840acc99ad99ce.png)

> 笔者项目增加了 tw- 前缀，无需关注

通过编译结果可以看到，TailwindCSS 将 `mr-1` 编译为 `margin-right: 0.25rem`。在没有特殊设置的情况下，一个 Web 应用的 RootFontSize 通常是 `16px`，这就形成了上述的映射规则。

由此可知，TailwindCSS 的基本单位是 `rem`，通常配合默认的根节点字号 `16px` 使用。

但是大多数人很快就会遇到第一个问题：

**在保证先前开发直觉的前提下，移动端项目该如何集成 TailwindCSS？**

## 移动端适配

目前移动端的适配方案主要以 `rem` 和 `vw` 为主流，遵循等比缩放的原则（适应各种设备屏幕尺寸进行差异化处理当然是正确的，但在实际落地场景中，这往往不是研发人员能够轻易决定的）。

当新建一个移动端项目时，接入通常非常简单：

1. 将 RootFontSize 配置为 `16px`。
2. 注入类似于 `flexible.js` 的脚本，随屏幕宽度变化等比设置 RootFontSize。
3. 配置好 `px2rem` 等 PostCSS 插件，将代码中的 `px` 单位转为合适的 `rem` 单位。
4. 接入 TailwindCSS。

如此一来，与正常的 PC 端项目类似，但往往没有那么多新项目给你去接入，更多的场景是已有的一个移动端项目去接入。这些项目使用的自适应方案也不尽相同，比如有的项目大概率 RootFontSize 是 `100px`（方便开发人员根据视觉稿手写 `rem`），同时没有接入 `px2rem` 等插件，也有的项目直接使用 `vw` 布局。这些不同的情况需要一个统一的方案去适配。

同时还有一个问题，若同一个应用既有 PC 端也有移动端，构建时该如何区分？

此时 `mr-1` 构建结果为 `margin-right: 0.25rem`，只要移动端的 RootFontSize 不为 16px，那么切换至移动端必然会导致样式错乱。

其实解决方案也很简单，那就是**将构建时单位移至运行时确定，引入 CSS 变量即可**。

## 解决方案

见以下函数：

```js
module.exports = (unit = '--tpx') => {
  const convert = (value) => `calc(${16 * value} * var(${unit}))`;
  return {
    spacing: () => ({
      ...Array.from({ length: 96 }, (_, index) => index * 0.5)
        .filter((i) => i)
        .reduce((acc, i) => ({ ...acc, [i]: `${convert(i / 4)}` }), {}),
    }),
    lineHeight: {
      3: `${convert(0.75)}` /* 12px */,
      3.25: `${convert(0.8125)}` /* 13px */,
      4: `${convert(1)}` /* 16px */,
      4.5: `${convert(1.125)}` /* 18px */,
      5: `${convert(1.25)}` /* 20px */,
      6: `${convert(1.5)}` /* 24px */,
      6.5: `${convert(1.625)}` /* 26px */,
      7: `${convert(1.75)}` /* 28px */,
      8: `${convert(2)}` /* 32px */,
      9: `${convert(2.25)}` /* 36px */,
      10: `${convert(2.5)}` /* 40px */,
      10.5: `${convert(2.625)}` /* 42px */,
    },
    fontSize: {
      xs: [convert(0.75), { lineHeight: convert(1) }], // 12px 16px
      sm: [convert(0.875), { lineHeight: convert(1.25) }], // 14px 20px
      base: [convert(1), { lineHeight: convert(1.5) }], // 16px 24px
      lg: [convert(1.125), { lineHeight: convert(1.75) }], // ...
      xl: [convert(1.25), { lineHeight: convert(1.75) }],
      '2xl': [convert(1.5), { lineHeight: convert(2) }],
      '3xl': [convert(1.875), { lineHeight: convert(2.25) }],
      '4xl': [convert(2.25), { lineHeight: convert(2.5) }],
      '5xl': [convert(3), { lineHeight: convert(1) }],
      '6xl': [convert(3.75), { lineHeight: convert(1) }],
      '7xl': [convert(4.5), { lineHeight: convert(1) }],
      '8xl': [convert(6), { lineHeight: convert(1) }],
      '9xl': [convert(8), { lineHeight: convert(1) }],
    },
    borderRadius: {
      sm: `${convert(0.125)}` /* 2px */,
      DEFAULT: `${convert(0.25)}` /* 4px */,
      md: `${convert(0.375)}` /* 6px */,
      lg: `${convert(0.5)}` /* 8px */,
      xl: `${convert(0.75)}` /* 12px */,
      '2xl': `${convert(1)}` /* 16px */,
      '3xl': `${convert(1.5)}` /* 24px */,
    },
    minWidth: (theme) => ({
      ...theme('spacing'),
    }),
    maxWidth: (theme) => ({
      ...theme('spacing'),
      0: '0rem',
      xs: `${convert(20)}` /* 320px */,
      sm: `${convert(24)}` /* 384px */,
      md: `${convert(28)}` /* 448px */,
      lg: `${convert(32)}` /* 512px */,
      xl: `${convert(36)}` /* 576px */,
      '2xl': `${convert(42)}` /* 672px */,
      '3xl': `${convert(48)}` /* 768px */,
      '4xl': `${convert(56)}` /* 896px */,
      '5xl': `${convert(64)}` /* 1024px */,
      '6xl': `${convert(72)}` /* 1152px */,
      '7xl': `${convert(80)}` /* 1280px */,
    }),
  };
};
```

![tpx css 变量](https://raw.githubusercontent.com/worldzhao/blog/master/images/202406031534410.png)

在这个函数中，我们将 `mr-1` 转换为 `calc(4 * var(--tpx))`。只要在标准设备尺寸下将 `tpx` 始终保持为 1px 的大小，我们就可以继续沿用 TailwindCSS 的“1 个基本单位为 4px”的规则。

以下是一些具体案例：

- 在标准设备尺寸下使用 rem 布局，RootFontSize 为 16px，`tpx` 为 `0.0625rem`，即 `16px \* 0.0625 = 1px`。
- 在标准设备尺寸下使用 rem 布局，RootFontSize 为 100px，`tpx` 为 `0.01rem`，即 `100px \* 0.01 = 1px`。详情可见 `apps/example-rem`
- 在标准设备尺寸下使用 vw 布局，假设屏幕宽度为 375px，`100vw = 375px`，因此 `1vw = 3.75px`，则 `1px` 为 `1vw/3.75`，即 `tpx` 为 `(100/375)vw`。详情可见 `apps/example-rem`
- 如果移动端和 PC 端在同一个应用中，那么在页面尺寸发生变化时，动态修改 `--tpx` 的值即可。例如，在 PC 端设置 `--tpx` 为 `1px`，而在移动端设置 `--tpx` 为 `0.01rem` 或`(1/3.75)vw`。详情可见 `apps/example-universal-unit`

随着屏幕尺寸的变化，RootFontSize 或 vw 也会随之变化，因此 `tpx` 也会相应调整（因为使用了 rem），从而实现移动端的等比缩放。

使用 CSS 变量还可以为不同的区域应用不同的适配规则，只需在对应组件根元素节点上覆盖 `tpx` 变量即可（在这种情况下，推荐使用 PostCSS 插件将所有 `px` 转为 `--tpx`）。

例如，pc 端和 m 端在同一个项目时，开发者往往会选择 pc 端使用 `px` 单位，移动端使用手写 `rem` 单位（RootFontSize 为 100px，此时无法使用 `px2rem/px2vw` 等插件，会影响到 pc 端，除非手动类名隔离 or 构建配置隔离），要时刻谨记单位差异。

在通过 postcss 插件将所有 `px` 单位都转为 `--tpx` 后，开发时统一使用 `px`，经过编译转为 `--tpx`，开发时无需关心平台差异，只需要在不同平台上动态修改 `--tpx` 值即可，与上文 TailwindCSS 适配方案是一致的。

详情可见 `apps/example-universal-unit`

例如，在使用 html2canvas 进行屏幕截图时，可以单独渲染截图区域，并将其中的基本单位设置为 `2px`，即 `style="--tpx:2px"`，可以直接达到渲染两倍图的效果，同时避免使用 rem 导致的一些问题。在这种情况下，推荐使用 PostCSS 插件将所有的 px 也转为 `--tpx`，以确保脱离 TailwindCSS 上下文的样式也能响应该环境变量。

## 总结

通过在 TailwindCSS 构建环节中引入 CSS 变量，我们可以轻松实现以下目标：

1. 同时适配 PC 端和移动端。
2. 为不同的区域应用不同的适配规则。
