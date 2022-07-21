const testMatrix = [
  [29, 23, 27, 24, 32, 33, 28, 31, 25, 24],
  [28, 27, 26, 30, 24, 33, 23, 27, 20, 32],
  [27, 23, 29, 23, 20, 29, 32, 30, 20, 29],
  [32, 25, 30, 30, 23, 31, 31, 29, 20, 20],
  [26, 31, 20, 27, 23, 28, 24, 29, 29, 33],
  [30, 31, 29, 27, 32, 28, 30, 33, 33, 33],
  [27, 24, 29, 29, 24, 25, 23, 26, 30, 31],
  [23, 24, 25, 25, 24, 30, 27, 30, 25, 23],
  [30, 26, 30, 31, 25, 27, 31, 27, 24, 33],
  [31, 33, 24, 33, 29, 20, 25, 24, 30, 25],
];

const s = (m) => {
  const rSub = m.map((r) => {
    const min = Math.min(...r);
    return r.map((n) => n - min);
  });
  const cols = rSub.map((r, i) => {
    return rSub.map((r) => r[i]);
  });
  const cSub = cols.map((c) => {
    const min = Math.min(...c);
    return c.map((n) => n - min);
  });
  return cSub.map((r, i) => {
    return cSub.map((r) => r[i]);
  });
};

const aL = (m) => {
  const mC = m.map((r) => r.map((n) => n));
  for (let i = 0; i < mC.length; i++) {
    const nz = mC[i].filter((n) => n == 0).length;
    for (let j = 0; j < mC.length; j++) {
      const curr = mC[i][j];
      if (curr == 0 && nz == 1) {
        mC[i][j] = "0*";
        for (let k = 0; k < mC.length; k++) {
          const curr2 = mC[k][j];
          if (curr2 == 0) {
            mC[k][j] = "0x";
          }
        }
      }
    }
  }
  return mC;
};

const check = (m) => {
  const mr = m
    .map((r, i) => {
      return r.indexOf("0*") == -1 ? i : -1;
    })
    .filter((n) => n !== -1);
  const mc = mr
    .map((r) =>
      m[r]
        .map((n, i) => {
          return n == 0 || n == "0x" ? i : -1;
        })
        .filter((n) => n !== -1)
    )
    .flat();
  const cS = [...new Set(mc)];
  const cAR = cS
    .map((c) => m.map((r) => r[c]))
    .filter((r) => r.indexOf("0*") !== -1);
  mr.push(cAR.map((c) => c.indexOf("0*")));
  return [[...mr.flat()], [...cS]];
};

const createZ = (m, l) => {
  const eN = l[0]
    .map((rI) => m[rI].map((i) => i).filter((n) => typeof n === "number"))
    .flat();
  const min = Math.min(...eN);
  const o = m.map((r, ix) => {
    return r.map((c, cix) => {
      if (l[0].indexOf(ix) == -1 && l[1].indexOf(cix) == -1) {
        return c;
      } else if (l[0].indexOf(ix) !== -1 && l[1].indexOf(cix) == -1) {
        return c - min;
      } else if (l[0].indexOf(ix) == -1 && l[1].indexOf(cix) !== -1) {
        return c + min;
      } else {
        return c;
      }
    });
  });
  return o.map((r) =>
    r.map((c) => {
      if (typeof c == "number") {
        return c;
      } else {
        return parseInt(c.slice(0, -1));
      }
    })
  );
};

const a = (m) => {
  const aR = aL(m);
  const cols = aR.map((r, i) => {
    return aR.map((r) => r[i]);
  });
  const aC = aL(cols);
  const tZ = aC
    .map((r) => r.filter((i) => i == 0).length)
    .flat()
    .reduce((a, b) => a + b);
  const mZR = aC.map((r) => r.filter((n) => n == 0).length < 1);

  if (tZ == 0 || mZR.indexOf(true) !== -1) {
    return aC.map((r, i) => {
      return aC.map((r) => r[i]);
    });
  } else {
    const nM = aC.map((r, i) => {
      return aC.map((r) => r[i]);
    });
    a(nM);
  }
};

const ass = a(s(testMatrix));
console.table(ass);
