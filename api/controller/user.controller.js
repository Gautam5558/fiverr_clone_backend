import User from "../models/user.model.js"

export const deleteUser = async (req, res, next) => {
    try {

        await User.deleteOne({ _id: req.params.userId })
        res.status(200).json("User has been deleted")

    } catch (err) {
        next(err)
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userID)
        const { password, ...other } = user
        res.status(200).json(other._doc)
    } catch (err) {
        next(err)
    }
}


export const becomeSeller = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { $set: { isSeller: true } })
        res.status(200).json("Buyer has become seller")
    } catch (err) {
        next(err)
    }
}