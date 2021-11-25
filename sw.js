importScripts("wasm_exec.js");

const WASM_MODULE_FILEPATH = "/main.wasm";
const EXTENSION_REGEXP = /.*\.(.+)$/;

// getting wasm module from cache or fallback to network
// also update cache if network used
function getWasmResponse() {
  const wasmRequest = new Request(WASM_MODULE_FILEPATH);

  return caches.open("wasm-esbuild").then(function (cache) {
    return cache.match(wasmRequest).then(function (match) {
      return (
        match ??
        fetch(wasmRequest).then((response) => {
          cache.put(wasmRequest, response);

          return response;
        })
      );
    });
  });
}

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open("wasm-esbuild").then(function (cache) {
      cache.add(WASM_MODULE_FILEPATH);
    })
  );
});

self.addEventListener("fetch", async function (event) {
  if (event.request.url.endsWith(".ts")) {
    const wasmResponse = getWasmResponse();
    const go = new Go();

    return event.respondWith(
      WebAssembly.instantiateStreaming(wasmResponse, go.importObject).then(
        (result) => {
          go.run(result.instance);

          return fetch(event.request)
            .then((response) => response.text())
            .then((source) => {
              const result = transform(source, { loader: "tsx" });

              return new Response(result, {
                status: 200,
                headers: {
                  "Content-Type": "application/javascript; charset=UTF-8",
                },
              });
            });
        }
      )
    );
  }

  return event.respondWith(fetch(event.request));
});
