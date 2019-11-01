module.exports = (api, options) => {
  // extend package
  api.extendPackage({
    dependencies: {
      'thisvui': '^0.1.0-beta.2'
    }
  })

  // import packages thisvui to main.js
  api.injectImports(api.entryFile, `import ThisVui from 'thisvui'`)

  if (options.addStyle === 'css') {
    api.injectImports(api.entryFile, `import 'thisvui/dist/thisvui.min.css'`)
  } else if (options.addStyle === 'scss') {
    // sass loader
    api.extendPackage({
      devDependencies: {
        'node-sass': '^4.9.0',
        'sass': '^1.19.0',
        'sass-loader': '^8.0.0'
      }
    })

    api.render('./templates/style')
    api.injectImports(api.entryFile, `import 'thisvui/dist/sass/thisvui.scss'`)
  }

  api.onCreateComplete(() => {
    const fs = require('fs')

    // get content
    let contentMain = fs.readFileSync(api.entryFile, { encoding: 'utf-8' })
    const lines = contentMain.split(/\r?\n/g).reverse()

    // use ThisVui after last import
    const lastImportIndex = lines.findIndex((line) => line.match(/^import/))
    lines[lastImportIndex] += '\n\nVue.use(ThisVui)'

    // modify app
    contentMain = lines.reverse().join('\n')
    fs.writeFileSync(api.entryFile, contentMain, { encoding: 'utf-8' })
  })
}
