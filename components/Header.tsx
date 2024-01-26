"use client"
import Link from "next/link"
import React from "react"
import { IUser } from "../interfaces"
import { useUser } from "./contexts/UserContext"

type Props = {}

export default function Header({}: Props) {
  const { user, setUser } = useUser()
  return (
    <div>
      <Link href="/">
        <h1>Happy Plants</h1>
      </Link>
      <ul>
        <li>
          <Link href="/explore">Explore Plants</Link>
        </li>
        <li>
          <Link href="/my-plants">
            {user.id ? `${user.username}'s Plants` : "My Plants"}
          </Link>
        </li>
        <li>
          <Link href="/calendar">Calendar</Link>
        </li>
        <li>
          {user.id ? (
            <button onClick={() => setUser({} as IUser)}>Log out</button>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </li>
      </ul>
    </div>
  )
}
