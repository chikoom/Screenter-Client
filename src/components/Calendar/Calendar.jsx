import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import BookModal from './BookEventModal'
import CreateShowModal from './CreateShowModal'
import { useState, useEffect } from 'react'
import { observer } from 'mobx-react'
import './Calendar.css'

const Calendar = observer(props => {
  const [bookModalOpen, setModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [selectedShow, setSelectedShow] = useState({})
  const [selectedDate, setSelectedDate] = useState({})

  const { currentUser, shows, currentEvent, isEventPage } = props
  const [allShows, setAllShows] = useState([])

  const userEditor = props.userEditor

  const handleShowClick = info => {
    console.log(info.event)
    setSelectedShow({
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
    })
    toggleBookModal()
  }
  const handleDateClick = info => {
    console.log()
    if (userEditor) {
      console.log(info)
      setSelectedDate({
        info,
      })
      toggleCreateModal()
    }
  }
  const toggleBookModal = () => {
    setModalOpen(!bookModalOpen)
  }

  const toggleCreateModal = () => {
    setCreateModalOpen(!createModalOpen)
  }

  useEffect(() => {
    setAllShows(shows)
    return () => {
      setAllShows([])
    }
  })
  return (
    <>
      {bookModalOpen && (
        <BookModal
          isOpen={true}
          toggleModal={toggleBookModal}
          show={selectedShow}
          currentUser={currentUser}
          showPrice={props.showPrice}
          userEditor={userEditor}
          currentEvent={currentEvent}
        />
      )}
      {createModalOpen && (
        <CreateShowModal
          isOpen={true}
          toggleModal={toggleCreateModal}
          selectedDate={selectedDate}
          currentUser={currentUser}
          userEditor={userEditor}
          currentEvent={currentEvent}
        />
      )}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView='dayGridMonth'
        weekends={true}
        events={allShows}
        eventClick={handleShowClick}
        dateClick={handleDateClick}
      />
    </>
  )
})
export default Calendar
