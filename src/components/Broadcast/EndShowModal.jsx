import React from 'react'
import {
  MDBContainer,
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
  MDBInput,
} from 'mdbreact'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import EndShowRatings from '../Inputs/EndShowRating'

const EndShowModal = props => {
  const history = useHistory()
  const [isOpen, setIsOpen] = useState(true)
  const [isReview, setIsReview] = useState(true)
  // history.push(`/event/${newEvent.data.id}`)

  const toggle = () => {
    setIsOpen(!isOpen)
  }

  const sendReview = () => {
    setIsReview(false)
    setTimeout(() => {
      history.push(`/`)
    }, 5000)
  }

  return (
    <MDBContainer>
      <MDBModal isOpen={isOpen} toggle={toggle} centered>
        <MDBModalHeader toggle={toggle}>LEAVE A REVIEW</MDBModalHeader>
        <MDBModalBody>
          <EndShowRatings />
          <hr />

          {isReview ? (
            <>
              <p>
                Thank you for watching the show, please write a short review
              </p>
              <hr />
              <MDBInput label='Enter a short heading' />
              <MDBInput
                type='textarea'
                label='Leave a nice description'
                rows='5'
              />
            </>
          ) : (
            <p>
              <h1>THANK YOU FOR WATCHING SCREENTERS.COM</h1>
            </p>
          )}
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn onClick={sendReview} color='danger'>
            SEND REVIEW
          </MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    </MDBContainer>
  )
}

export default EndShowModal
