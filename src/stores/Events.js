import { observable, action, computed, get } from 'mobx'
import { Event } from './Event'
import { Show } from './Show'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

export class Events {
  @observable listOfEvents = []
  @observable creators = []
  @observable hashtags = []
  @observable categories = []
  constructor() {
    this.init()
  }
  init = async () => {
    await this.getAllEvents()
    // this.addShow({id:null , startTime:"2020-11-11T21:20:06.505Z" , endTime : "2020-11-11T21:21:06.505Z" ,showEventID: 18})
    // this.deleteShow(170 ,3)
  }
  @action async getAllEvents() {
    let getData = await axios.get('http://localhost:8080/api/events')
    console.log(this.listOfEvents)
    for (let d of getData.data) {
      let counter = 0
      const rating = d.shows.reduce((total, item) => {
        if (item.rating) {
          counter++
          return total + item.rating
        } else {
          return total
        }
      }, 0)
      const avgRating = counter == 0 ? 5 : rating / counter
      this.listOfEvents.push(
        new Event(
          d.id,
          d.name,
          d.description,
          d.imageURL,
          d.videoURL,
          d.coverImgURL,
          d.price,
          d.creatorID,
          d.categoryID,
          avgRating,
          d.shows
        )
      )
    }
  }

  @action async addEvent(creatorID) {
    const result = await axios.post(
      'http://localhost:8080/api/events/event',
      new Event(
        null,
        uuidv4().toString(),
        null,
        null,
        null,
        'https://res.cloudinary.com/chikoom/image/upload/v1599403857/screentersClients/demo-image-default_g3alve.jpg',
        0,
        creatorID,
        1,
        null,
        null
      )
    )
    const event = result.data
    const newEvent = new Event(
      event.id,
      event.name,
      event.description,
      event.imageURL,
      event.videoURL,
      event.coverImgURL,
      event.price,
      event.creatorID,
      event.categoryID,
      event.rating,
      []
    )
    this.listOfEvents.push(newEvent)
    return result
  }

  @action async addShow(showData) {
    console.log(showData)
    let addNewShow = await axios.post(
      `http://localhost:8080/api/events/show`,
      showData
    )
    console.log(addNewShow)
    if (addNewShow.data) {
      console.log(this.listOfEvents)

      const indexHolder = this.listOfEvents.findIndex(
        event => event.id === addNewShow.data.showEventID
      )
      console.log(indexHolder)
      this.listOfEvents[indexHolder].shows.push(addNewShow.data)
      console.log(this.listOfEvents)
    } else {
      console.log('error')
    }
  }
  @action async deleteShow(showId, eventId) {
    let deleteShow = await axios.delete(
      `http://localhost:8080/api/events?showId=${showId}`
    )
    console.log(deleteShow)

    if (deleteShow) {
      const indexHolder = this.listOfEvents.findIndex(
        event => event.id === eventId
      )
      console.log(indexHolder)
      let deleteShowFromEvent = this.listOfEvents[indexHolder].shows.findIndex(
        show => show.id === showId
      )
      console.log(deleteShowFromEvent)
      let deleteTheShow = this.listOfEvents[indexHolder].shows.splice(
        deleteShowFromEvent,
        1
      )
      console.log(this.listOfEvents[indexHolder].shows)
      console.log(deleteTheShow)
    } else {
      console.log('error')
    }
  }
}
