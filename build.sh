rm -f ./main.wasm
# cross-compile go module to .wasm module
GOOS=js GOARCH=wasm go build -o ./main.wasm
# copy wasm_exec.js to public/ dir
cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" .