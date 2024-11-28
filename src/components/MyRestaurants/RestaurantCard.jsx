import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/Auth";
import { IoCloudOfflineOutline, IoCloudDoneSharp } from "react-icons/io5";

export const RestaurantCard = ({
  restaurant_id,
  restaurant_name,
  restaurant_img,
  isSelected,
  is_listed,
}) => {
  const navigate = useNavigate();
  const { updateRestaurant } = useAuth();

  function handleClick({ target: { id } }) {
    updateRestaurant(restaurant_id);
    id && navigate(id);
  }

  return (
    <div
      onClick={handleClick}
      className={`transition-all ease-in-out ${
        isSelected ? "boxStyleSelected" : "boxStyle"
      } hover:shadow-2xl hover:scale-105`}
    >
      <img className="w-48 h-36 object-cover" src={restaurant_img} />
      <div className="flex flex-col">
        <h4 className="font-semibold w-48">{restaurant_name}</h4>
        <button className="custButton w-28" onClick={handleClick} id="/tables">
          See Tables
        </button>
        <button className="custButton w-28" onClick={handleClick} id="/profile">
          Edit Profile
        </button>
        <button className="custButton w-28 flex items-center justify-center gap-2" onClick={handleClick} id="/go-live">
          Go Live {is_listed ? <IoCloudDoneSharp /> : <IoCloudOfflineOutline />}
        </button>
      </div>
    </div>
  );
};
