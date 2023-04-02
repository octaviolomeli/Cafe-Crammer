import React from 'react';

const Cafe = (props) => {
  return(
    <div className="row">
        <div className="col-md-12 restaurant">
            <div className="container">
                <div className="row">
                    <div className="col-md-10 restaurant-name">
                        <a href={props.website} target="_blank" className="url">{props.name}</a>
                    </div>
                    <div className="col-md-2 price">
                        {props.price}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-7 phone">
                        {props.phone}
                    </div>
                    <div className="col-md-5 rating">
                        Rating: {props.rating}/5 stars
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-5 distance">
                        {props.distance} mile(s) away
                    </div>
                    <div className="col-md-7 address">
                        {props.address}
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Cafe