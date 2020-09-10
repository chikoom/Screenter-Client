import React, { useEffect } from 'react'
import { MDBContainer, MDBRow, MDBCol } from 'mdbreact'
import EventCard from '../EventCard/EventCard'
import SelectBox from '../Inputs/SelectBox'
import { inject, observer } from 'mobx-react'
import AutoComplete from '../Inputs/AutoComplete'
import DropdownSelect from '../Inputs/DropDown'
import { useState } from 'react'
import './EventList.css'

const selectOptions = ['Date', 'Popularity', 'Name']

const EventGrid = inject('generalStore')(props => {
  // const categories = props.generalStore.categories
  const [categories, setCategories] = useState([])
  const [eventList, setEventList] = useState([])

  useEffect(() => {
    setCategories(props.generalStore.categories)
    setEventList(props.eventList)
    console.log(props.eventList)
  }, [props.generalStore.categories, props.eventList])
  return (
    <>
      <MDBContainer>
        <MDBRow>
          <MDBCol className='align-middle' lg='8'>
            <AutoComplete
              list={props.eventNames}
              label={'Search event'}
              filterFunction={props.searchFunction}
            />
          </MDBCol>
          <MDBCol className='align-middle' lg='4'>
            <DropdownSelect
              label='Sort by'
              optionList={selectOptions}
              function={props.sortEvents}
            />
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <MDBContainer>
        <MDBRow className='masonry-with-columns-2'>
          {eventList.map(event => {
            event.categoryName = categories.find(
              cat => cat.id == event.categoryID
            ).name_en
            return (
              <MDBCol lg='4' md='6'>
                <EventCard isEdit={false} eventDetails={event} />
              </MDBCol>
            )
          })}
        </MDBRow>
      </MDBContainer>
    </>
  )
})

export default EventGrid
