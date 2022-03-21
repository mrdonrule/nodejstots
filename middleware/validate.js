const { check } = require("express-validator");

let validateRegister = [
    check("name", "Please enter your  name").exists().isLength({ min: 4 }),
    check("email", "Please enter an Email Address").isEmail().trim(),

    check("password", "Invalid password. Password must be at least 2 chars long")
    .isLength({ min: 6 })

    // check("passwordConfirmation", "Password confirmation does not match password")
    // .custom((value, { req }) => {
    //     return value === req.body.password
    // })
];
let validatenewNFT = [
    check("name", "Please enter your  name").exists().isLength({ min: 4 }),
    check("description", "Enter description").exists().isLength({ min: 4 }),

    check("price", "Please enter number")
    .optional({ checkFalsy: true })
    .isNumeric()

    // check("passwordConfirmation", "Password confirmation does not match password")
    // .custom((value, { req }) => {
    //     return value === req.body.password
    // })
];
let validateLogin = [
    check("email", "Invalid email").isEmail().trim(),

    check("password", "Invalid password")
    .not().isEmpty()
];

module.exports = {
    validateRegister: validateRegister,
    validateLogin: validateLogin,
    validatenewNFT: validatenewNFT
};