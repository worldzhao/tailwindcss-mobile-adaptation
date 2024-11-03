# TailwindCSS Mobile Adaptation Using CSS Variables

English | [简体中文](https://github.com/worldzhao/tailwindcss-mobile-adaptation/blob/main/README.zh-CN.md)

## Example

Please refer to the corresponding `flexible .js` file under `apps/example-*` under this repository

## Preface

After integrating the font, font size, and color specifications provided by designers into the project, we start to enjoy the convenience of writing styles with TailwindCSS. There is no need to frequently switch between HTML and CSS, worry about naming issues, or encounter various strange magic fields. However, some minor issues may arise during use.
This article does not promote TailwindCSS. It only presents solutions to some scenarios encountered in daily use. For the benefits of using TailwindCSS, you can read the article [Why Tailwind CSS](https://bytedance.larkoffice.com/wiki/wikcnhS9YBoRAbkjGcLw0VdCWgd).

## Prerequisite Knowledge

When novice developers start using TailwindCSS, they are usually told a basic rule: In the TailwindCSS system, the basic unit of spacing or width and height is `4px`. For example, `mr-1` is equivalent to `margin-right: 4px`.
When encountering a right margin of `16px` on the design draft, one will subconsciously divide by 4 to get `mr-4`.

![mr-1](https://raw.githubusercontent.com/worldzhao/blog/master/images/0a9a17e0c059baaecc2130d6156203aca1c01a2e2b345f7774840acc99ad99ce.png)

> My project has added the prefix `tw-`, no need to pay attention.

As can be seen from the compilation result, TailwindCSS compiles `mr-1` as `margin-right: 0.25rem`. Without special settings, the RootFontSize of a web application is usually `16px`, thus forming the above mapping rule.

But most people will soon encounter the first problem:

**On the premise of ensuring previous development intuition, how should a mobile project integrate TailwindCSS?**

## Mobile Adaptation

Currently, the adaptation schemes for mobile terminals are mainly `rem` and `vw` as the mainstream, following the principle of equal proportion scaling (adapting to various device screen sizes for differentiated processing is certainly correct, but in actual implementation scenarios, this is often not something that R & D personnel can easily decide).

When creating a new mobile project, the integration is usually very simple:

1. Configure RootFontSize as `16px`.
2. Inject a script similar to `flexible.js` to set RootFontSize in equal proportion as the screen width changes.
3. Configure PostCSS plugins such as `px2rem`, and convert the `px` unit in the code to an appropriate `rem` unit.
4. Integrate TailwindCSS.

In this way, it is similar to a normal PC-side project, but often there are not so many new projects for you to integrate. More scenarios are for an existing mobile project to be integrated. The adaptive schemes used in these projects are also different.

For example, in some projects, the probability of RootFontSize is `100px` (convenient for developers to write rem by hand according to the visual draft), and at the same time, plugins such as `px2rem` are not integrated. In some projects, `vw` layout is directly used. These different situations require a unified scheme for adaptation.

At the same time, there is another problem. If the same application has both PC and mobile versions, how should we distinguish them during construction?

At this time, the construction result of `mr-1` is `margin-right: 0.25rem`. As long as the RootFontSize of the mobile terminal is not `16px`, switching to the mobile terminal will inevitably lead to style chaos.

In fact, the solution is also very simple, that is, move the construction unit to runtime determination and introduce CSS variables.

## Solution

See the following function:

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

![tpx](https://raw.githubusercontent.com/worldzhao/blog/master/images/202406031534410.png)

In this function, we convert `mr-1` to `calc(4 * var(--tpx))`. As long as we always keep `tpx` as 1px in size under standard device sizes, we can continue to follow TailwindCSS's rule of "1 basic unit is 4px".

Here are some specific cases:

1. When using rem layout under standard device sizes and RootFontSize is 16px, `tpx` is `0.0625rem`, that is, `16px * 0.0625` = `1px`.
2. When using rem layout under standard device sizes and RootFontSize is 100px, `tpx` is `0.01rem`, that is, `100px * 0.01` = `1px`. For details, see apps/example-rem.
3. When using vw layout under standard device sizes, assuming the screen width is 375px, `100vw` = `375px`, so `1vw` = `3.75px`, then `1px` is `1vw/3.75`, that is, `tpx` is `(100/375)vw`. For details, see `apps/example-rem`.
4. If the mobile and PC versions are in the same application, then when the page size changes, dynamically modify the value of `--tpx`. For example, set `--tpx` to `1px` on the PC side and set `--tpx` to `0.01rem` or `(1/3.75)vw` on the mobile side. For details, see `apps/example-universal-unit`.

As the screen size changes, RootFontSize or vw will also change, so `tpx` will also be adjusted accordingly (because rem is used), thus realizing equal proportion scaling on the mobile side.

Using CSS variables can also apply different adaptation rules to different areas. Just override the tpx variable on the root element node of the corresponding component (in this case, it is recommended to use a PostCSS plugin to convert all `px` to `--tpx`).

For example, when the pc side and the m side are in the same project, developers often choose to use the px unit on the pc side and use the handwritten rem unit on the mobile side (RootFontSize is `100px`. At this time, plugins such as px2rem/px2vw cannot be used, which will affect the pc side unless manual class name isolation or build configuration isolation). In this way, when developing different platforms, one must always remember the unit differences.

After converting all `px` to `--tpx` through a postcss plugin, use `px` uniformly during development. After compilation, it is converted to `--tpx`. During development, there is no need to care about platform differences. Only need to dynamically modify the `--tpx` value on different platforms, which is consistent with the TailwindCSS adaptation scheme above.

For details, see `apps/example-universal-unit`.

For example, when using html2canvas for screen capture, you can render the screenshot area separately and set the basic unit in it to `2px`, that is, style="--tpx:2px", which can directly achieve the effect of rendering a double-sized image while avoiding some problems caused by using rem. In this case, it is recommended to use a PostCSS plugin to convert all `px` to `--tpx` to ensure that styles outside the TailwindCSS context can also respond to this environment variable.

## Summary

By introducing CSS variables in the TailwindCSS construction process, we can easily achieve the following goals:

1. Adapt to both PC and mobile versions simultaneously.
2. Apply different adaptation rules to different areas.
