function pipe(x, ...functions) {
  for (f of functions) x = f(x);
  return x;
}

function call(f) {
  return f();
}

function condApply(pred, f) {
  if (pred) return (x) => f(x);
  else return (x) => x;
}
