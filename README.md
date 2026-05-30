Despliegu de la aplicación a internet con el proyecto de part2 del repositorio FullStackOpen

nom init -y
npm install express
npm install cors
npm install dotenv
se copia el archivo dist del frontend y se agrega lo siguiente en medio de las declaraciones de middlewares

npm install eslint --save-dev
npm install --save-dev @stylistic/eslint-plugin
npm install --save-dev @eslint/js
npx eslint --init
npm i -D @eslint/js

@eslint/create-config: v2.0.0
√ What do you want to lint? · javascript
√ How would you like to use ESLint? · syntax
√ What type of modules does your project use? · esm
√ Which framework does your project use? · none
√ Does your project use TypeScript? · No / Yes
√ Where does your code run? · browser
i The config that you've selected requires the following dependencies:

eslint, globals
√ Would you like to install them now? · No / Yes
√ Which package manager do you want to use? · npm

La configuración se guardará en el archivo eslint.config.mjs. Cambiaremos browser a node en la configuración de files

import js from '@eslint/js'
import globals from 'globals'
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: globals.browser
    },
    plugins: {
      js,
      stylistic
    },
    extends: ['js/recommended'],
    
     rules: {
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 0
    }
  },

  globalIgnores(['dist'])
])


Inspeccionar y validar un archivo como index.js se puede hacer con el siguiente comando:

npx eslint index.js
-------------------------------------------------------------


npm install --save-dev cross-env 
se ejecuta este código cuando se coloca NODE_ENV en el package.json
"start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development nodemon index.js",
    // ...
    "test": "cross-env  NODE_ENV=test node --test"

    NODE

npm install --save-dev supertest

npm test -- --test-only
npm test -- tests/note_api.test.js

npm install bcrypt
npm install jsonwebtoken

npm install express-async-errors
require('express-async-errors')
La 'magia' de esta librería nos permite eliminar por completo los bloques try-catch. Por ejemplo, la ruta para eliminar una nota