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
            order: [
                ['id', 'DESC'],

            ],
            attributes: {
                exclude: ['password']
            }
        });
        return res.render("admin/users/index", {
            errors: req.flash("errors"),
            success: req.flash("success"),
            user: req.user,
            users: users
        });
    },

    async dashBoard(req, res, next) {

        const users = await models.User.count();
        const nfts = await models.NftCollection.count();
        return res.render("admin/index", {
            errors: req.flash("errors"),
            success: req.flash("success"),
            user: req.user,
            userCount: users,
            nfts: nfts
        });
    },
    //POST '/newUser'
    async newUser(req, res, next) {
        const { name, email, password } = req.body;
        let errorsArr = [];
        let validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            let errors = Object.values(validationErrors.mapped());
            errors.forEach((item) => {
                errorsArr.push(item.msg);
            });
            req.flash("errors", errorsArr);
            return res.redirect("/admin/user/add");
        }

        try {
            const pwd = await bcrypt.hash(password, 10);


            const emailExists = await models.User.findOne({ where: { email: email } });
            if (emailExists) {
                req.flash("errors", `Email ${email} already registered`, );
                return res.redirect("/admin/user/add");
            }

            let user = await models.User.create({
                name: name,
                email: email,
                password: pwd
            });

            const userData = user.toJSON();
            delete userData.password;

            req.flash("success", "Registration successful", );
            return res.redirect("/admin/user/add");
        } catch (error) {
            console.log(error);
            Response.serverError(res, error, "something went wrong");
        }

    },

    //POST '/newUser'
    async updateUser(req, res, next) {
        const { name, email, id } = req.body;

        models.User.update({ name: name, email: email }, { where: { id: id } }).then(result => {

                req.flash("success", `Update successful`, );
                return res.redirect(`/admin/user/edit/${id}`);
            })
            .catch(err => {
                console.log(err);
                req.flash("error", `Error occured while updating user`, );
                return res.redirect(`/admin/user/edit/${id}`);
            })
    },

    async pwdHtml(req, res, next) {
        const id = req.params.id
        try {
            const users = await models.User.findOne({ where: { id: id } });

            if (users) {
                return res.render("admin/users/pwd", {
                    errors: req.flash("errors"),
                    success: req.flash("success"),
                    user: req.user,
                    editUser: users
                });
            } else {
                req.flash("errors", 'User does not exists');
                return res.redirect(`/admin/user/list`);
            }
        } catch (error) {
            console.log(error);
            req.flash("errors", `Error occured while geting user information`);
            return res.redirect(`/admin/user/list`);
        }
    },
    //POST '/newUser'
    async updatePwd(req, res, next) {

        const id = req.params.id;

        const { current_password, new_password, confirm_password } = req.body;
        const pwd = await bcrypt.hash(new_password, 10);
        if (new_password !== confirm_password) {
            req.flash("errors", `Confirm password did not match new password`);
            return res.redirect(`/admin/user/pwd/${id}`);

        }

        try {
            const user = await models.User.findOne({ where: { id: id } });
            if (user) {

                bcrypt.compare(current_password, user.password, function(err, isMatch) {
                    if (err) {
                        console.log(err);
                        req.flash("errors", `Current password did not match`);
                        return res.redirect(`/admin/user/pwd/${id}`);

                    }
                    if (isMatch) {


                        models.User.update({ password: pwd }, { where: { id: id } }).then((result, err) => {

                                req.flash("success", `Password update successful`, );
                                return res.redirect(`/admin/user/pwd/${id}`);
                            })
                            .catch(err => {
                                console.log(err);
                                req.flash("errors", `Error occured while updating user`, );
                                return res.redirect(`/admin/user/pwd/${id}`);
                            })
                    } else {
                        req.flash("errors", `Current password did not match`);
                        return res.redirect(`/admin/user/pwd/${id}`);

                    }

                });


            }
        } catch (error) {
            console.log(error);
            req.flash("errors", `Error Occured while saving password`);
            return res.redirect(`/admin/user/pwd/${id}`);
        }
    },

    //DELETE 'user/deleteAllUser'
    async deleteUser(req, res, next) {

        models.User.destroy({
                where: {
                    id: req.params.id
                }
            })
            .then(deletedRecord => {
                if (deletedRecord === 1) {
                    req.flash("success", `User account deleted`);
                    return res.redirect(`/admin/user/list`);
                } else {
                    req.flash("errors", `Error occured while deleting user`);
                    return res.redirect(`/admin/user/list`);
                }
            })
            .catch(function(error) {
                console.log(error);
                req.flash("errors", `Error occured while deleting user`);
                return res.redirect(`/admin/user/list`);
            });

    },

    //GET '/users/:id'
    async getUserById(req, res, next) {
        const id = req.params.id

        try {
            const users = await models.User.findOne({ where: { id: id } });

            if (users) {
                return res.render("admin/users/edit", {
                    errors: req.flash("errors"),
                    success: req.flash("success"),
                    user: req.user,
                    editUser: users
                });
            } else {
                req.flash("errors", 'User does not exists');
                return res.redirect(`/admin/user/list`);
            }
        } catch (error) {
            console.log(error);
            req.flash("errors", `Error occured while geting user information`);
            return res.redirect(`/admin/user/edit/${id}`);
        }


    },

    //DELETE '/user/:id'
    async deleteUserById(req, res, next) {
        res.json({ message: "DELETE 1 tea" });
    },
    async signUpHtml(req, res, next) {

        return res.render("admin/users/add.ejs", {
            errors: req.flash("errors"),
            success: req.flash("success"),
            user: req.user
        });

    },
    async loginHtml(req, res, next) {

        return res.render("login.ejs", {
            errors: req.flash("errors"),
            success: req.flash("success")
        });

    },
    async loginUser(req, res, next) {

        //validate required fields
        let errorsArr = [];
        let validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {

            req.flash("errors", 'Invalid Credential');
            return res.redirect("/admin/login");
        } else {

            passport.authenticate('local', {
                successRedirect: '/admin/dashboard',
                failureRedirect: '/admin/login',
                failureFlash: true
            })(req, res, next);
        }


    }

};