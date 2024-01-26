"use client"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { useUser } from "../../../components/contexts/UserContext"
import Header from "../../../components/Header"
import { IMyPlant } from "../../../interfaces"

type Props = {}

export default function MyPlants({}: Props) {
  const [plants, setPlants] = useState<IMyPlant[]>([])
  const { user } = useUser()

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/my-plants/${user.id}`, {
        method: "GET",
      })
      const data = await response.json()
      setPlants(data)
    }
    if (user.id) {
      fetchData()
    }
  }, [])

  return (
    <div>
      <Header />
      <br />
      {user.id ? (
        plants.length ? (
          plants.map((plant) => (
            <Link key={plant.id} href={`/plant/${plant.id}`}>
              <div>
                <img src={plant.image} className="h-full w-52" />
                <span>{plant.name}</span>
              </div>
            </Link>
          ))
        ) : (
          <div>Go explore plants to add some here</div>
        )
      ) : (
        <div>Please login to access My Plants</div>
      )}
    </div>
  )
}
