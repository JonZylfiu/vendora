import mongoose from "mongoose";
const { Schema } = mongoose;
import cities from "../enums/cities.js";
import userRoles from "../enums/userRoles.js";


const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: [50, 'Name is too long']
    },
    surname: {
        type: String,
        required: true,
        maxLength: [50, 'Surname is too long']
    },
    email: {
        type: String,
        required: [true, 'User email required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    hash_password: {
        type: String,
        required: [true, 'User password required']
    },
    salt: { 
        type: String,
        required: [true, 'User password salt required']
    },
    age: {
        type: Number,
        min: [16, 'Must be older than 16'],
        required: true
    },
    phone: { 
        type: String,
        validate: {
        validator: function(v) {
            return /^(\+383|383)\d{8}$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'User phone number required']
    },
    city: {
        type: String,
        enum: {
            value: cities,
            messsage: '{VALUE} is not a supported city'
        },
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true,
            validate: {
                validator: function(v) {
                    return v.length === 2;
                },
                message: 'Coordinates must contain longitude and latitude'
            }
        }
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    }],
    rating_avg: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },

    rating_count: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        enum: userRoles,
        default: "USER"
    }

}, {
    timestamps: true
})

UserSchema.index({ location: '2dsphere' });

const User = mongoose.model('User', UserSchema);

export default User;