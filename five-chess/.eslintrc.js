module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  },
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: 'airbnb-base',
  // required to lint *.js files
  plugins: ['html'],
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack.config.js'
      }
    }
  },
  // add your custom rules here
  rules: {
    'no-undefined': 'warn',
    'no-unused-vars': [
      'warn',
      { vars: 'local', args: 'after-used', ignoreRestSiblings: true }
    ],
    "spaced-comment": ["warn", "always", {
        "line": {
            "markers": ["/"],
            "exceptions": ["-", "+"]
        },
        "block": {
            "markers": ["!"],
            "exceptions": ["*"],
            "balanced": true
        }
    }],
    'import/prefer-default-export': 'off',
    'comma-dangle': [1, 'never'],
    'no-undef': 'off',
    'no-restricted-syntax': ['error', 'WithStatement'],
    'no-unused-expressions': ['warn'],
    'class-methods-use-this': ['off'],
    'global-require': 'warn',
    'no-script-url': 'warn',
    'no-nested-ternary': 'off',
    'arrow-body-style': ['warn'],
    'max-len': 'warn',
    'import/no-webpack-loader-syntax': 'warn',
    'no-underscore-dangle': 'off',
    'prefer-arrow-callback': ['error', { allowUnboundThis: true }],
    'no-mixed-operators': ['warn'],
    "linebreak-style": 0
  }
};
