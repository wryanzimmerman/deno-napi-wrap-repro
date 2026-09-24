# Deno napi wrapped finalizer issue

Minimal reproduction of the issue where deno's finalizer handles large numbers
of wrapped objects in quadratic time, compared to node handling it in linear
time.

## Result

on M3 Max MBP 128gb

```sh
node --expose-gc minimal.ts;
Average over 10 runs
n=10000 2.1 ms
n=20000 3.1 ms
n=40000 4.8 ms
n=80000 9.8 ms
Total time 198.6 ms
deno run --allow-ffi --allow-read --v8-flags=--expose-gc minimal.ts;
Average over 10 runs
n=10000 62.2 ms
n=20000 257.0 ms
n=40000 1047.7 ms
n=80000 4019.4 ms
Total time 53862.7 ms

```

I found this performance issue when refactoring a project which uses
`@duckdb/node-api` from nodejs 24 to deno 2.9.7.
