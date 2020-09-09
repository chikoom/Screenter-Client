import React from 'react'
import { MDBContainer, MDBRow, MDBCol, MDBBtn } from 'mdbreact'
import EventCard from './EventCard/EventCard'
import { inject, observer } from 'mobx-react'
import { useHistory } from 'react-router-dom'

const selectOptions = ['Date', 'Popularity', 'Screenter']

const EventGrid = inject('eventsStores')(
  observer(props => {
    const history = useHistory()
    const events = props.events

    const handleNewEvent = async () => {
      const newEvent = await props.eventsStores.addEvent(
        props.creator.data.Data.id
      )
      console.log(newEvent)
      history.push(`/event/${newEvent.data.id}`)
    }

    console.log(props.isOwner)

    return (
      <>
        <MDBContainer>
          <MDBRow>
            <MDBCol lg='8'>
              {props.isOwner ? (
                <MDBBtn
                  onClick={handleNewEvent}
                  color='primary'
                  style={{
                    margin: '0 auto',
                    display: 'block',
                  }}
                >
                  Create new event
                </MDBBtn>
              ) : null}
            </MDBCol>
          </MDBRow>
        </MDBContainer>
        <MDBContainer>
          <MDBRow>
            {events &&
              events.map(event => (
                <MDBCol lg='4' md='6'>
                  <EventCard isEdit={props.isOwner} eventDetails={event} />
                </MDBCol>
              ))}
          </MDBRow>
        </MDBContainer>
      </>
    )
  })
)

export default EventGrid
