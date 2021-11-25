if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register(
      "https://cdn.jsdelivr.net/gh/mdubourg001/wasm-esbuild-experiment@a512b02/sw.js"
    );
  });
}
