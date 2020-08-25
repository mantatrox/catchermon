import { Property, StateReturn } from "../../model/interface";

const refresh = (
  state: string,
  prop: Property,
  solutions: StateReturn[],
  setHandler: (solutions: StateReturn[]) => void
) => {
  const read = solutions.find((s) => s.propName === prop.name);
  if (read) {
    if (state === "") read.values = [];
    else read.values = [state];
    solutions[solutions.indexOf(read)] = read;
  } else {
    solutions.push({ propName: prop.name, values: [] });
  }

  setHandler(solutions);
};

export { refresh };
