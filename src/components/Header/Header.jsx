import { Link } from "react-router-dom";

function Header() {
  return (
    <>
      <nav>
        <h1 className="restaurant-title">Black Beards Grill</h1>
        <Link className="heading-button" to="/test">
          Test
        </Link>
        <h2>Place holder company name</h2>
        <Link className="heading-button" to="/tables">
          Tables
        </Link>
        <Link className="heading-button" to="/profile">
          Manage Profile
        </Link>
        <Link className="heading-button" to="/test2">
          Go Live
        </Link>
      </nav>
    </>
  );
}

export default Header;
