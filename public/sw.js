importScripts("wasm_exec.js");

self.addEventListener("fetch", async function (event) {
  if (event.request.url.endsWith(".ts")) {
    const go = new Go();

    return event.respondWith(
      WebAssembly.instantiateStreaming(
        fetch("main.wasm"),
        go.importObject
      ).then((result) => {
        go.run(result.instance);

        return fetch(event.request)
          .then((response) => response.text())
          .then((source) => {
            const result = transform(source);

            return new Response(result, {
              status: 200,
              headers: {
                "Content-Type": "application/javascript; charset=UTF-8",
              },
            });
          });
      })
    );
  }

  return event.respondWith(fetch(event.request));
});
