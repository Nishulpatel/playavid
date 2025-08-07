import { NextAuthOptions } from "next-auth";
// import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDb } from "./db";
import User from "@/models/Users";
import bcrypt from "bcryptjs";



export const authOptions: NextAuthOptions = {

    // Configure one or more authentication providers

    providers: [
//     GithubProvider({
//       clientId: process.env.GITHUB_ID!,
//       clientSecret: process.env.GITHUB_SECRET!,
//     }),


     GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!
  }),

//----------------------------------------------

//credentials provider 
     
      CredentialsProvider({

      name: "Credentials",
      credentials: {
      email: { label: "email", type: "text"},
      password: { label: "Password", type: "password" }
    },

     async authorize(credentials) {

        if(!credentials?.email || !credentials.password) {
            throw new Error("Email and Password is required");
        }

        try {

            await connectToDb();
        const user = await User.findOne({email : credentials.email});
            
        if(!user) {
            throw new Error("User not found");
        }

        const isValid = await bcrypt.compare(credentials.password , user.password);

        if(!isValid) {
            throw new Error("Invalid Password");
        }

        return {
            id : user._id.toString(),
            email : user.email
        }

        } catch (error) {
            console.log("Auth error" , error);
            throw new Error("Something went wrong");
        }

     }

      })
  ],
callbacks: {
  async jwt({ token, user, account, profile }) {
    if (account?.provider === "google") {
      await connectToDb();
      const existingUser = await User.findOne({ email: token.email });

      if (!existingUser) {
        const newUser = await User.create({
          email: token.email,
          name: profile?.name || "No Name",
          password: "",
        });

        token.id = newUser._id.toString();
      } else {
        token.id = existingUser._id.toString();
      }
    }

    if (user) {
      token.id = user.id;
    }

    return token;
  },

  async session({ session, token }) {
    if (token) {
      session.user.id = token.id as string;
    }
    return session;
  }
}
,

  //add page for login

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,

};