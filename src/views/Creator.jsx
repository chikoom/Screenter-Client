import React, { useState, useEffect } from 'react'
import { observer, inject } from 'mobx-react'
import { useHistory } from 'react-router-dom'
import ImageUplaod from '../components/Inputs/ImageUpload'
import CreatorBackground from '../components/Profile/Creator/CreatorBackground/CreatorBackground'
import { MDBContainer, MDBRow, MDBCol, MDBTypography, MDBInput, MDBBtn, toast, ToastContainer } from 'mdbreact'
import { useAuth0 } from '@auth0/auth0-react';
import CreatorEventList from '../components/CreatorEventList';
import Reviews from '../components/Reviews/Reviews';
import Request from 'request';
import config from "../../src/auth_config.json";


const Creator = inject('generalStore', 'creatorStore')(
  observer(props => {
    const { user, getAccessTokenSilently } = useAuth0();
    const [isOwner, setIsOwner] = useState(false);
    const [creator, setCreator] = useState({});
    const [assosiatedReviwes, setAssosiatedReviews] = useState([])
    const [reviewHeaderInput, setReviewHeaderInput] = useState("")
    const [reviewContentInput, setReviewContentInput] = useState("");
    const history = useHistory()

    console.log(props.generalStore.currentUser);
    
    useEffect(() => {
      const getProfile = async () => {
        console.log(unescape(props.match.params.id));
        console.log(unescape(user.sub));
        if (unescape(props.match.params.id) === unescape(user.sub)) {
          setIsOwner(true)
        }
        setCreator(await props.generalStore.getCreatorById(props.match.params.id))
        await props.generalStore.checkUserInDataBase(user);
        await props.creatorStore.setCreatorReviews(props.match.params.id);
      }
      getProfile();
    }, [])

    const saveImage = (source, field) => {
      props.creatorStore.updateCreator(creator.data.Data.id, {
        field: "imageURL",
        value: source
      });
      // changeImageOnAuth0(source);
    }

    const changeImageOnAuth0 = async source => {
      const token = await getAccessTokenSilently()
      var options = {
        method: 'PATCH',
        url: `${config.audience}users/${user.sub}`,
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${token}`,
          'cache-control': 'no-cache',
          "Access-Control-Allow-Origin": "127.0.0.1:3000"
        },
        body: `{"picture": ${source}}`,
        json: true
      };
      
      Request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
      });
    }

    const handleReviewHeader = ({ target }) => {
      setReviewHeaderInput(target.value)
    }

    const handleReviewContent = ({ target }) => {
      setReviewContentInput(target.value)
    }

    const addReview = async() => {
      props.creatorStore.addReviewToCreator(reviewHeaderInput, reviewContentInput, creator.data.Data.id, escape(user.sub));
      setReviewContentInput("");
      setReviewHeaderInput("");
      toast.info('Your review is pending approval, Thank you :)', {
        closeButton: false
      });
    }

    const backToUser = () => {
      history.push(`/user/${user.sub}`)
    }

    return (
      creator.data ? (
      <React.Fragment>
        <MDBContainer className='mt-3'>
          <MDBRow className='mt-0'>
            <MDBCol md="4">
              <ImageUplaod
                src={creator.data.Data.imageURL}
                alt={creator.data.Data.username}
                isEdit={isOwner}
                updateFunction={saveImage}
              />
          </MDBCol>
          <MDBCol md="8">
            <CreatorBackground isEdit={isOwner} creator={creator} />
            {isOwner ? (
              <MDBBtn onClick={backToUser} color="primary">Back to watcher's mode</MDBBtn>
            ) : null}
          </MDBCol>
          </MDBRow>
          <MDBRow className='mt-0'>
            {creator.data.Events.length > -1 ? (
              <>
                <MDBTypography variant="h2" tag='h2'>Events:</MDBTypography>
                <CreatorEventList history={props.history} creator={creator} events={creator.data.Events} isOwner={isOwner}/>
              </>
            ):(
              <>
                <MDBTypography variant="h2" tag='h2'>This user has no events yet..</MDBTypography>
                <div className="spacer">&nbsp;</div>
              </>
            )}
          </MDBRow>
          <MDBRow className='mt-0'>
            {props.creatorStore.singleCreator.reviews.length ? (
              <>
                <MDBTypography variant="h2" tag='h2'>Reviews:</MDBTypography>
                <Reviews reviews={props.creatorStore.singleCreator.reviews}/>
              </>
            ):(
              <>
                <MDBTypography variant="h2" tag='h2'>This user has no reviews yet..</MDBTypography>
                <div className="spacer">&nbsp;</div>
              </>
            )
            }
          </MDBRow>
          {!isOwner ? (
            <MDBContainer className="review-container mt-1">
              <MDBTypography className="center" variant="h2" tag='h2'>Add Review</MDBTypography>
              <br />
              <MDBInput value={reviewHeaderInput} onChange={handleReviewHeader} type="text" label="Heading" />
              <br />
              <MDBInput value={reviewContentInput} onChange={handleReviewContent} type="textarea" label="Your Review.." rows="2" />
              <MDBBtn onClick={addReview} color="primary">Submit</MDBBtn>
              <ToastContainer
                hideProgressBar={true}
                newestOnTop={true}
                autoClose={5000}
              />
            </MDBContainer>
          ) : null}
        </MDBContainer>
      </React.Fragment>
      ): null
    )
  })
)

export default Creator
