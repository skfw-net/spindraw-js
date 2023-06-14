all: build

build: clean typed
	npx esbuild index.ts --bundle --minify --platform=neutral --target=esnext --sourcemap=external --outdir=out

clean:
	rm -rvf out

types:
	npx tsc --emitDeclarationOnly --declaration

postinstall: build