import { observable, action, computed } from 'mobx'
import axios from 'axios'
import { Show } from './Show'
import { Comment } from './Comment'

export class User {
    @observable id
    @observable firstName
    @observable lastName
    @observable imageURL
    @observable memberSince
    @observable isAuthorized
    @observable birthday
    @observable username
    @observable email
    @observable phone
    @observable gender
    @observable userRole
    @observable videoURL
    @observable about
    @observable futureShows = []
    @observable pastShows = []


    constructor(id, firstName, lastName, username, imageURL, videoURL, email, birthday, memberSince, gender, about, userRole, isAuthorized, phone, futureShows, pastShows) {
        this.id = id
        this.firstName = firstName
        this.lastName = lastName
        this.imageURL = imageURL
        this.memberSince = memberSince
        this.isAuthorized = isAuthorized
        this.username = username
        this.email = email
        this.phone = phone
        this.gender = gender
        this.userRole = userRole
        this.birthday = birthday
        this.videoURL = videoURL
        this.about = about
        this.futureShows = futureShows || []
        this.pastShows = pastShows || []
        // this.init()
    }





    @action async deleteUser(userId) {
        let deleteUser = await axios.delete(`http://localhost:8080/api/users/${userId}`)
    }
    @action async updateUser(userId, data) {
        let updateUser = await axios.put(`http://localhost:8080/api/users/${userId}`, data)
    }
    ////////////////BOOK SHOW///////////////////
    @action async bookShow(showID) {
        const userID = this.id
        console.log({ userID, showID })
        let resultShowFromDB = await axios.post(`http://localhost:8080/api/users/show`, { userID, showID })
        console.log(resultShowFromDB.data)

        if (resultShowFromDB.data !== "saving error") {
            const pushToFutureShowArray = this.futureShows.push(
                {
                    id: resultShowFromDB.data.id,
                    startTime: resultShowFromDB.data.id,
                    endTime: resultShowFromDB.data.endTime,
                    showEventID: resultShowFromDB.data.showEventID
                }
            )
                
        } else {
            alert("you all ready book to this show")
        }


    }

    @action async unBookShow(showID) {
        const userID = this.id
        let resultShowFromDB = await axios.delete(`http://localhost:8080/api/users/show/${userID}/${showID}`)
        console.log(resultShowFromDB.data)
        const showIndex = this.futureShows.findIndex(show => parseInt(show.id) === parseInt(showID))
        this.futureShows.splice(showIndex, 1)
    }


    /////////COMMENT REVIEW SECTION /////
    @action async getReviewShows(reviewId) {
        let result = await axios.get(`http://localhost:8080/api/reviews/${reviewId}`)
        console.log(result)
    }

    @action async postReviewShows(creatorId, showReview) {
        //userId , showId , review data to save in this store 
        let result = await axios.post(`http://localhost:8080/api/reviews/show`)
        console.log(result)
    }

    @action async getReviewCreator(reviewId) {
        let result = await axios.get(`http://localhost:8080/api/reviews/${reviewId}`)
        console.log(result)
    }

    @action async postReviewCreator(creatorId, creatorReview) {
        //userId , showId , review data to save in this store 
        let result = await axios.post(`http://localhost:8080/api/reviews/creator`)
        console.log(result)
    }
}