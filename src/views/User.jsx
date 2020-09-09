import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { observer, inject } from 'mobx-react'
import ImageUplaod from '../components/Inputs/ImageUpload'
import { MDBContainer, MDBRow, MDBTypography, MDBCol, MDBBtn } from 'mdbreact'
import CreatorEventList from '../components/CreatorEventList'
import Show from '../components/Shows/Upcoming/Show'
import PastShow from '../components/Shows/Past/PastShow'
import Shows from '../components/Shows/Upcoming/Shows'
import { useAuth0 } from '@auth0/auth0-react'

const User = inject(
  'generalStore',
  'eventsStores',
  'creatorStore'
)(
  observer(props => {
    const { user } = useAuth0()
    const [isOwner, setIsOwner] = useState(false)
    const [userData, setUserData] = useState({})
    const history = useHistory()

    useEffect(() => {
      const getProfile = async () => {
        if (unescape(props.match.params.id) === unescape(user.sub)) {
          setIsOwner(true)
        }
        setUserData(await props.generalStore.getUserById(props.match.params.id))
      }
      getProfile()
    }, [])

    const becomeCreator = () => {
      props.creatorStore.updateUser(userData.data.id, {
        field: 'userRole',
        value: 'CREATOR',
      })
      history.push(`/creator/${userData.data.id}`)
    }

    const backToCreator = () => {
      history.push(`/creator/${user.sub}`)
    }

    const saveImage = (source, field) => {
      props.creatorStore.updateUser(userData.data.id, {
        field: 'imageURL',
        value: source,
      })
    }

    return userData.data ? (
      <React.Fragment>
        <MDBContainer className='mt-3'>
          <MDBRow className='mt-0'>
            <MDBCol md='4'>
              <ImageUplaod
                src={userData.data.imageURL}
                alt={userData.data.username}
                isEdit={isOwner}
                updateFunction={saveImage}
              />
            </MDBCol>
            <MDBCol
              className='center'
              md='8'
              style={{
                textAlign: 'left',
                paddingLeft: '50px',
              }}
            >
              <MDBTypography
                variant='h1'
                tag='h1'
                style={{
                  textAlign: 'left',
                  marginBottom: '30px',
                }}
              >
                {userData.data.username}
              </MDBTypography>
              {userData.data.userRole === 'USER' ? (
                <MDBBtn onClick={becomeCreator} color='primary'>
                  Beacome a Creator!
                </MDBBtn>
              ) : (
                <MDBBtn onClick={backToCreator} color='primary'>
                  Back to your Screenter page
                </MDBBtn>
              )}
            </MDBCol>
          </MDBRow>
          <MDBRow className='mt-0'>
            <MDBCol middle className='center' md='12'>
              {userData.data.futureShows.length ? (
                <>
                  <MDBTypography variant='h2' tag='h2'>
                    Upcoming Shows:
                  </MDBTypography>
                  <Shows kind='upcoming' shows={userData.data.futureShows} />
                </>
              ) : (
                <>
                  <MDBTypography
                    style={{
                      margin: '40px auto',
                      display: 'block',
                    }}
                    tag='h2'
                  >
                    Upcoming shows will appear below..
                  </MDBTypography>
                </>
              )}
            </MDBCol>
          </MDBRow>
          <MDBRow className='mt-0'>
            {userData.data.pastShows.length ? (
              <>
                <MDBTypography variant='h2' tag='h2'>
                  Past Shows:
                </MDBTypography>
                <div className='spacer'>&nbsp;</div>
                <Shows kind='past' shows={userData.data.pastShows} />
                <div className='spacer'>&nbsp;</div>
              </>
            ) : (
              <>
                <MDBTypography
                  style={{
                    margin: '40px auto',
                    display: 'block',
                    fontWeight: '300',
                  }}
                  tag='h2'
                >
                  Past attended shows will appear below..
                </MDBTypography>
              </>
            )}
          </MDBRow>
          <MDBRow>
            <MDBCol middle className='center' md='12'>
              <MDBTypography
                variant='h2'
                tag='h2'
                style={{
                  margin: '40px auto',
                  display: 'block',
                  borderBottom: '2px solid #222',
                  maxWidth: '350px',
                }}
              >
                More shows you'll love:
              </MDBTypography>
              <CreatorEventList
                isOwner={false}
                events={props.eventsStores.listOfEvents.slice(0, 3)}
              />
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </React.Fragment>
    ) : null
  })
)

export default User
