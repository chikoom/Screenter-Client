import React, {useState, useEffect} from 'react';
import { MDBCol, MDBTypography, MDBBox, MDBInput } from "mdbreact";
import SwithField from '../../../Inputs/SwitchField'
import { inject, observer } from 'mobx-react'
import Rating from '../../../Inputs/Rating'
import './CreatorBackground.css'

const CreatorBackground = inject("creatorStore")(observer(props => {
    const creatorData = props.creator.data ? props.creator.data.Data : {};   

    const [about, setAbout] = useState(creatorData.about)
    const [email, setEmail] = useState(creatorData.email)
    const [birthday, setBirthday] = useState(creatorData.birthday)
    const [phone, setPhone] = useState(creatorData.phone)
    const [username, setUsername] = useState(creatorData.username)
    const [firstName, setFirstName] = useState(creatorData.firstName)
    const [lastName, setLastName] = useState(creatorData.lastName)

    useEffect(() => {
          setAbout(creatorData.about)
          setEmail(creatorData.email)
          setBirthday(creatorData.birthday)
          setPhone(creatorData.phone)
          setUsername(creatorData.username)   
          setFirstName(creatorData.firstName) 
          setLastName(creatorData.lastName)     
      }, [creatorData])
      
      
    const saveData = field => {
        if (field === 'about') {
          props.creatorStore.updateCreator(creatorData.id, {
            field: 'about',
            value: about,
          })
        }
        if (field === 'email') {
            props.creatorStore.updateCreator(creatorData.id, {
              field: 'email',
              value: email,
            })
          }
          if (field === 'birthday') {
            props.creatorStore.updateCreator(creatorData.id, {
              field: 'birthday',
              value: birthday,
            })
          }
          if (field === 'phone') {
            props.creatorStore.updateCreator(creatorData.id, {
              field: 'phone',
              value: phone,
            })
          }
          if (field === 'username') {
            props.creatorStore.updateCreator(creatorData.id, {
              field: 'username',
              value: username,
            })
          }
          if (field === 'firstName') {
            props.creatorStore.updateCreator(creatorData.id, {
              field: 'firstName',
              value: firstName,
            })
          }
          if (field === 'lastName') {
            props.creatorStore.updateCreator(creatorData.id, {
              field: 'lastName',
              value: lastName,
            })
          }

      }
  

    return (
        <React.Fragment>
            <MDBCol md="7">
                <SwithField
                    showComponent={
                    <MDBBox tag='h1' className='lead inline'>
                        <MDBTypography className="inline" variant="h1" tag='h1'>{username}</MDBTypography>
                    </MDBBox>
                    }
                    editComponent={
                        <MDBInput
                        group={false}
                        className='input-small'
                        size='sm'
                        label='Edit Username'
                        getValue={value => setUsername(value)}
                        value={username}
                        />                        
                    }
                    updateFunction={saveData}
                    fieldToUpdate='username'
                    isActive={props.isEdit}
                />
                <br/>
                <SwithField
                    showComponent={
                    <MDBBox tag='h1' className='lead inline'>
                        <MDBTypography className="inline" variant="h1" tag='h1'>{firstName}</MDBTypography>
                    </MDBBox>
                    }
                    editComponent={
                        <MDBInput
                        group={false}
                        className='input-small'
                        size='sm'
                        label='Edit First Name'
                        getValue={value => setFirstName(value)}
                        value={firstName}
                        />                        
                    }
                    updateFunction={saveData}
                    fieldToUpdate='firstName'
                    isActive={props.isEdit}
                />
                <br />
                <SwithField
                    showComponent={
                    <MDBBox tag='h1' className='lead inline'>
                        <MDBTypography className="inline" variant="h1" tag='h1'>{lastName}</MDBTypography>
                    </MDBBox>
                    }
                    editComponent={
                        <MDBInput
                        group={false}
                        className='input-small'
                        size='sm'
                        label='Edit Last Name'
                        getValue={value => setLastName(value)}
                        value={lastName}
                        />                        
                    }
                    updateFunction={saveData}
                    fieldToUpdate='lastName'
                    isActive={props.isEdit}
                />
                <br />
                <Rating rating={props.creator.data.Rating || 0}/>
                <div>
                    <SwithField
                        showComponent={
                        <MDBBox tag='p' className='lead inline'>
                            <strong>About:</strong> {about}
                        </MDBBox>
                        }
                        editComponent={
                            <MDBInput
                            group={false}
                            className='input-small'
                            size='sm'
                            label='Edit About'
                            getValue={value => setAbout(value)}
                            value={about}
                          />                        
                        }
                        updateFunction={saveData}
                        fieldToUpdate='about'
                        isActive={props.isEdit}
                    />
                    <br />
                    <SwithField
                        showComponent={
                        <MDBBox tag='p' className='lead inline'>
                            <strong>Email:</strong> {email}
                        </MDBBox>
                        }
                        editComponent={
                            <MDBInput
                            group={false}
                            className='input-small'
                            size='sm'
                            label='Edit email'
                            getValue={value => setEmail(value)}
                            value={email}
                          />                        
                        }
                        updateFunction={saveData}
                        fieldToUpdate='email'
                        isActive={props.isEdit}
                    />
                    <br />
                    <SwithField
                        showComponent={
                        <MDBBox tag='p' className='lead inline'>
                            <strong>Birthday:</strong> {birthday}
                        </MDBBox>
                        }
                        editComponent={
                            <MDBInput
                            group={false}
                            className='input-small'
                            size='sm'
                            label='Edit birthday'
                            getValue={value => setBirthday(value)}
                            value={birthday}
                          />                        
                        }
                        updateFunction={saveData}
                        fieldToUpdate='birthday'
                        isActive={props.isEdit}
                    />
                    <br />
                    <SwithField
                        showComponent={
                        <MDBBox tag='p' className='lead inline'>
                            <strong>Phone:</strong> {phone}
                        </MDBBox>
                        }
                        editComponent={
                            <MDBInput
                            group={false}
                            className='input-small'
                            size='sm'
                            label='Edit Phone'
                            getValue={value => setPhone(value)}
                            value={phone}
                          />                        
                        }
                        updateFunction={saveData}
                        fieldToUpdate='phone'
                        isActive={props.isEdit}
                    />
                </div>
            </MDBCol>
        </React.Fragment>
    )
}))


export default CreatorBackground