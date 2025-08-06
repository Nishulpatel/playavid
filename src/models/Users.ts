import mongoose, {Schema, models , model }from "mongoose";
import bcrypt from "bcryptjs";
import { time } from "console";


//Step 1 : make an interface

export interface IUser {
    email : string;
    password : string;
    _id?: string;
    createdAt?: Date;
    updatedAt? : Date;
}

// Step 2 : use interface and make a schema

const userSchema = new Schema<IUser>(

    {
        email : {type : String , required : true},
        password : {type : String , required : true},

    },
    {
     timestamps : true
    }
    
) 

// step 3 : use hooks = pre

userSchema.pre('save' , async function (next) {
   if(this.isModified('password')) {
    this.password = await bcrypt.hash(this.password , 10);
   }

   next();
    
});


// step 4 : make a model

const User = models?.User || model<IUser>("User", userSchema)

export default User