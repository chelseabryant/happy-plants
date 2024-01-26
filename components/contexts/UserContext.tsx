"use client"
import React, { useContext, useState } from "react"
import { IUser } from "../../interfaces"

type userProviderProps = { children: React.ReactNode }

const UserContext = React.createContext<
  | { user: IUser; setUser: React.Dispatch<React.SetStateAction<IUser>> }
  | undefined
>(undefined)

function UserProvider({ children }: userProviderProps) {
  const [user, setUser] = useState<IUser>({} as IUser)
  const value = { user, setUser }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

export { UserProvider, useUser }
