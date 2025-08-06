"use client"

import { error } from 'console';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const LoginPage = () => {

    //step -1 : stats

    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");

    const router = useRouter();

    //step -2 : handle submit
    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        const result = await signIn("credentials" , {
            email,
            password,
            redirect : false
        })

        if(result?.ok) {
            console.log(result.error);
        }else{
            router.push("/");
        }
    }


    //step -3 : UI
  
  return (
    <div>
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
            <input type="email" placeholder='email' onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder='password' onChange={(e) => setPassword(e.target.value)} />
            <button type='submit'>Login</button>
        </form>

        <div onClick={() => signIn("google")} >sign in with google</div>

        <div>dont have an account?</div>
        <button onClick={() => router.push("/register")}>Register</button>
    </div>
  )
}

export default LoginPage
