import React from 'react';

const ReviewCard = ({ 
  avatarUrl = 'https://via.placeholder.com/64', 
  text, 
  rating = 5, 
  author, 
  location 
}) => {
  
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= rating ? 'text-warning' : 'text-muted'}>
        &#9733;
      </span>
    );
  }

  return (
    <div className="card mb-3" style={{ maxWidth: '540px' }}>
      <div className="row g-0 align-items-center">
        <div className="col-md-2 text-center">
          <img src={avatarUrl} alt="User avatar" className="img-fluid rounded-circle" />
        </div>
        <div className="col-md-10">
          <div className="card-body">
            <p className="card-text fst-italic">«{text}»</p>
            <div className="mb-2">{stars}</div>
            <h6 className="card-subtitle mb-0">{author}</h6>
            <small className="text-muted">{location}</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
