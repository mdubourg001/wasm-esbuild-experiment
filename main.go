package main

import (
	"fmt"
	"syscall/js"

	"github.com/evanw/esbuild/pkg/api"
)

var loaderMapping = map[string]api.Loader{
	"js":  api.LoaderJS,
	"jsx": api.LoaderJSX,
	"ts":  api.LoaderTS,
	"tsx": api.LoaderTSX,
}

func transform() js.Func {
	jsfunc := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) < 1 {
			return nil
		}

		source := args[0].String()
		rawOptions := args[1]
		var options api.TransformOptions

		rawLoader := rawOptions.Get("loader")

		if rawLoader.Truthy() {
			loader := rawLoader.String()
			options.Loader = loaderMapping[loader]
		}

		result := api.Transform(source, options)

		if len(result.Errors) == 0 {
			return fmt.Sprintf("%s", result.Code)
		}

		return nil
	})

	return jsfunc
}

func main() {
	js.Global().Set("transform", transform())
	<-make(chan bool)
}
