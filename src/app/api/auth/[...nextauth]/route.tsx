import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

//create a handler
const handler = NextAuth(authOptions); 

//export the handler
export {handler as GET , handler as POST};





