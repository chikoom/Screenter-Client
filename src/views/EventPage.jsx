import React, { useEffect } from 'react'
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBTypography,
  MDBInput,
  MDBSelect,
} from 'mdbreact'
import Rating from '../components/Inputs/Rating'
import { inject, observer } from 'mobx-react'
import MyCalendar from '../components/Calendar/Calendar'
import SwitchField from '../components/Inputs/SwitchField'
import ImageUplaod from '../components/Inputs/ImageUpload'
import CreatorCard from '../components/CreatorCard/CreatorCard'
import './pages.css'
import { useRef } from 'react'
import { useState } from 'react'
import { shortenText, getClosestShow, formatDate } from '../utils/functions'
import CreatorEventList from '../components/CreatorEventList'

const formatShows = (shows,eventName) => {
  return shows.map((show) => ({
    id: show.id,
    title: eventName,
    start: show.startTime,
    end: show.endTime,
  }))
}

const isEventCreator = (user, eventID) => {
  if (!user.userRole === 'CREATOR') return false
}

const EventPage = inject(
  'generalStore',
  'eventsStores'
)(
  observer(props => {
    const store = props.generalStore
    const eventID = props.match.params.id
    const categories = props.generalStore.categories

    const [eventTitle, setEventTitle] = useState('')
    const [eventDescription, setEventDescription] = useState('')
    const [eventCategory, setEventCategory] = useState('')
    const [eventPrice, setEventPrice] = useState('')
    const [creatorDetalis, setCreatorDetalis] = useState({})

    let theEventRating = 0
    let selectedCategory = null

    const currentUser = store.currentUser
    // console.log('EVENT CURRENT USER', currentUser)
    // console.log('EVENT CURRENT EVENT', store.singleEvent)

    const userEditor =
      currentUser.id == store.singleEvent.creatorID ? true : false

    const eventShows = store.singleEvent.shows
    const closestShow = getClosestShow(eventShows)
    const closestShowText = closestShow ? formatDate(closestShow) : null

    const calculateRating = shows => {
      if (shows.length > 0) {
        let counter = 0
        const rating = shows.reduce((total, item) => {
          if (item.rating) {
            counter++
            return total + item.rating
          } else {
            return total
          }
        }, 0)
        const avgRating = counter == 0 ? 5 : rating / counter
        return avgRating
      } else return 5
    }

    const chooseCategory = value => {
      selectedCategory = value[0]
    }

    const saveData = field => {
      if (field === 'title') {
        store.updateEvent(store.singleEvent.id, {
          field: 'name',
          value: eventTitle,
        })
      }
      if (field === 'description') {
        store.updateEvent(store.singleEvent.id, {
          field: 'description',
          value: eventDescription,
        })
      }
      if (field === 'categoryID') {
        store.updateEvent(store.singleEvent.id, {
          field: 'categoryID',
          value: selectedCategory,
        })
        setEventCategory(getCategoryNameByID(selectedCategory, categories))
      }
      if (field === 'price') {
        store.updateEvent(store.singleEvent.id, {
          field: 'price',
          value: eventPrice,
        })
      }
    }
    const updateEventImage = (imageURL, field) => {
      store.updateEvent(store.singleEvent.id, {
        field: field,
        value: imageURL,
      })
    }
    const getCategoryIDbyName = (catName, categories, lang) => {
      return categories.find(cat => cat.name_en == catName).id
    }
    const getCategoryNameByID = (catID, categories, lang) => {
      return categories.find(cat => cat.id == catID).name_en
    }
    useEffect(() => {
      const getEvent = async () => {
        await store.getEventById(eventID)
        setEventTitle(store.singleEvent.name)
        setEventDescription(store.singleEvent.description)
        const eventCategory = categories.find(
          cat => cat.id == store.singleEvent.categoryID
        ).name_en
        setEventCategory(eventCategory)
        setEventPrice(store.singleEvent.price)
        theEventRating = calculateRating(store.singleEvent.shows)
        const creatorDetalis = await store.getCreatorById(
          store.singleEvent.creatorID
        )
        setCreatorDetalis(creatorDetalis.data.Data)
        console.log('CCCCREATOR', creatorDetalis)
      }

      getEvent()
    }, [])

    return (
      <>
        <ImageUplaod
          src={store.singleEvent.coverImgURL}
          alt={store.singleEvent.name}
          isEdit={userEditor}
          updateFunction={updateEventImage}
          field='coverImgURL'
        />
        <div className='spacer'>&nbsp;</div>
        <MDBContainer>
          <MDBRow>
            <MDBCol md='6'>
              {/*  EVENT NAME  */}
              <SwitchField
                showComponent={
                  <MDBTypography
                    className='inline'
                    tag='h2'
                    variant='h2-responsive'
                  >
                    <strong>{store.singleEvent.name}</strong>
                  </MDBTypography>
                }
                editComponent={
                  <MDBInput
                    group={false}
                    className='input-small'
                    size='sm'
                    label='Edit event name'
                    getValue={value => setEventTitle(value)}
                    value={eventTitle}
                  />
                }
                updateFunction={saveData}
                fieldToUpdate='title'
                isActive={userEditor}
              />

              <MDBTypography tag='h3' variant='h3-responsive'>
                By {creatorDetalis.username}
              </MDBTypography>
              <hr />
              <Rating rating={5} />
              <hr />
              {/* EVENT DESCRIPTION  */}
              <SwitchField
                showComponent={
                  <p className='inline'>{store.singleEvent.description}</p>
                }
                editComponent={
                  <MDBInput
                    type='textarea'
                    label='Edit event description'
                    rows='5'
                    getValue={value => setEventDescription(value)}
                    value={eventDescription}
                  />
                }
                updateFunction={saveData}
                fieldToUpdate='description'
                isActive={userEditor}
              />
              <hr />
              {/* EVENT CATEGORY */}
              <SwitchField
                showComponent={
                  <MDBTypography
                    className='inline'
                    tag='h4'
                    variant='h4-responsive'
                  >
                    <strong>{eventCategory}</strong>
                  </MDBTypography>
                }
                editComponent={
                  <MDBSelect
                    options={categories.map(cat => ({
                      text: cat.name_en,
                      value: cat.id,
                    }))}
                    selected={eventCategory}
                    label='Select category'
                    getValue={chooseCategory}
                  />
                }
                updateFunction={saveData}
                fieldToUpdate='categoryID'
                isActive={userEditor}
              />
              <hr />
              {/*  EVENT PRICE  */}
              <SwitchField
                showComponent={
                  <MDBTypography
                    className='inline'
                    tag='h2'
                    variant='h2-responsive'
                  >
                    Price: $<strong>{eventPrice}</strong>
                  </MDBTypography>
                }
                editComponent={
                  <MDBInput
                    group={false}
                    className='input-small'
                    size='sm'
                    label='Edit event price'
                    getValue={value => setEventPrice(value)}
                    value={eventPrice}
                  />
                }
                updateFunction={saveData}
                fieldToUpdate='price'
                isActive={userEditor}
              />
              <br />
              <br />
              <MDBTypography
                className='inline'
                tag='h4'
                variant='h4-responsive'
              >
                Next Screen On: {closestShowText}
              </MDBTypography>
            </MDBCol>

            <MDBCol className='make-all-center' md='6'>
              <MDBTypography
                className='inline'
                tag='h2'
                variant='h2-responsive'
                className='text-center'
              >
                About The Screenter
                <br />
                <br />
              </MDBTypography>
              <div className='event-creator-card'>
                <CreatorCard creatorDetails={creatorDetalis} />
              </div>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
        <div className='spacer'>&nbsp;</div>

        <MDBContainer>
          <MDBRow>
            <MDBCol>
              <MDBTypography tag='h2' variant='h3-responsive'>
                <strong>BOOK A LIVE SHOW:</strong>
              </MDBTypography>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol>
              <MyCalendar
                currentUser={currentUser}
                shows={formatShows(store.singleEvent.shows ,store.singleEvent.name)}
                currentEvent={store.singleEvent}
                isEventPage={true}
                showPrice={store.singleEvent.price}
                userEditor={userEditor}
              />
            </MDBCol>
          </MDBRow>
        </MDBContainer>
        <div className='spacer'>&nbsp;</div>
        <MDBContainer>
          <MDBRow>
            <MDBCol>
              <MDBTypography tag='h3' variant='h3-responsive'>
                MORE EVENTS YOU'LL LOVE :
              </MDBTypography>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol>
              <CreatorEventList
                isOwner={false}
                events={props.eventsStores.listOfEvents.slice(0, 3)}
              />
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </>
    )
  })
)

export default EventPage
