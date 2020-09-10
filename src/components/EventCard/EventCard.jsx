import React from 'react'
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardTitle,
  MDBCardText,
  MDBCol,
} from 'mdbreact'
import { observer } from 'mobx-react'
import { useHistory } from 'react-router-dom'
import Rating from '../Inputs/Rating'
import './EventCard.css'
import { useState } from 'react'
import { shortenText, getClosestShow, formatDate } from '../../utils/functions'

const EventCard = observer(props => {
  const [eventRatings, setEventRatings] = useState(0)
  const history = useHistory()
  const handleDetailsClick = () => {
    history.push(`/event/${props.eventDetails.id}`)
  }
  const eventShows = props.eventDetails.shows
  const closestShow = getClosestShow(eventShows)
  const closestShowText = closestShow ? formatDate(closestShow) : null

  // console.log('EVENT DETAILS IN CARD', props.eventDetails)
  return (
    <MDBCol style={{ maxWidth: '22rem' }}>
      <MDBCard>
        <MDBCardImage
          className='img-fluid'
          src={props.eventDetails.coverImgURL}
          waves
        />
        <MDBCardBody>
          <Rating rating={5} />
          <MDBCardTitle>
            {shortenText(props.eventDetails.name, 25)}
          </MDBCardTitle>
          <MDBCardText>{props.eventDetails.categoryName}</MDBCardText>
          <MDBCardText className='card-description'>
            {shortenText(props.eventDetails.description, 50)}
          </MDBCardText>
          <div className='small-text'>
            Next Screen:
            <br />
            {closestShowText}
          </div>
          {(props.isEdit && (
            <MDBBtn onClick={handleDetailsClick}>EDIT</MDBBtn>
          )) || (
            <>
              <button
                type='button'
                className='btn btn-default '
                onClick={handleDetailsClick}
              >
                BOOK SCREEN
              </button>
            </>
          )}
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  )
})

export default EventCard
