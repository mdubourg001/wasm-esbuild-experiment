rm -f ./public/main.wasm
# cross-compile go module to .wasm module
GOOS=js GOARCH=wasm go build -o ./public/main.wasm
# copy wasm_exec.js to public/ dir
cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" ./public