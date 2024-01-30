"use client"

import React, { useEffect, useState } from "react"
import {
  EventApi,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
  formatDate,
} from "@fullcalendar/core"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import Modal from "../../../components/modal/Modal"
import Header from "../../../components/Header"
import { IMyPlant } from "../../../interfaces"
import { useUser } from "../../../components/contexts/UserContext"
// import { INITIAL_EVENTS, createEventId } from "./event-utils"

export default function Calendar() {
  const [isOpened, setIsOpened] = useState<boolean>(false)
  const [eventAction, setEventAction] = useState("")
  const [myPlants, setMyPlants] = useState<IMyPlant[]>([])
  const [plantIds, setPlantIds] = useState<number[]>([])
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [notes, setNotes] = useState("")
  const [dateSelect, setDateSelect] = useState<DateSelectArg>(
    {} as DateSelectArg
  )
  const { user } = useUser()
  const calendarAction = ["Water", "Fertilize", "Humidify", "Clean my plants!"]

  console.log("date: ", typeof dateSelect.start)
  //   console.log("myplants", myPlants)
  //   console.log("ids", plantIds)
  //   console.log("event", eventAction)
  //   console.log("notes", notes)

  //  const date = new Date(event.date)

  useEffect(() => {
    if (user.id) {
      const fetchData = async () => {
        const response = await fetch(`/api/my-plants/${user.id}`, {
          method: "GET",
        })
        const data = await response.json()
        setMyPlants(data)
      }
      if (user.id) {
        fetchData()
      }
    }
  }, [])

  const handleDateSelect = (e: DateSelectArg) => {
    setIsOpened(true)
    setDateSelect(e)
  }

  const onActionClick = (action: string) => {
    setEventAction(action)
  }

  const startTimeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartTime(e.target.value)
  }

  const endTimeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndTime(e.target.value)
  }

  const onPlantClick = (plant: IMyPlant) => {
    setPlantIds([...plantIds, plant.id])
  }

  const notesInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(e.target.value)
  }

  const createEvent = async () => {
    const response = await fetch("/api/add-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
  }

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove()
    }
  }

  const handleEvents = (events: EventApi[]) => {}

  function renderEventContent(eventContent: EventContentArg) {
    return (
      <>
        <b>{eventContent.timeText}</b>
        <i>{eventContent.event.title}</i>
      </>
    )
  }

  function renderSidebarEvent(event: EventApi) {
    return (
      <li key={event.id}>
        <b>
          {formatDate(event.start!, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </b>
        <i>{event.title}</i>
      </li>
    )
  }

  function createEventId(): string | undefined {
    throw new Error("Function not implemented.")
  }

  const onModalClose = () => {
    setIsOpened(false)
    setDateSelect({} as DateSelectArg)
    setEventAction("")
    setPlantIds([])
    setStartTime("")
    setEndTime("")
    setNotes("")
  }

  return (
    <>
      <Header />
      <br />
      <Modal isOpened={isOpened} onClose={onModalClose}>
        <p>New calendar event</p>
        <p>{dateSelect.startStr}</p>
        {calendarAction.map((action) => (
          <button
            key={action}
            disabled={eventAction === action}
            className="border-black border-2 active:bg-slate-500"
            onClick={() => onActionClick(action)}
          >
            {action}
          </button>
        ))}
        <p>start time</p>
        <input
          onChange={startTimeInput}
          type="time"
          min="00:00"
          max="23:59"
          required
        />
        <p>end time</p>
        <input
          onChange={endTimeInput}
          type="time"
          min="00:00"
          max="23:59"
          required
        />
        <br />
        {myPlants.map((plant) => (
          <button
            className="border-black border-2 active:bg-slate-500"
            key={plant.id}
            disabled={plantIds.includes(plant.id)}
            onClick={() => onPlantClick(plant)}
          >
            {plant.name}
          </button>
        ))}
        <br />
        <input placeholder="Notes" onChange={notesInput} />
        <button
          onClick={createEvent}
          className="border-black border-2 active:bg-slate-500"
        >
          Create event
        </button>
      </Modal>
      <div className="demo-app">
        <div className="demo-app-main">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            // initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
            select={handleDateSelect}
            eventContent={renderEventContent} // custom render function
            eventClick={handleEventClick}
            eventsSet={handleEvents} // called after events are initialized/added/changed/removed
            /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
          />
        </div>
      </div>
    </>
  )
}
