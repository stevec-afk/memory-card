function Card(props) {
  const {
    beaver: { id, name, image, age },
    onCardClick,
  } = props;

  return (
    <div className="beaver-card" onClick={() => onCardClick(id)}>
      {/* Visual content for the card goes here */}
      <div className="card-image-container">
        {/* prettier-ignore */}
        <img
          src={`/api/MoreHttpApi/${image}`}
          alt={`${name} avatar`}
          className="beaver-avatar"
        />
      </div>
      <div className="card-info">
        <h3 className="card-name">{name}</h3>
        <p className="card-age">Age: {age}</p>
      </div>
    </div>
  );
}

export default Card;
