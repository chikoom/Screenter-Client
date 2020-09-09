import React from 'react'
import {
  MDBContainer,
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
} from 'mdbreact'
import { useState } from 'react'
import TimePickerPage from './TimePicker'
import { inject } from 'mobx-react'

const CreateShowModal = inject('generalStore')(props => {
  const [isOpen, setIsOpen] = useState(true)
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const date = props.selectedDate.info.dateStr

  const toggle = () => {
    setIsOpen(!isOpen)
    props.toggleModal()
  }
  console.log(
    'currentEventcurrentEventcurrentEventcurrentEventcurrentEvent',
    props.currentEvent
  )

  const handleSave = () => {
    console.log(startTime);
    const startDate = new Date(date);
    startDate.setHours(getTimeArray(startTime)[0])
    startDate.setMinutes(getTimeArray(startTime)[1])
    startDate.setHours(startDate.getHours() + 3);
    const endDate = new Date(date);
    endDate.setHours(getTimeArray(endTime)[0])
    endDate.setMinutes(getTimeArray(endTime)[1])
    endDate.setHours(endDate.getHours() + 3);
    if (endDate > startDate) {
      console.log('START', startDate)
      console.log('END', endDate)
      props.generalStore.addShow({
        startTime: startDate,
        endTime: endDate,
        showEventID: props.currentEvent.id,
      })

      setIsOpen(false)
    } else {
    }
  }
  const getTimeArray = timeString => {
    const hours = `${timeString.charAt(0)}${timeString.charAt(1)}`
    const minutes = `${timeString.charAt(3)}${timeString.charAt(4)}`
    return [hours, minutes]
  }

  return (
    <MDBContainer>
      <MDBModal isOpen={isOpen} toggle={toggle} centered>
        <MDBModalHeader toggle={toggle}>ADD NEW SHOW</MDBModalHeader>
        <MDBModalBody>
          <p>Date: {props.selectedDate.info.dateStr}</p>
          <p>
            Start: <TimePickerPage setTime={setStartTime} />
          </p>
          <p>
            End: <TimePickerPage setTime={setEndTime} />
          </p>
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn onClick={handleSave} color='primary'>
            SAVE
          </MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    </MDBContainer>
  )
})

const formatDate = date => {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  const dayString = days[date.getDay()]
  const dateString = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`
  const hour = date.getHours()
  const minutes = date.getMinutes()
  return `${dayString} | ${dateString} | ${hour}:${minutes} `
}
export default CreateShowModal
