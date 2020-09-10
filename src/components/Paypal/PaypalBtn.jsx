import React from 'react'
import { MDBBtn } from 'mdbreact'
import { observer } from 'mobx-react'
import ReactPayPal from './Payment';
import './Paypal.css'

const Paypal = observer(props => {

  const [checkout, setCheckout] = React.useState(false);
  console.log(props.currentUser)

  return (
    <div className="paymentBtn">
      {(checkout === true)
        ? <div className="payment-div">
          <ReactPayPal currentUser={props.currentUser}
                      price={props.price}
                      show={props.show}
                      checkoutSwitch={props.checkoutSwitch}
          />
        </div>
        : <div>
          <MDBBtn
            id='qsCheckOutBtn'
            color='primary'
            className='btn-margin'
            onClick={() => { setCheckout(true) }}
          >
            Checkout
            </MDBBtn>
        </div>
      }
    </div>
  );
})

export default Paypal



