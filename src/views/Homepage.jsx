import React, { Fragment, useEffect } from 'react'
import EventGrid from '../components/EventList/EventList'
import SideBar from '../components/Sidebar/Sidebar'
import JumboCarousel from '../components/Carousel/JumboCarousel'
import { MDBContainer, MDBRow, MDBCol, MDBTypography } from 'mdbreact'
import { inject, observer } from 'mobx-react'
import { useHistory } from 'react-router-dom'
import { useState } from 'react'
import './Homepage.css'

const Homepage = inject(
  'eventsStores',
  'generalStore'
)(
  observer(props => {
    const history = useHistory()
    const { listOfEvents } = props.eventsStores
    const carouselEvents = [
      listOfEvents[2],
      listOfEvents[5],
      listOfEvents[6],
      listOfEvents[0],
    ].map(event => ({
      id: event.id,
      image: event.coverImgURL,
      header: event.name,
      text: event.description,
      link: `/event/:${event.id}`,
    }))
    const navigateToEvent = id => {
      history.push(`/event/${id}`)
    }

    const [eventList, setEventList] = useState(props.eventsStores.listOfEvents)
    const eventNames = props.eventsStores.listOfEvents.map(event => event.name)

    useEffect(() => {
      setEventList(props.eventsStores.listOfEvents)
    }, [props.eventsStores.listOfEvents])

    const filterEvents = query => {
      const filteredEvents = props.eventsStores.listOfEvents.filter(event => {
        const lowerQuery = query.toLowerCase()
        const lowerName = event.name.toLowerCase()
        return lowerName.includes(lowerQuery)
      })
      setEventList(filteredEvents)
    }
    const filterByCategory = categories => {
      const filteredEvents = props.eventsStores.listOfEvents.filter(function (
        event
      ) {
        if (this.length > 0) {
          return this.indexOf(event.categoryID.toString()) >= 0
        } else {
          return true
        }
      },
      categories)
      setEventList(filteredEvents)
    }
    const sortEvents = attr => {
      console.log('SORT', attr)
    }
    // https://www.smashingmagazine.com/2020/03/infinite-scroll-lazy-image-loading-react/

    return (
      <Fragment>
        <JumboCarousel
          className='z-depth-2'
          buttonNavigate={navigateToEvent}
          data={carouselEvents}
        />

        <div className='spacer'>&nbsp;</div>
        <MDBContainer>
          <MDBRow>
            <MDBTypography
              tag='h1'
              variant='h1'
              className='text-center'
              style={{
                margin: '0px auto 0px auto',
                borderBottom: '3px solid rgb(212 0 0)',
                paddingBottom: '10px',
                display: 'block',
                width: '65%',
              }}
            >
              SCREENTERS
            </MDBTypography>
            <MDBTypography
              tag='h3'
              variant='h3'
              className='text-center'
              style={{
                margin: '10px auto 0 auto',
                paddingBottom: '10px',
                display: 'block',
                width: '85%',
              }}
            >
              STAY HOME | STAY LIVE
            </MDBTypography>
          </MDBRow>
          <div className='spacer'>&nbsp;</div>
          <MDBRow>
            <MDBCol md='2'>
              <SideBar categoryFunction={filterByCategory} />
            </MDBCol>
            <MDBCol md='10'>
              <EventGrid
                eventNames={eventNames}
                searchFunction={filterEvents}
                eventList={eventList}
                sortEvents={sortEvents}
              />
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </Fragment>
    )
  })
)

export default Homepage
