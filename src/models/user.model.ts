import mongoose, { type ValidatorProps } from "mongoose";
const { Schema } = mongoose;
import CitiesEnum from "../enums/cities.enum.js";
import UserRolesEnum from "../enums/user-roles.enum.js";
import type IUser from "./interfaces/IUser.interface.js";


const UserSchema = new Schema<IUser>({
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
            validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: [true, 'User password required']
    },
    age: {
        type: Number,
        min: [16, 'Must be older than 16'],
        required: true
    },
    phone: { 
        type: String,
        validate: {
        validator: (v: string) => /^(\+383|383)\d{8}$/.test(v),
        message: (props: ValidatorProps) => `${props.value} is not a valid phone number!`
        },
        unique: true,
        required: [true, 'User phone number required']
    },
    city: {
        type: String,
        enum: {
            values: Object.values(CitiesEnum),
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
                validator: (v: String) => v.length === 2,
                message: 'Coordinates must contain longitude and latitude'
            }
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: Object.values(UserRolesEnum),
        default: UserRolesEnum.USER
    }

}, {
    timestamps: true
})

UserSchema.index({ location: '2dsphere' });

const User = mongoose.model('User', UserSchema);

export default User;