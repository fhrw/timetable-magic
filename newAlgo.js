const students = [
  // { name: "felix", constraints: ["monday 1"], hist: [2, 0, 1] },
  // { name: "felix", constraints: ["monday 1"], hist: [2, 0, 1] },
  { name: "jamie", constraints: ["monday 1", "monday 2"], hist: [1, 2, 0] },
  { name: "sarah", constraints: ["monday 3"], hist: [0, 1, 2] },
  { name: "jamie", constraints: ["monday 1"], hist: [0, 2, 1] },
];

const slots = ["monday 1", "monday 2", "monday 3"];

const edges = [];

//pre-process step: build weighted graph
for (let i = 0; i < students.length; i++) {
  const currStud = students[i];
  const history = students[i].hist;

  //figure out weight for each slot
  for (let j = 0; j < slots.length; j++) {
    const histIdx = history.indexOf(j) == -1 ? 0 : history.indexOf(j);
    const meetsConst = currStud.constraints.indexOf(slots[j]) != -1 ? 1 : 0;
    const weight = histIdx / slots.length + meetsConst;
    edges.push({ from: i, to: j, weight: weight.toFixed(2) });
  }
}

//validate that graph has a possible solution

//solve graph: implement the hungarian algo
//create matrix
const edgeMatrix = [];
const rows = students.length;
const cols = slots.length;

for (let i = 0; i < rows; i++) {
  edgeMatrix[i] = [];
  for (let j = 0; j < cols; j++) {
    edgeMatrix[i][j] = edges[j + i * rows].weight;
  }
}

// step 1
// find the minumum weight for each row of matrix
// subtract min from every other member of the row
const minRowsIdx = (matrix) => {
  const idxs = matrix.map((row) => {
    const min = Math.min(...row);
    return row.indexOf(min);
  });

  return idxs;
};

const rowSubtract = (matrix) => {
  const subtractedMatrix = matrix.map((row, idx) => {
    const min = Math.min(...row).toFixed(2);
    return row.map((item) => {
      if (item === 0) {
        return item;
      }
      const subbed = item - min;
      return subbed.toFixed(2);
    });
  });
  return subtractedMatrix;
};

// find the minumum weight for each column
// subtract min from every other member of column

const rotateMatrix = (matrix) => {
  const rotatedMatrix = [];
  for (let i = 0; i < matrix.length; i++) {
    rotatedMatrix.push(matrix.map((row) => row[i]));
  }
  return rotatedMatrix;
};

// try and assign zeros. if the number of zeros = n then an assignment is possible. aka there is an assignment for each person and each column
const assign = (matrix) => {
  const newMatrix = matrix.map((row) => {
    return row.map((item) => item);
  });
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    let numZero = newMatrix[i].filter((item) => item === 0).length;
    for (let j = 0; j < n; j++) {
      if (newMatrix[i][j] === 0 && numZero === 1) {
        newMatrix[i][j] = "0*";
        for (let k = 0; k < n; k++) {
          if (newMatrix[k][j] === "0*") {
            continue;
          } else {
            newMatrix[k][j] = "X";
          }
        }
      }
    }
  }
  return newMatrix;
};

const newAssign = (matrix) => {
  const rAs = matrix.map((r, idx) => {
    if (r.filter((n) => n == 0).length == 1) {
      return [idx, r.indexOf(0)];
    }
    return [];
  });
  const unassigned = matrix
    .map((row, rIdx) => {
      return row.filter((n) => n > 0).map((c, cIdx) => [rIdx, cIdx]);
    })
    .flat();
  return rAs;
};

const col = (matrix, n) => {
  return matrix.map((r) => r[n]);
};

// make zero assignments
// BUG: doesn't recur if there are multiple zeros that get cancelled out opening up an available assignment. Need to implement canclling
const impAss = (matrix) => {
  const ass = [];
  const canc = [];

  for (let i = 0; i < matrix.length; i++) {
    const z = matrix[i].filter((n) => n == 0).length;
    if (
      z == 1 &&
      ass.filter((item) => item[1] == matrix[i].indexOf(0)).length == 0
    ) {
      ass.push(i + "" + matrix[i].indexOf(0));
    }
  }
  return ass;
};

//mark all unassigned rows, then mark the column corresponding to the zero in the row. Any marked columns with assignments are marked in the corresponding row if not marked already (aka there is more than one zero in the row and column has been assigned)

const mark = (matrix, a) => {
  const aR = a.map((i) => parseInt(i[0]));
  const aC = a.map((i) => parseInt(i[1]));
  const mR = [];
  for (let i = 0; i < matrix.length; i++) {
    if (a.map((item) => item[0]).filter((item) => item == i).length > 0) {
      continue;
    } else {
      mR.push(i);
    }
  }
  const mC = mR.map((r) => matrix[r].indexOf(0)).filter((n) => n >= 0);
  const cTR = mC.map((c) => aR[aC.indexOf(c)]);
  const combinedR = [[...mR, ...cTR], [...mC]];
  return combinedR;
};

const findUnc = (matrix, marks) => {
  const unc = matrix
    .map((r, rix) =>
      r.filter(
        (i, ix) => marks[1].indexOf(ix) == -1 && marks[0].indexOf(rix) !== -1
      )
    )
    .filter((r) => r.length > 0);
  return unc;
};

const findIntx = (matrix, marks) => {
  const intx = matrix.map((r, rix) =>
    r.filter(
      (num, i) => marks[0].indexOf(rix) == -1 && marks[1].indexOf(i) !== -1
    )
  );
  return intx.flat();
};

const rowSub = rowSubtract(edgeMatrix);
const colSort = rotateMatrix(rowSub);
const colSub = rowSubtract(colSort);
const aReady = rotateMatrix(colSub);
const rowA = impAss(aReady);
const colA = impAss(rotateMatrix(aReady)).map((i) => `${i[1]}${i[0]}`);
const assigns = [...new Set([...rowA, ...colA])];
const marks = mark(aReady, assigns);
const unc = findUnc(aReady, marks);
const intx = findIntx(aReady, marks);
console.log(aReady);
console.log(assigns);
