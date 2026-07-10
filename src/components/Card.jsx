function Card(props) {
  const { name, onCardClick } = props;
  return (
    <div className="beaver-card" onClick={() => onCardClick(name)}>
      {/* Visual content for the card goes here */}
      <div className="card-image-placeholder">
        {/* Placeholder text until we hook up the API images */}
        <span>[Image of {name}]</span>
      </div>
      <h3 className="card-name">{name}</h3>
    </div>
  );
}

export default Card;
