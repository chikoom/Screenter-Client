import React from 'react'
import { MDBContainer, MDBRow, MDBCol, MDBTypography } from 'mdbreact'
import CreatorCard from '../CreatorCard/CreatorCard'
import './CreatorList.css'

const CreatorGrid = props => {
  return (
    <>
      <MDBContainer>
        <MDBRow>
          <MDBTypography
            tag='h1'
            variant='h1'
            className='text-center'
            style={{
              margin: '0px auto 100px auto',
              borderBottom: '3px solid rgb(212 0 0)',
              paddingBottom: '10px',
            }}
          >
            MEET THE SCREENTERS
          </MDBTypography>
        </MDBRow>
        <MDBRow>
          {props.creatorList.map(creator => (
            <MDBCol lg='4' md='6'>
              <CreatorCard isEdit={false} creatorDetails={creator} />
            </MDBCol>
          ))}
        </MDBRow>
      </MDBContainer>
    </>
  )
}

export default CreatorGrid
