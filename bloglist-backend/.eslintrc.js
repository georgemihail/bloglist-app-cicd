module.exports = {
    'env': {
        'node': true,
        'commonjs': true,
        'es2021': true,
        'jest': true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 12
    },
    'rules': {
        'indent': 0,
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': 0,
        'semi': 0,
        'no-undef': 0,
    }
}
