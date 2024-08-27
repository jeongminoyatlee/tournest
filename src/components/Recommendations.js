// components/Recommendations.js
import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Recommendations({ recommendations, loading, isValidRating, renderRatingIcons }) {
  return (
    <div className="container mt-5">
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading</span>
          </div>
        </div>
      ) : (
        <div className="row justify-content-center">
          {recommendations.length > 0 ? (
            recommendations
              .filter((rec) => isValidRating(rec.rating))
              .slice(0, 6)
              .map((rec, index) => (
                <div key={index} className="col-12 col-md-6 col-lg-4 mb-4">
                  <div className="card text-center" style={{ border: '1px solid #000', borderRadius: '0' }}>
                    {rec.photo && (
                      <img src={rec.photo} className="card-img-top" alt={rec.name} />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">
                        <a href={rec.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'black' }}>
                          {rec.name}
                        </a>
                      </h5>
                      {rec.address && <p className="card-text">{rec.address}</p>}
                      {rec.rating && (
                        <div className="rating" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            {renderRatingIcons(rec.rating)}
                        </div>
                            <p className="mt-2 text-center">Rating: {rec.rating}/5</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="col-12">
              <p className="text-center">해당 목적지의 추천 여행지를 찾는 중입니다</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
