function Card(props) {
  const { beaver, onCardClick } = props;

  function getPublicAvatar(apiPath) {
    if (!apiPath) return "/public/FolktailsBot.png";
    const fileName = apiPath.split("/").pop();
    return `/public/${fileName}.png`;
  }

  return (
    <div className="beaver-card" onClick={() => onCardClick(beaver.id)}>
      {/* Visual content for the card goes here */}
      <div className="card-image-container">
        {/* prettier-ignore */}
        <img
          src={getPublicAvatar(beaver.image)}
          alt={`${name} avatar`}
          className="beaver-avatar"
        />
      </div>
      <div className="card-info">
        <h3 className="card-name">{beaver.name}</h3>
        <p className="card-age">Age: {beaver.age}</p>
      </div>
    </div>
  );
}

export default Card;
