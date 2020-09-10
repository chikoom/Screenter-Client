import { observable, action, computed } from 'mobx'
import axios from 'axios'
import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Show } from './Show'
import { Events } from './Events'
import { User } from './User'

export class GeneralStore {

    @observable categories = []
    @observable creators
    @observable hashtags = []
    @observable AllCreators = []
    @observable currentUser = {}
    @observable singleEvent = {
        shows: [],
    }
    @observable singleCreator = {
        reviews: []
    }

    constructor(listOfEvents) {
        this.listOfEvents = listOfEvents
        this.init()
    }
    init = async () => {
        this.gelAllCategories()
        this.getAllCreators()
    }
    @action async gelAllCategories() {
        let gelAllCategories = await axios.get(
            `${process.env.REACT_APP_PROD_URL}/api/creators/general/details`
        )
        console.log(gelAllCategories.data.categories)
        if(!this.categories.length) {
            gelAllCategories.data.categories.forEach(c => {
                this.categories.push(c)
            })
        }
    }

    @action async getUserById(userId) {
        let getUserById = await axios.get(`${process.env.REACT_APP_PROD_URL}/api/users/${userId}`)
        return getUserById
    }


    ////////////////SHOWS///////////////////////////


    @action async addShow(showData) {
        console.log(showData)
        let addNewShow = await axios.post(`${process.env.REACT_APP_PROD_URL}/api/events/show`, showData)
        console.log(addNewShow)
        this.singleEvent.shows.push(addNewShow.data)
        let currentShowId = addNewShow.data.id
        const userID = this.currentUser.id
        console.log(userID)
        let dataAboutTheShow = {
            creator : userID,
            startTime : addNewShow.data.startTime,
            endTime : addNewShow.data.endTime,
            participants : []
        }
        let addUserToMongoose = await axios.post(`https://screenters-vsv.herokuapp.com/broadCast/${currentShowId}` , dataAboutTheShow)
        console.log(addUserToMongoose)
    }


    @action async deleteShow(showId, eventId) {
        let deleteShow = await axios.delete(`${process.env.REACT_APP_PROD_URL}/api/events?showId=${showId}`)
        console.log(deleteShow)
        if (deleteShow){
            let deleteShowIndex = this.singleEvent.shows.findIndex(show => parseInt(show.id) === parseInt(showId))
            console.log(deleteShowIndex)
            let deleteTheShow = this.singleEvent.shows.splice(deleteShowIndex, 1)
            console.log(deleteTheShow)
        } else {
            console.log("error")
        }
    }




    /////////////////User Auth/////////////////////




    @action async checkUserInDataBase(user) {
        const userId = user.sub
        const returnedUser = await axios.get(`${process.env.REACT_APP_PROD_URL}/api/users/${userId}`)
        if (returnedUser.data) {
            // id, firstName, lastName, username, imageURL, videoURL, email,
            //  birthday, memberSince, gender, about, userRole, isAuthorized, phone
            this.currentUser = new User(
                returnedUser.data.id , 
                returnedUser.data.firstName || null ,
                returnedUser.data.lastName || null ,
                returnedUser.data.username || null  ,
                returnedUser.data.imageURL || null ,
                returnedUser.data.videoURL || null ,
                returnedUser.data.email || null  ,
                returnedUser.data.birthday || null ,
                returnedUser.data.memberSince || null ,
                returnedUser.data.gender || null ,
                returnedUser.data.about || null ,
                returnedUser.data.userRole || null ,
                returnedUser.data.isAuthorized || null ,
                returnedUser.data.phone || null ,
                returnedUser.data.futureShows || null ,
                returnedUser.data.pastShows || null 
                )
                
            console.log(this.currentUser)
        }
        else {
            this.addUser(user)
            console.log("Adding new User")
        }
    }

    @action async addUser(userData) {
        let insertUsesData = new User(
            userData.sub,
            userData.given_name || null,
            userData.family_name || null,
            userData.nickname,
            userData.picture,
            null,
            userData.email,
            null,
            userData.updated_at,
            null,
            null,
            'USER',
            null,
            null,
            null,
            null,

        )
        console.log(insertUsesData)

        let userDetails = await axios.post(`${process.env.REACT_APP_PROD_URL}/api/users`, insertUsesData)
        console.log(userDetails)
        if (userDetails.data) {
            this.currentUser = userDetails.data
        }else{
            console.log("problem with the current user")
        }
    }

    @action async getAllCreators() {
        let getAllCreators = await axios.get(`${process.env.REACT_APP_PROD_URL}/api/creators?isEvents=1&isShows=1`)
        this.AllCreators = [...getAllCreators.data]
    }

    @action async getCreatorById(creatorId) {
        let getCreatorById = await axios.get(`${process.env.REACT_APP_PROD_URL}/api/creators/${creatorId}`)
        return getCreatorById
    }


    /////////////////////EVENTS///////////////////






    @action async getEventById(eventId) {
        let getEventById = await axios.get(
            `${process.env.REACT_APP_PROD_URL}/api/events/${eventId}`
        )
        getEventById = getEventById.data
        this.singleEvent = getEventById
        return getEventById;
    }


    @action async deleteEvent(eventId) {
        let deleteEvent = await axios.delete(`${process.env.REACT_APP_PROD_URL}/api/events?eventId=${eventId}`)
        let deleteEventFromList = this.listOfEvents.listOfEvents.findindex(deleteId => deleteId.id === eventId)
        this.listOfEvents.listOfEvents.splice(deleteEventFromList, 1)
    }



    @action async updateEvent(eventId, eventData) {

        let updateEvent = await axios.put(`${process.env.REACT_APP_PROD_URL}/api/events/${eventId}`, eventData)
        if (updateEvent.data) {
            let key = eventData.field

            let value = eventData.value
            this.singleEvent[key] = value;
            let toUpdate = this.listOfEvents.listOfEvents.findIndex(eventUpdate => eventUpdate.id === eventId)

            // console.log(toUpdate)
            this.listOfEvents.listOfEvents[toUpdate][key] = value
            console.log(this.listOfEvents.listOfEvents)
        } else {
            console.log("error")
        }
    }



    /////////COMMENT REVIEW SECTION /////




    @action async postReviewShows(showId, showReview) {
        let result = await axios.post(`${process.env.REACT_APP_PROD_URL}/api/reviews/show`)
        console.log(result)
    }

    @action async getReviewShows(reviewId) {
        let result = await axios.get(`${process.env.REACT_APP_PROD_URL}/api/reviews/${reviewId}`)
        console.log(result)
    }


    @action async getReviewCreator(reviewId) {
        let result = await axios.get(`${process.env.REACT_APP_PROD_URL}/api/reviews/${reviewId}`)
        console.log(result)
    }

    @action async postReviewCreator(creatorId, creatorReview) {
        //userId , showId , review data to save in this store 
        let result = await axios.post(`${process.env.REACT_APP_PROD_URL}/api/reviews/creator`)
        console.log(result)
    }

}
