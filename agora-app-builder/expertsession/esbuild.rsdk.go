package main

import (
	"flag"
	"log"
	"os"
	"path/filepath"

	"github.com/davecgh/go-spew/spew"
	"github.com/evanw/esbuild/pkg/api"
)

type ioPaths struct {
	outPath               string
	configTransformerPath string
}

func commonAliasResolver() api.Plugin {
	aliasResolvers := api.Plugin{
		Name: "importAliases",
		Setup: func(pb api.PluginBuild) {
			pb.OnResolve(api.OnResolveOptions{Filter: "react-native$"},
				func(args api.OnResolveArgs) (api.OnResolveResult, error) {
					path, err := filepath.Abs("./node_modules/react-native-web/dist/cjs/index.js")
					if err != nil {
						log.Fatalln(err)
					}
					return api.OnResolveResult{Path: path}, nil
				},
			)

			// Using rtm bridge to translate React Native RTM SDK calls to web SDK calls
			pb.OnResolve(api.OnResolveOptions{Filter: "agora-react-native-rtm$"},
				func(args api.OnResolveArgs) (api.OnResolveResult, error) {
					path, err := filepath.Abs("./bridge/rtm/web/index.ts")
					if err != nil {
						log.Fatalln(err)
					}
					return api.OnResolveResult{Path: path}, nil
				},
			)

			// Using rtc bridge to translate React Native RTC SDK calls to web SDK calls for web and linux
			// Using rtc bridge to translate React Native RTC SDK calls to electron SDK calls for windows and mac
			pb.OnResolve(api.OnResolveOptions{Filter: "react-native-agora$"},
				func(args api.OnResolveArgs) (api.OnResolveResult, error) {
					path, err := filepath.Abs("./bridge/rtc/webNg/index.ts")
					if err != nil {
						log.Fatalln(err)
					}
					return api.OnResolveResult{Path: path}, nil
				},
			)

			pb.OnResolve(api.OnResolveOptions{Filter: "customization-api"},
				func(args api.OnResolveArgs) (api.OnResolveResult, error) {
					path, err := filepath.Abs("./customization-api/index.ts")
					if err != nil {
						log.Fatalln(err)
					}
					return api.OnResolveResult{Path: path}, nil
				},
			)

			pb.OnResolve(api.OnResolveOptions{Filter: "customization-implementation"},
				func(args api.OnResolveArgs) (api.OnResolveResult, error) {
					path, err := filepath.Abs("./customization-implementation/index.ts")
					if err != nil {
						log.Fatalln(err)
					}
					return api.OnResolveResult{Path: path}, nil
				},
			)

			pb.OnResolve(api.OnResolveOptions{Filter: "customization"},
				func(args api.OnResolveArgs) (api.OnResolveResult, error) {
					fpePath, err := filepath.Abs("./customization/index.ts")
					if err != nil {
						log.Fatalln(err)
					}
					fpeDummyPath, err := filepath.Abs("./customization-implementation/dummyConfig.ts")
					if err != nil {
						log.Fatalln(err)
					}

					_, err = os.Stat(fpePath)
					if err != nil {
						return api.OnResolveResult{Path: fpeDummyPath}, nil
					}

					return api.OnResolveResult{Path: fpePath}, nil
				},
			)

			pb.OnResolve(api.OnResolveOptions{Filter: "agora-react-native-rtm/lib/typescript/src"},
				func(args api.OnResolveArgs) (api.OnResolveResult, error) {
					path, err := filepath.Abs("./bridge/rtm/web/index.ts")
					if err != nil {
						log.Fatalln(err)
					}
					return api.OnResolveResult{Path: path}, nil
				},
			)
		},
	}

	return aliasResolvers
}

func commonResolveExtensions() []string {
	// Adds platform specific extensions and OS specific extensions
	// .web.tsx works for web specific code
	resolveExtensions := []string{
		".rsdk.tsx",
		".rsdk.ts",
		".sdk.ts",
		".sdk.tsx",
		".web.ts",
		".web.tsx",
		".tsx",
		".ts",
		".jsx",
		".js",
		".node",
	}

	return resolveExtensions
}

func commonLoader() map[string]api.Loader {
	loader := map[string]api.Loader{
		// since esbuild targets latest js by default we dont need plugins that
		// convert optional chaining and class properties (node 16.11.0+ has both features)

		// use sx loaders for js|ts files as well
		".js":  api.LoaderTSX,
		".jsx": api.LoaderTSX,
		".ts":  api.LoaderTSX,
		".tsx": api.LoaderTSX,

		// todo: might need to deal with non-lowercase extensions for these media files
		".png":  api.LoaderDataURL,
		".jpg":  api.LoaderDataURL,
		".jpeg": api.LoaderDataURL,
		".gif":  api.LoaderDataURL,
	}

	return loader
}

func common(iopath *ioPaths) api.BuildOptions {
	commonBuildOpts := api.BuildOptions{
		// we can safely ignore (webpack) plugins for now because they seem to be used only for not reactsdk

		Plugins:           []api.Plugin{commonAliasResolver()},
		ResolveExtensions: commonResolveExtensions(),
		Loader:            commonLoader(),

		// embed config variables values into the code
		Define: map[string]string{
			"$config": "config",
		},
		Inject: []string{iopath.configTransformerPath},
	}

	return commonBuildOpts
}

func rsdk(iopath *ioPaths) api.BuildResult {
	commonBuildOpts := common(iopath)
	rsdkBuildOpts := api.BuildOptions{
		// build options common to rsdk and other components
		Plugins:           commonBuildOpts.Plugins,
		ResolveExtensions: commonBuildOpts.ResolveExtensions,
		Loader:            commonBuildOpts.Loader,

		// rsdk specific build options
		EntryPoints: []string{"./index.rsdk.tsx"},
		External: []string{
			"react",
			"react-dom",
			"react-router",
			"react-router-dom",
			"@apollo/client",
		},
		Define: commonBuildOpts.Define,
		Inject: commonBuildOpts.Inject,

		// target es6 because other host applications typically do not transpile node_modules
		// i.e. they will not transpile agora-app-builder-sdk
		Target: api.Target(api.ES2015),

		// bundle in cjs format because this index.js is meant to be used by other host applications
		// like webpack which runs on node
		Format:  api.FormatCommonJS,
		Outfile: iopath.outPath,

		// other esbuild options
		Write:             true,
		Bundle:            true,
		MinifyWhitespace:  true,
		MinifyIdentifiers: true,
		MinifySyntax:      true,
    Sourcemap:         api.SourceMapExternal,

		// debug options. does not affect bundle size
		// Metafile: true,
	}

	rsdk := api.Build(rsdkBuildOpts)
	return rsdk
}

func main() {
	outPath := flag.String("outpath", "../Builds/react-sdk/index.js", "path to write bundled js file")
	configTransformerPath := flag.String("configtransformerpath", "./esbuildConfigTransform.js", "path to inject file")
	flag.Parse()
	iopath := &ioPaths{
		outPath:               *outPath,
		configTransformerPath: *configTransformerPath,
	}
	log.Println("esbuild args = ", iopath)
	rsdkRes := rsdk(iopath)
	if len(rsdkRes.Errors) > 0 {
		spew.Dump(rsdkRes)
		log.Fatalln("build failed")
	}

	// text := api.AnalyzeMetafile(rsdkRes.Metafile, api.AnalyzeMetafileOptions{Verbose: false})
	// log.Printf("%s", text)
}
