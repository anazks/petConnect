const AdminModel = require("../models/admin-model");
const bcrypt = require("bcrypt");

module.exports.checkAdminExist = async (req, res, next) => {
    let admin = await AdminModel.find({});
    if (admin.length == 0) {
        let password = await bcrypt.hash("admin123", 10);
        let adminObj = {
            userId: "1234",
            password
        }
        console.log(adminObj)
        await AdminModel.create(adminObj)
        console.log("admin created")
        next();
    } else next();
}