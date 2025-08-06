import { connectToDb } from "@/lib/db";
import User from "@/models/Users";
import { NextRequest, NextResponse } from "next/server";


//step -1 : make a route handler 
export async function POST(req : NextRequest) {
  
    try {
       //get email and password from the body
        const {email , password} = await req.json();

        //validate the email and password

        if(!email || !password) {
            return NextResponse.json({error : "Email and Password is required"} , {status : 400});
        }

        //connect to db

        await connectToDb();

        //check if user already exists

        const userExists = await User.findOne({email});

        if(userExists) {
            return NextResponse.json({error : "User already exists"} , {status : 400});
        }

        //create a new user

        await User.create({
            email,
            password
        })

        return NextResponse.json({message : "User created successfully"} , {status : 201});

    } catch (error) {

        console.log("Registation Error",error);
        return NextResponse.json({error : "Failed to create user"} , {status : 500});
        
    }
}