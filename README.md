# Deno napi wrapped finalizer issue

Minimal reproduction of the issue where deno's finalizer handles large numbers
of wrapped objects in quadratic time, compared to node handling it in linear
time.

## Result

on M3 Max MBP 128gb

```sh
# node v24.21.0
node --expose-gc minimal.ts;
Average over 10 runs
n=10000 3.2 ms
n=20000 3.6 ms
n=40000 5.8 ms
n=80000 12.2 ms
Total time 247.2 ms

# deno 2.9.7 (stable, release, aarch64-apple-darwin)
deno run --allow-ffi --allow-read --v8-flags=--expose-gc minimal.ts;
Average over 10 runs
n=10000 60.8 ms
n=20000 239.9 ms
n=40000 923.1 ms
n=80000 3870.0 ms
Total time 50937.2 ms

# After change to BTreeMap
../deno/target/release/deno run --allow-ffi --allow-read --v8-flags=--expose-gc minimal.ts;
Average over 10 runs
n=10000 4.3 ms
n=20000 5.2 ms
n=40000 8.0 ms
n=80000 13.2 ms
Total time 307.8 ms
```

I found this performance issue when refactoring a project which uses
`@duckdb/node-api` from nodejs 24 to deno 2.9.7.
