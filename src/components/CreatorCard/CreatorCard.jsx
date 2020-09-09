import React from 'react'
import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardTitle,
  MDBCardText,
  MDBCardUp,
  MDBAvatar,
  MDBRow,
  MDBCol,
  MDBIcon,
} from 'mdbreact'
import { observer } from 'mobx-react'
import Rating from '../Inputs/Rating'
import './CreatorCard.css'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { shortenText, getClosestShow } from '../../utils/functions'

const CreatorCard = observer(props => {
  const history = useHistory()
  const watchScreenter = () => {
    history.push(`/creator/${props.creatorDetails.id}`)
  }

  return (
    <MDBCol style={{ minWidth: '200px', marginTop: '60px' }}>
      <MDBCard testimonial>
        <MDBCardUp className='indigo lighten-1' />
        <MDBAvatar className='mx-auto white'>
          <img
            className='img-fluid'
            src={props.creatorDetails.imageURL}
            alt=''
          />
        </MDBAvatar>
        <MDBCardBody>
          <Rating rating={parseFloat(props.creatorDetails.rating) || 0} />
          <h4 className='card-title'>
            {props.creatorDetails.firstName +
              ' ' +
              props.creatorDetails.lastName}
          </h4>
          <hr />
          <p>{shortenText(props.creatorDetails.about, 50)}</p>
          <>
            <button
              type='button'
              className='btn btn-default '
              onClick={() => watchScreenter(props.creatorDetails.id)}
            >
              Watch Screenter
            </button>
          </>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>

    // <MDBCol style={{ maxWidth: '22rem' }}>
    //   <MDBCard>
    //     <MDBCardImage
    //       className='img-fluid'
    //       src={props.creatorDetails.imageURL}
    //       waves
    //     />
    //     <MDBCardBody>
    //       <Rating rating={parseFloat(props.creatorDetails.rating) || 0} />
    //       <MDBCardTitle>
    //         {props.creatorDetails.firstName +
    //           ' ' +
    //           props.creatorDetails.lastName}
    //       </MDBCardTitle>
    //       <MDBCardText>{props.creatorDetails.about}</MDBCardText>
    //       <>
    //         <button
    //           type='button'
    //           className='btn btn-default '
    //           onClick={() => watchScreenter(props.creatorDetails.id)}
    //         >
    //           Watch Screenter
    //         </button>
    //       </>
    //     </MDBCardBody>
    //   </MDBCard>
    // </MDBCol>
  )
})

export default CreatorCard
