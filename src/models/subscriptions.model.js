import mongoose, { Schema } from 'mongoose'

const subscriptionSchema = new mongoose.Schema({
    suscriber: {
        type: Schema.Types.ObjectId,// one who is suscribing
        ref: "User"
    },
    channel: {
        types: Schema.Types.ObjectId,
        ref: "User" // one to whom "suscriber " is suscribing
    }

},{timestamps: true})


export const Subscription = mongoose.model("Subscription", subscriptionSchema);