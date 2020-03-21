# learning-platform-ui
front-end

## Requirements
* nodejs
* vue-cli

## First installation
```
$: npm install -g @vue/cli
$: git clone {url}
$: cd learning-platform-ui
$: cd ui
```

## Before run
```
$: cp src/localSettings.js.template src/localSettings.js

Set your data in src/localSettings.js
```

## Run app
```
$: npm run serve
```

## Compiles and minifies for production
```
NODE_ENV=production npm run build
```

## Run your tests
```
npm run test
```

## Lints and fixes files
```
npm run lint
```

## Obfuscator
```
In learning-platform-ui/ui

$: ./node_modules/javascript-obfuscator/bin/javascript-obfuscator ./dist/js/ --output obfuscated --config ../obfuscator.config.js
```
