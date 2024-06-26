all: build

build: clean types
	npx esbuild index.ts --bundle --minify --platform=neutral --target=esnext --sourcemap=external --outdir=out

clean:
	rm -rvf out

types:
	npx tsc --emitDeclarationOnly --declaration

pub:
	npm publish --access=public --scoped=skfx
