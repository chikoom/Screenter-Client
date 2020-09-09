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
  @observable singleCreator = {
    reviews: []
  }
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
      `${process.env.REACT_APP_PROD_URL}/api/events/event`,
      eventData
    )
    this.newEvents.push(eventData)
  }

  ///SHOWS ACTION
  @action async addShow(eventId, creatorId, showData) {
    let addNewShow = await axios.post(
      `${process.env.REACT_APP_PROD_URL}/api/events/${eventId}/${creatorId}`,
      showData
    )
  }
  @action async deleteShow(eventId, creatorId, showId) {
    let deleteShow = await axios.delete(
      `${process.env.REACT_APP_PROD_URL}/api/events/${eventId}/${creatorId}`,
      showId
    )
  }
  @action async updateShow(eventId, creatorId, showData) {
    let updateShow = await axios.put(
      `${process.env.REACT_APP_PROD_URL}/api/events/${eventId}/${creatorId}`,
      showData
    )
  }

  ///CREATOR ACTIONS
  @action async getCreators() {
    let getCreators = await axios.get(`${process.env.REACT_APP_PROD_URL}/api/creators`)
    console.log(getCreators.data)
  }
  @action async addCreator(creatorId) {
    let addCreator = await axios.post(
      `${process.env.REACT_APP_PROD_URL}/api/creators/${creatorId}`
    )
  }
  @action async deleteCreator(creatorId) {
    let deleteCreator = await axios.delete(
      `${process.env.REACT_APP_PROD_URL}/api/creators/${creatorId}`
    )
  }
  @action async updateCreator(creatorId, data) {
    let updateCreator = await axios.put(
      `${process.env.REACT_APP_PROD_URL}/api/creators/${creatorId}`,
      data
    )
    
  }

  @action async getUser() {
    let Users = await axios.get(`${process.env.REACT_APP_PROD_URL}/api/users`)
    console.log(Users.data)
  }

  @action async setCreatorReviews(creatorId) {
    const { data } = await axios.get(`${process.env.REACT_APP_PROD_URL}/api/creators/${creatorId}`)
    this.singleCreator.reviews = data.Reviews;
}

  @action async addReviewToCreator(
    header,
    text,
    reviewCreatorID,
    reviewUserID
  ) {
    this.singleCreator.reviews.push(await axios.post(`${process.env.REACT_APP_PROD_URL}/api/reviews/creator`, {
      id: null,
      header,
      text,
      reviewUserID,
      reviewCreatorID,
      time: Date.now(),
      parentReview: null,
    }))
  }
}
