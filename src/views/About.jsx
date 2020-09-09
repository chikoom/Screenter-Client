import aboutHeader from '../assets/about.jpg'
import React, { useEffect } from 'react'
import { MDBContainer, MDBRow, MDBCol, MDBTypography, MDBInput } from 'mdbreact'
import { inject, observer } from 'mobx-react'
import MyCalendar from '../components/Calendar/Calendar'
import SwitchField from '../components/Inputs/SwitchField'
import ImageUplaod from '../components/Inputs/ImageUpload'

import './pages.css'

const About = props => {
  return (
    <>
      <img
        src={aboutHeader}
        className='img-fluid full-width z-depth-2'
        alt='Screenters.com'
      />
      <div className='spacer'>&nbsp;</div>
      <MDBContainer>
        <MDBRow>
          <MDBCol>
            <MDBRow>
              <MDBTypography
                tag='h1'
                variant='h1'
                className='text-center'
                style={{
                  margin: '0px auto 75px auto',
                  borderBottom: '3px solid rgb(212 0 0)',
                  paddingBottom: '10px',
                }}
              >
                WE ARE SCREENTERS
              </MDBTypography>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      <MDBContainer>
        <MDBRow>
          <MDBCol>
            <p className='text-justify'>
              Ambitioni dedisse scripsisse iudicaretur. Cras mattis iudicium
              purus sit amet fermentum. Donec sed odio operae, eu vulputate
              felis rhoncus. Praeterea iter est quasdam res quas ex communi. At
              nos hinc posthac, sitientis piros Afros. Petierunt uti sibi
              concilium totius Galliae in diem certam indicere. Cras mattis
              iudicium purus sit amet fermentum.
            </p>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <div className='spacer'>&nbsp;</div>
    </>
  )
}

export default About
