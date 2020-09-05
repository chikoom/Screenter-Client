import { observable, action, computed } from 'mobx'
import { User } from './User'
import { Event } from './Event'
import { Show } from './Show'
import axios from 'axios'

export class Creator extends User {
  @observable creatorID
  @observable rating
  @observable newEvents = []
  @observable oldEvents = []
  @observable comments = []
  @observable statistics
  // @observable creatorData = {about: "gfdgdfg",birthday: "0000-00-00",email: "helloWorld@dailymotion.com", firstName: "sergei", id: "17", imageURL: "http://dummyimage.com/114x207.jpg/5fa2dd/ffffff", isAuthorized: 0,  lastName: "shay",memberSince: null,    phone: "0528228640", userRole: "CREATOR", username: "condrich0",  videoURL: "DLIv5F-dLrY"}
  // @observable eventData = {categoryID: 1, coverImgURL: "https://img.wcdn.co.il/f_auto,w_1200,t_54/9/0/0/8/900829-46.jpg", creatorID: "facebook%7C3768160376546114",  description: "ajsdhasd", hashtags: [], id: 3,   imageURL: "http://dummyimage.com/206x164.jpg/dddddd/000000", name: "AssiCohenShauliShow", price: 180, shows :[], videoURL: "http://dummyimage.com/206x164.jpg/dddddd/000000" }
  constructor(
    id,
    firstName,
    lastName,
    username,
    imageURL,
    videoURL,
    email,
    birthday,
    memberSince,
    gender,
    about,
    userRole,
    isAuthorized,
    phone
  ) {
    super(
      id,
      firstName,
      lastName,
      username,
      imageURL,
      videoURL,
      email,
      birthday,
      memberSince,
      gender,
      about,
      userRole,
      isAuthorized,
      phone
    )
    // this.creatorID = creatorID
    // this.rating = rating

    this.eventData = {
      categoryID: 1,
      coverImgURL:
        'https://img.wcdn.co.il/f_auto,w_1200,t_54/9/0/0/8/900829-46.jpg',
      creatorID: 'facebook%7C3768160376546114',
      description: 'ajsdhasd',
      hashtags: [],
      id: null,
      imageURL: 'http://dummyimage.com/206x164.jpg/dddddd/000000',
      name: 'aq',
      price: 180,
      videoURL: 'http://dummyimage.com/206x164.jpg/dddddd/000000',
    }

    this.init()
  }
  init = async () => {
    // this.getCreators()
    this.getUser()
    // this.addNewEvent(this.eventData)
  }

  ///EVENTS ACTION
  @action async addNewEvent(eventData) {
    let addEvent = await axios.post(
      `http://localhost:8080/api/events/event`,
      eventData
    )
    this.newEvents.push(eventData)
  }

  @action async deleteEvent(eventId) {
    let deleteEvent = await axios.delete(
      `http://localhost:8080/api/events/${eventId}`
    )
    this.newEvents.find(deleteId => deleteId.eventID)
  }
  @action async updateEvent(eventId, eventData) {
    let updateEvent = await axios.put(
      `http://localhost:8080/api/events/${eventId}`,
      { eventData }
    )
  }

  ///SHOWS ACTION
  @action async addShow(eventId, creatorId, showData) {
    let addNewShow = await axios.post(
      `http://localhost:8080/api/events/${eventId}/${creatorId}`,
      { showData }
    )
  }
  @action async deleteShow(eventId, creatorId, showId) {
    let deleteShow = await axios.delete(
      `http://localhost:8080/api/events/${eventId}/${creatorId}`,
      showId
    )
  }
  @action async updateShow(eventId, creatorId, showData) {
    let updateShow = await axios.put(
      `http://localhost:8080/api/events/${eventId}/${creatorId}`,
      { showData }
    )
  }

  ///CREATOR ACTIONS
  @action async getCreators() {
    let getCreators = await axios.get(`http://localhost:8080/api/creators`)
    console.log(getCreators.data)
  }
  @action async addCreator(creatorId) {
    let addCreator = await axios.post(
      `http://localhost:8080/api/creators/${creatorId}`
    )
  }
  @action async deleteCreator(creatorId) {
    let deleteCreator = await axios.delete(
      `http://localhost:8080/api/creators/${creatorId}`
    )
  }
  @action async updateCreator(creatorId, data) {
    let updateCreator = await axios.put(
      `http://localhost:8080/api/creators/${creatorId}`,
      data
    )
  }

  @action async getUser() {
    let Users = await axios.get(`http://localhost:8080/api/users`)
    console.log(Users.data)
  }
}
