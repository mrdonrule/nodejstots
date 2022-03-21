const models = require("../models/index");

const { body, validationResult } = require('express-validator');
const Response = require("../services/Response");
const path = require("path");
const fs = require('fs');
const { create } = require("ipfs-http-client");
const ipfsClient = create("https://ipfs.infura.io:5001/api/v0");
const ipfsBaseUrl = "https://ipfs.infura.io/ipfs/";


module.exports = {
    //GET '/getUser'
    async getAll(req, res, next) {

        const nfts = await models.NftCollection.findAll({
            order: [
                ['id', 'DESC'],

            ],

        });
        return res.render("admin/nft/index", {
            errors: req.flash("errors"),
            success: req.flash("success"),
            user: req.user,
            nfts: nfts

        });
    },

    async addNft(req, res, next) {

        return res.render("admin/nft/add", {
            errors: req.flash("errors"),
            success: req.flash("success"),
            user: req.user

        });

    },
    //POST '/newUser'
    async newNFT(req, res, next) {
        const { name, description, price } = req.body;
        let errorsArr = [];
        let validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            let errors = Object.values(validationErrors.mapped());
            errors.forEach((item) => {
                errorsArr.push(item.msg);
            });
            req.flash("errors", errorsArr);
            return res.redirect("/admin/nft/add");
        }
        try {
            const file = req.files.file;
            const imgurl = file.name;
            const pathtoFile = './upload/' + file.name;
            const extensionName = path.extname(file.name); // fetch the file extension
            const allowedExtension = ['.png', '.jpg', '.jpeg'];

            if (!allowedExtension.includes(extensionName)) {

                req.flash("errors", 'Invalid Image');
                return res.redirect("/admin/nft/add");
            }


            file.mv(pathtoFile, async(err) => {
                if (err) {
                    console.log(err);
                    req.flash("errors", 'Can not upload file');
                    return res.redirect("/admin/nft/add");

                }

                const ipfs_file = fs.readFileSync(pathtoFile);
                let nftData = await models.NftCollection.create({
                    name: name,
                    description: description,
                    img_url: imgurl,
                    price: price,
                    minted: '0'
                });

                const addedImage = await ipfsClient.add(ipfs_file);
                const metaDataObj = {
                    name: name,
                    description: description,
                    image: ipfsBaseUrl + addedImage.path,
                };
                const addedMetaData = await ipfsClient.add(JSON.stringify(metaDataObj));
                const uri_ipf = ipfsBaseUrl + addedMetaData.path;

                models.NftCollection.update({ uri: uri_ipf }, { where: { id: nftData.id } }).then(result => {

                        req.flash("success", `Update successful ${uri_ipf}`, );
                        return res.redirect(`/admin/nft/add`);
                    })
                    .catch(err => {
                        console.log(err);
                        req.flash("error", `Error occured while updating to db`, );
                        return res.redirect(`/admin/nft/add`);
                    })

            });
        } catch (err) {
            console.log(err);
            req.flash("errors", "file not uploaded");
            return res.redirect("/admin/nft/add");
        }

    },

    //POST '/newUser'
    async update(req, res, next) {
        const { id, hash } = req.body;

        models.NftCollection.update({ minted: '1', hash: hash }, { where: { id: id } }).then(result => {

                res.json({ status: 'Success', message: 'Nft minting done db updated' });
            })
            .catch(err => {
                console.log(err);
                res.json({ status: 'Error', message: 'Error mining nft, check console log' });
            })
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

    async loginHtml(req, res, next) {

        return res.render("login.ejs", {
            errors: req.flash("errors"),
            success: req.flash("success")
        });

    }

};