const testMatrix = [
  [29, 23, 27, 24, 32, 33, 28, 31, 25, 24, 29, 27],
  [28, 27, 26, 30, 24, 33, 23, 27, 20, 32, 32, 20],
  [27, 23, 29, 23, 20, 29, 32, 30, 20, 29, 23, 35],
  [32, 25, 30, 30, 23, 31, 31, 29, 20, 20, 29, 30],
  [26, 31, 20, 27, 23, 28, 24, 29, 29, 33, 28, 29],
  [30, 31, 29, 27, 32, 28, 30, 33, 33, 33, 31, 29],
  [27, 24, 29, 29, 24, 25, 23, 26, 30, 31, 26, 22],
  [23, 24, 25, 25, 24, 30, 27, 30, 25, 23, 27, 31],
  [30, 26, 30, 31, 25, 27, 31, 27, 24, 33, 30, 25],
  [31, 33, 24, 33, 29, 20, 25, 24, 30, 25, 30, 30],
  [29, 26, 20, 32, 25, 31, 24, 29, 27, 31, 32, 29],
  [21, 24, 30, 23, 29, 27, 31, 33, 23, 23, 32, 26],
];

const testMatrix2 = [
  [1, 1, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 0, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 1, 0, 0],
];

//subtracts min value from rows then subtracts min value from columns
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

//iterates over the matrix, first assigning single zeros in rows (cancelling other zeros in that column)
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

//checks the matrix and returns lines - intending to implement a 'it's done' stage here too I think
// if every row or column constains an assignment then it's done
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

// creates new zeros by subbing the minimum number from all 'uncovered numbers' and adding it to all 'intersection' numbers
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
        if (c == "0x") {
          return 0 + min;
        }
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

const assignCount = (m) => {
  return m
    .map((row) => {
      return row.filter((item) => {
        return item === "0*";
      });
    })
    .filter((row) => row.length > 0).length;
};

const zeroCount = (m) => {
  return m
    .map((row) => {
      return row.filter((item) => {
        return item === 0;
      });
    })
    .filter((row) => row.length > 0).length;
};

const reset = (m) => {
  return m.map((r) => r.map((i) => (i == "0*" || i == "0x" ? 0 : i)));
};

const normalize = (m) => {
  return m.map((r, i) => {
    return m.map((r) => r[i]);
  });
};

// assign the matrix - calls aL a few different times. It is recursive till there are no more zeros that can be assigned - either through them being all gone or through there being only unassignable zeros remaining
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
  const assignments = assignCount(normalize(aC));

  if (tZ == 0 && assignments === m.length) {
    // the base case
    console.log("base");
    return normalize(aC);
  } else if (tZ == 0 && assignments !== m.length) {
    const normalized = normalize(aC);
    const subbed = createZ(normalized, check(normalized));
    a(subbed);
  }

  // if (tZ == 0 || mZR.indexOf(true) !== -1) {
  //   return normalize(aC);
  // } else {
  //   // this case is for zeros that should be assigned in this round
  //   // but just haven't been because of the order of assignments
  //   const normalized = normalize(aC);
  //   a(normalized);
  // }
};

const newAssign = (matrix) => {
  const assignRows = aL(matrix);
  const cols = assignRows.map((r, i) => {
    return assignRows.map((r) => r[i]);
  });
  const assignCols = aL(cols);
  const curr = normalize(assignCols);
  const totalAssign = assignCount(curr);
  const totalZero = zeroCount(curr);
  const size = matrix.length;

  if (totalAssign == size) {
    console.table(curr);
    // return curr;
  } else if (totalAssign != size && totalZero > 0) {
    newAssign(curr);
  } else {
    const nextMatrix = createZ(curr, check(curr));
    newAssign(nextMatrix);
  }
};

const ass = newAssign(s(testMatrix));
console.table(ass);
