function findCalcEdges(v) {
  const str = v.toLowerCase();
  const { length } = str;
  const edges = [];
  const stack = [];
  let i = 0;
  while (i < length) {
    if (
      str[i] === 'c' &&
      str[i + 1] === 'a' &&
      str[i + 2] === 'l' &&
      str[i + 3] === 'c' &&
      str[i + 4] === '('
    ) {
      i += 5;
      stack.push({
        i,
        isCalc: true,
      });
    } else if (str[i] === '(') {
      stack.push({ i, isCalc: false });
      i++;
    } else if (str[i] === ')') {
      const start = stack.pop();
      if (start.isCalc) {
        edges.push([start.i, i]);
      }
      i++;
    } else {
      i++;
    }
  }

  return edges;
}

module.exports = (opts = {}) => {
  const { source, target } = opts;

  const [, targetVar] = /var\((--[a-z-_]+)/i.exec(target) || [];

  return {
    postcssPlugin: 'postcss-plugin-replace',

    Once(root, { list }) {
      root.walkDecls((decl) => {
        if (decl.value.indexOf(source) < 0) return;

        if (targetVar && decl.prop === targetVar) return;

        const replaced = list
          .comma(decl.value)
          .map((value) => {
            return list
              .space(value)
              .map((v) => {
                if (/^url\(/i.test(v)) return v;

                const calcEdges = findCalcEdges(v);

                return v.replace(
                  new RegExp(
                    `([\\+\\-]?\\d*\\.?\\d+(?:[Ee][\\+\\-]?\\d+)?)${source}`,
                    'g'
                  ),
                  (pos, p1) =>
                    `${
                      calcEdges.some(([s, e]) => pos >= s && pos < e)
                        ? ''
                        : 'calc'
                    }(${p1} * ${target})`
                );
              })
              .join(' ');
          })
          .join(', ');

        decl.value = replaced;
      });
    },
  };
};

module.exports.postcss = true;
