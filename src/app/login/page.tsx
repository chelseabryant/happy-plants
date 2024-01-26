"use client"
import React, { useEffect, useState } from "react"
import { useUser } from "../../../components/contexts/UserContext"
import Header from "../../../components/Header"

type Props = {}

export default function Login({}: Props) {
  const [isCreating, setIsCreating] = useState<boolean>(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState(false)
  const [createError, setCreateError] = useState(false)
  const { user, setUser } = useUser()

  const nameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }
  const emailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }
  const passwordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isCreating) {
      const response = await fetch("/api/user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      })
      const data = await response.json()
      if (data.success) {
        setUser(data.data[0])
        setLoginError(true)
        setCreateError(true)
      } else {
        setCreateError(!createError)
      }
    } else {
      const response = await fetch("api/user/login", {
        method: "POST",
        headers: { "Context-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })
      const data = await response.json()
      if (data.success) {
        setUser(data.data)
        setLoginError(true)
      } else {
        setLoginError(!loginError)
      }
    }
  }

  return (
    <div>
      <Header />
      <br />
      {user.username ? (
        <h1>{`Thank you ${user.username} for logging in!`}</h1>
      ) : (
        <form onSubmit={login}>
          <div>{isCreating ? "Create an account" : "Login"}</div>
          {loginError && !isCreating && <p>Invalid credentials</p>}
          {createError && isCreating && (
            <p>An account with this email already exists, please login</p>
          )}
          {isCreating && (
            <input placeholder="Enter first name" onChange={nameInput} />
          )}
          <input placeholder="Enter email" onChange={emailInput} />
          <input placeholder="Enter password" onChange={passwordInput} />
          <button className="border-black border-2">
            {isCreating ? "Create an account" : "Login"}
          </button>
          <br />
          <button
            className="border-black border-2"
            type="button"
            onClick={() => setIsCreating(!isCreating)}
          >
            {isCreating
              ? "Already have an account?"
              : "Need to create an account?"}
          </button>
        </form>
      )}
    </div>
  )
}
