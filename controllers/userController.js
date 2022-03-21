const models = require("../models/index");
const bcrypt = require('bcrypt');
const passport = require('passport');

const { body, validationResult } = require('express-validator');
const Response = require("../services/Response");
const user = require("../models/user");
module.exports = {
    //GET '/getUser'
    async getUsers(req, res, next) {

        const users = await models.User.findAll({
            attributes: {
                exclude: ['password']
            }
        });
        Response.json(400, res, "success", users);
    },

    //POST '/newUser'
    async newUser(req, res, next) {

        const { name, email, password } = req.body;
        // const name = req.body.name;
        // const email = req.body.email;
        // const password = req.body.password;


        try {
            const pwd = await bcrypt.hash(password, 10);


            const emailExists = await models.User.findOne({ where: { email: email } });
            if (emailExists) {
                Response.json(401, res, "Email already registered", email);

            }
            if (emailExists) {
                Response.json(401, res, "Email already registered", email);

            }

            let user = await models.User.create({
                name: name,
                email: email,
                password: pwd
            });

            const userData = user.toJSON();
            delete userData.password;

            Response.json(200, res, "user successfully created", userData);
        } catch (error) {
            console.log(error);
            Response.serverError(res, error, "something went wrong");
        }

    },

    //POST '/newUser'
    async updateUser(req, res, next) {
        res.json({ message: "POST new tea" });
    },

    //DELETE 'user/deleteAllUser'
    async deleteAllUser(req, res, next) {
        res.json({ message: "DELETE all tea" });
    },

    //GET '/user/:id'
    async getUserById(req, res, next) {
        res.json({ message: "GET 1 tea" });
    },

    //DELETE '/user/:id'
    async deleteUserById(req, res, next) {
        res.json({ message: "DELETE 1 tea" });
    },

    async loginHtml(req, res, next) {

        return res.render("login.ejs", {
            errors: req.flash("errors")
        });

    },
    async loginUser(req, res, next) {
        const { email, password } = req.body;

        //validate required fields
        let errorsArr = [];
        let validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {

            req.flash("errors", 'Invalid Credential');
            return res.redirect("/users/login");
        } else {

            passport.authenticate('local', {
                successRedirect: '/dashboard',
                failureRedirect: '/users/login',
                failureFlash: true
            })(req, res, next);
        }


    }

};