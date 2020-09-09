import React, { useState } from 'react'
import { useEffect } from 'react'
import StarRatings from 'react-star-ratings'

const EndShowRatings = props => {
  const [rating, setRating] = useState(0)

  const changeRating = (newRating, name) => {
    setRating(newRating)
  }

  useEffect(() => {}, [])

  return (
    <StarRatings
      rating={rating}
      starRatedColor='orange'
      numberOfStars={5}
      name='rating'
      starDimension='40px'
      starSpacing='5px'
      changeRating={setRating}
    />
  )
}

export default EndShowRatings
