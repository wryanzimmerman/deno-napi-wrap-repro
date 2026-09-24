NODE_INC := $(shell node -p 'require("path").resolve(process.execPath, "../../include/node")')

.PHONY: all bench clean
all:bench

minimal.node: minimal.c
	clang -O2 -bundle -undefined dynamic_lookup -o minimal.node minimal.c -I$(NODE_INC);

bench: minimal.node
	node --expose-gc minimal.ts;
	deno run --allow-ffi --allow-read --v8-flags=--expose-gc minimal.ts;

clean:
	rm minmal.node
