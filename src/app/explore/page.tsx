"use client"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import Header from "../../../components/Header"
import { IFullPlant } from "../../../interfaces"

type Props = {}

export default function Explore({}: Props) {
  const [fullPlants, setfullPlants] = useState<IFullPlant[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/all-plants", {
        method: "GET",
      })
      const data = await response.json()
      setfullPlants(data)
    }
    fetchData()
  }, [])

  return (
    <div>
      <Header />
      <br />
      {fullPlants.map((plant) => (
        <Link key={plant.id} href={`/plant/${plant.id}`}>
          <div>
            <img src={plant.image} className="h-full w-52" />
            <span>{plant.name}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
