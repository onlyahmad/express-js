import User from "../models/userModel.js";
import sequelize from "../utils/db.js";


const setUser = async(req,res, next) => {
    try {
        

const t=await sequelize.transaction();
const user=req.body;
const userExist= await User.findAll({
    where: {
        email: user.email
    }
});

if (userExist.length > 0 && userExist[0].isActive) {
    return res.status(400).json({
        errors: ["Email already actived"],
        message: "Register failed",
        data:null
    })
}else if(userExist.length > 0 && !userExist[0].isActive && Date.parse(userExist[0].expireTime) > new Date()) {
    return res.status(400).json({
        errors: ["Email already Registered, Please check your email"],
        message: "Register failed",
        data:null
    })
}else{
    User.destroy({
        where: {
            email: user.email
        },
        transaction: t
    });
}

const newUser= await User.create({
    ...user,
    expireTime: new Date()
},{
    transaction: t
})

await t.commit();
res.status(201).json({
    error:null,
    message: "User created successfully",
    data: {
        userId: newUser.userId,
        email: newUser.email,
        name: newUser.name,
        expireTime: newUser.expireTime
    }
})
    } catch (error) {
        next(new Error("controller/userController.js:setUser - "+error.message))
    }
};


export { setUser };
