import React, { useReducer } from 'react'
import { MDBContainer, MDBRow, MDBCol } from 'mdbreact'
import EventCard from './EventCard/EventCard'
import SelectBox from './Inputs/SelectBox'
import { inject, observer } from 'mobx-react'
import AutoComplete from './Inputs/AutoComplete'
import {
  useFetch,
  useInfiniteScroll,
  useLazyLoading,
} from '../utils/customHooks'

// import './App.css' //Import here your file style

const selectOptions = ['Date', 'Popularity', 'Screenter']

const EventGrid = inject('eventsStores')(
  observer(props => {
    const events = props.eventsStores.listOfEvents

    const pageReducer = (state, action) => {
      switch (action.type) {
        case 'ADVANCE_PAGE':
          return { ...state, page: state.page + 1 }
        default:
          return state
      }
    }

    const [pager, pagerDispatch] = useReducer(pageReducer, { page: 0 })

    let bottomBoundaryRef = useRef(null)
    useFetch(pager, imgDispatch)
    useInfiniteScroll(bottomBoundaryRef, pagerDispatch)

    return (
      <>
        <MDBContainer>
          <MDBRow>
            <MDBCol lg='10'>
              <AutoComplete />
            </MDBCol>
            <MDBCol lg='2'>
              <SelectBox optionList={selectOptions} />
            </MDBCol>
          </MDBRow>
        </MDBContainer>
        <MDBContainer>
          <MDBRow>
            {events.map(event => (
              <MDBCol lg='4' md='6'>
                <EventCard isEdit={false} eventDetails={event} />
              </MDBCol>
            ))}
          </MDBRow>
        </MDBContainer>
        <div
          id='page-bottom-boundary'
          style={{ border: '1px solid red' }}
          ref={bottomBoundaryRef}
        ></div>
      </>
    )
  })
)

export default EventGrid
