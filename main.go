package main

import (
	"fmt"
	"syscall/js"

	"github.com/evanw/esbuild/pkg/api"
)

func transform() js.Func {
	jsfunc := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) < 1 {
			return nil
		}

		source := args[0].String()
		result := api.Transform(source, api.TransformOptions{
			Loader: api.LoaderTS,
		})

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
