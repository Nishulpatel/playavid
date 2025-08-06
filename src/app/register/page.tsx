"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const RegisterPage = () => {
  //state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  //handle submit

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //prevent default
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    //send data to backend
    try {
      //react-query
      //loading , error , data , debounce

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "register failed");
      }

      console.log(data);
      //redirect to login page
      router.push("/login");
    } catch (error) {}
  };

  return (
    //ui
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
      already have an account -
      <button onClick={() => router.push("/login")}>Login</button>
    </div>
  );
};

export default RegisterPage;
