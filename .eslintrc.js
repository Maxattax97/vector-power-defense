module.exports = {
    "env": {
        "node": true,
        "es6": true,
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            4,
            {
                "SwitchCase": 1
            }
        ],
        "linebreak-style": [
            "error",
            "unix",
        ],
        "quotes": [
            "error",
            "double",
        ],
        "semi": [
            "error",
            "always",
        ],
        "comma-dangle": [
            "error",
            "always-multiline",
        ],
        "no-console": "off",
        "keyword-spacing": [
            "error",
            {
                "before": true,
                "after": true,
            },
        ],
        "eqeqeq": [
            "error",
            "smart",
        ],
    },
};
