"use client"
import { usePathname } from "next/navigation"
import React, { useEffect, useState } from "react"
import { useUser } from "../../../../components/contexts/UserContext"
import Header from "../../../../components/Header"
import { IFullPlant } from "../../../../interfaces"

type Props = {}

export default function PLantDetails({}: Props) {
  const [plant, setPlant] = useState<IFullPlant>({} as IFullPlant)
  const [addedPlant, setAddedPlant] = useState(false)
  const { user } = useUser()

  const pathname = usePathname()
  const pathId = pathname.slice(7)

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `/api/plant/${pathId}${user.id ? `?user_id=${user.id}` : ""}`,
        {
          method: "GET",
        }
      )
      const data = await response.json()
      setPlant(data.data[0])
      setAddedPlant(data.success)
    }
    fetchData()
  }, [])

  const addPlant = async () => {
    const response = await fetch("/api/add-plant", {
      method: "POST",
      headers: { "Context-Type": "application/json" },
      body: JSON.stringify({
        user: user.id,
        plant: pathId,
      }),
    })
    setAddedPlant(!addedPlant)
  }

  const removePlant = async () => {
    const response = await fetch(
      `/api/remove-plant/${pathId}?user_id=${user.id}`,
      {
        method: "DELETE",
      }
    )
    setAddedPlant(!addedPlant)
  }

  return (
    <div>
      <Header />
      <br />
      <ul>
        <h2>{plant.name}</h2>
        <img src={plant.image} className="h-full w-52" />
        <li>Botanical name: {plant.botanical}</li>
        <li>Sunlight: {plant.sun}</li>
        <li>Watering: {plant.water}</li>
        <li>Fertilize: {plant.fertilize}</li>
        <li>Temperature tolerance: {plant.temperature}</li>
        <li>Humidity: {plant.humidity}</li>
      </ul>
      {user.id &&
        (addedPlant ? (
          <button onClick={removePlant} className="border-black border-2">
            Remove from my plants
          </button>
        ) : (
          <button onClick={addPlant} className="border-black border-2">
            Add to my plants
          </button>
        ))}
    </div>
  )
}
