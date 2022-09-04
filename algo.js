// hour in ms = 3600000

import studentJson from "./data.json" assert { type: "json" };

const sampleTeacher = {
  monday: {
    start: 1,
    end: 6,
  },
  tuesday: {
    start: 1,
    end: 6,
  },
  wednesday: {
    start: 1,
    end: 3,
  },
};

const testTeacher = {
  monday: {
    start: 1,
    end: 2,
  },
};

const test = [
  {
    name: "Mills",
    id: "62c69a417aa7cd6bfd220c81",
    constraints: [],
    lastLesson: {
      day: 0,
      slot: 5,
    },
  },
];
const newCreateTimetable = (teacher, students) => {
  const arr = [];
  const studentList = students.map((item) => item.name);
  for (let day in teacher) {
    const dayArr = [];
    for (let i = 1; i < 7; i++) {
      const random = Math.floor(Math.random() * studentList.length);
      if (i >= teacher[day].start && i <= teacher[day].end) {
        dayArr.push(studentList[random]);
        studentList.splice(random, 1);
      } else {
        dayArr.push("not teaching");
      }
    }
    arr.push(dayArr);
  }
  return arr;
};

const createPop = (size, teacher, students) => {
  const pop = [];
  for (let j = 0; j < size; j++) {
    pop.push(newCreateTimetable(teacher, students));
  }
  return pop;
};

const newFitness = (timetable, students) => {
  let score = 0;
  // const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
  const namesList = students.map((item) => item.name);

  timetable.forEach((day, dayIdx) => {
    day.forEach((slot, slotIdx) => {
      let nameIdx = namesList.indexOf(slot);
      if (slot === "not teaching") {
        return;
      }

      if (students[nameIdx].constraints.length) {
        students[nameIdx].constraints.forEach((constraint) => {
          let cnsChecked = 0;
          if (constraint.day !== dayIdx && constraint.slot !== slotIdx + 1) {
            cnsChecked += 1;
          }
          if (cnsChecked == students[nameIdx].constraints.length) {
            score += 1;
          }
        });
      }

      if (!students[nameIdx].constraints.length) {
        score += 1;
      }

      if (
        students[nameIdx].lastLesson.day !== dayIdx &&
        students[nameIdx].lastLesson.slot !== slotIdx + 1
      ) {
        score += 1;
      }
    });
  });
  return score;
};

// const fakeTt = newCreateTimetable(sampleTeacher, studentJson);
// newFitness(fakeTt, studentJson);

const scorePop = (pop, students) => {
  const scores = pop.map((timetable) => newFitness(timetable, students));
  return scores;
};

const createPool = (pop, scores) => {
  const pool = [];
  for (let i = 0; i < pop.length; i++) {
    for (let j = 0; j < scores[i]; j++) {
      pool.push(pop[i]);
    }
  }
  return pool.map((timetable) => timetable.join(",").split(","));
};

const crossover = (pool, size) => {
  const crossed = Array(size)
    .fill()
    .map((element) => {
      let random1 = pool[Math.floor(Math.random() * pool.length)];
      let random2 = pool[Math.floor(Math.random() * pool.length)];
      let child = [];
      for (let i = 0; i < random1.length; i++) {
        let parentRandom = Math.floor(Math.random());
        parentRandom < 0.5 ? child.push(random1[i]) : child.push(random2[i]);
      }
      return child;
    });
  return crossed;
};

const chunkArr = (size, input) => {
  const result = input.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / size);
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }
    resultArray[chunkIndex].push(item);
    return resultArray;
  }, []);
  return result;
};

const mutation = (pop, rate, teacher, students) => {
  const mutated = pop.map((item) => {
    const randomTimetable = newCreateTimetable(teacher, students)
      .join(",")
      .split(",");
    const mutatedItem = item.map((slot, idx) => {
      let random = Math.random();
      if (random < rate) {
        return randomTimetable[idx];
      } else {
        return slot;
      }
    });
    return mutatedItem;
  });
  return mutated.map((item) => chunkArr(6, item));
};

const swapMutation = (pop, rate) => {
  const mutated = pop.map((item) => {
    let willMutate = Math.random();
    if (willMutate < rate) {
      let randomIdx1 = Math.floor(Math.random() * item.length);
      let randomIdx2 = Math.floor(Math.random() * item.length);
      while (
        item[randomIdx1] === "not teaching" ||
        item[randomIdx2] === "not teaching"
      ) {
        if (item[randomIdx1] === "not teaching") {
          randomIdx1 = Math.floor(Math.random() * item.length);
        }
        if (item[randomIdx2] === "not teaching") {
          randomIdx2 = Math.floor(Math.random() * item.length);
        }
      }
      [item[randomIdx1], item[randomIdx2]] = [
        item[randomIdx2],
        item[randomIdx1],
      ];
    }
    return item;
  });
  return mutated.map((item) => chunkArr(6, item));
};

const evolve = (pop, gens, genSize, teacher, students) => {
  if (gens < 1) {
    const finalScores = scorePop(pop, students);
    const max = Math.max(...finalScores);
    const index = finalScores.indexOf(max);
    console.log(finalScores);
    console.log("max score:");
    console.log(max);
    return pop[index];
  } else {
    const pool = createPool(pop, scorePop(pop, students));
    const crossed = crossover(pool, genSize);
    const mutatedPop = swapMutation(crossed, 0.05, teacher, students);
    return evolve(mutatedPop, gens - 1, genSize, teacher, students);
  }
};

const pop = createPop(100, sampleTeacher, studentJson);
const evolvedPop = evolve(pop, 200, 100, sampleTeacher, studentJson);
console.log(evolvedPop);
