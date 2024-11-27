import { useEffect, useState } from "react";
import supabase from "../../../supabaseClient";
import { useAuth } from "../../hooks/Auth";
import { IoMdCloseCircle } from "react-icons/io";

function ProfileEdit() {
  const { session } = useAuth();
  const RestaurantID = Number(session.restaurant_id);

  const [current, setCurrent] = useState({ restaurant_cuisines: [] });

  const [cuisines, setCuisines] = useState([]);

  const [old, setOld] = useState({ restaurant_cuisines: [] });

  const sendProfile = () => {
    const sendData = { ...current };
    const oldCuisines = new Set(
      old.restaurant_cuisines.map(({ cuisine_id }) => +cuisine_id)
    );
    const currentCuisines = new Set(
      current.restaurant_cuisines.map(({ cuisine_id }) => +cuisine_id)
    );
    const toInsert = currentCuisines.difference(oldCuisines);
    const toDelete = oldCuisines.difference(currentCuisines);
    if (sendData.restaurant_cuisines.length) {
      delete sendData.restaurant_cuisines;
    }
    supabase
      .from("restaurants")
      .update([sendData])
      .eq("restaurant_id", RestaurantID)
      .select()
      .then((data) => {});

    if (toInsert.size) {
      supabase
        .from("restaurant_cuisines")
        .insert(
          Array.from(toInsert, (v) => ({
            cuisine_id: v,
            restaurant_id: RestaurantID,
          }))
        )
        .select()
        .then(({ data, error }) => console.log(error));
    }

    if (toDelete.size) {
      supabase
        .from("restaurant_cuisines")
        .delete()
        .in("cuisine_id", Array.from(toDelete))
        .eq("restaurant_id", RestaurantID)
        .select()
        .then(({ data, error }) => console.log(error));
    }
  };

  const removeCuisine = (e) => {
    const newCurrent = { ...current };
    console.log(e.target);
    newCurrent.restaurant_cuisines = newCurrent.restaurant_cuisines.filter(
      (cuisine) => {
        return cuisine.cuisine_id != (e.target.id || e.target.parentElement.id);
      }
    );
    setCurrent(newCurrent);
  };

  const changeCurr = (e) => {
    const newCurrent = { ...current };
    if (e.target.value) {
      newCurrent[e.target.id] = e.target.value;
    } else {
      newCurrent[e.target.id] = old[e.target.id];
    }
    setCurrent(newCurrent);
  };

  const changeCheckbox = (e) => {
    const newCurrent = { ...current };
    newCurrent[e.target.id] = !newCurrent[e.target.id];
    setCurrent(newCurrent);
  };

  const addCuisine = (e) => {
    const newCurrent = { ...current };
    let isDupe = false;
    newCurrent.restaurant_cuisines.forEach((cuisine) => {
      if (Number(cuisine.cuisine_id) === Number(e.target.value)) {
        isDupe = true;
      }
    });
    if (!isDupe) {
      newCurrent.restaurant_cuisines.push({
        restaurant_id: RestaurantID,
        cuisine_id: e.target.value,
      });
      setCurrent(newCurrent);
    }
  };

  useEffect(() => {
    supabase
      .from("restaurants")
      .select("*, restaurant_cuisines(*)")
      .eq("restaurant_id", RestaurantID)
      .then(({ data, error }) => {
        const newData = { ...data[0] };
        newData.restaurant_cuisines = [...data[0].restaurant_cuisines];
        setCurrent({ ...data[0] });
        setOld(newData);
      });
    supabase
      .from("cuisines")
      .select()
      .then(({ data, error }) => {
        setCuisines(data);
      });
  }, []);

  return (
    <main>
      <h3 className="pageTitle">
        Edit Profile
      </h3>
      <div className="py-4 border-y-2 grid grid-cols-2 mx-2 gap-4">
        <h4 className="profileSectionTitle">Profile</h4>
        <label className="profileOption col-span-2">
          Restaurant Name
          <input
            className="inputBox"
            id="restaurant_name"
            type="text"
            placeholder={current.restaurant_name}
            onChange={changeCurr}
          />
        </label>
        <img
          className="size-full object-contain"
          src={current.restaurant_img}
        ></img>
        <label className="profileOption">
          Description
          <textarea
            className="inputBox size-full"
            id="description"
            placeholder={current.description}
            value={current.description}
            onChange={changeCurr}
          ></textarea>
        </label>
        <label className="profileOption">
          Image URL
          <input
            className="inputBox"
            id="restaurant_img"
            type="text"
            placeholder={current.restaurant_img}
            onChange={changeCurr}
          />
        </label>
      </div>
      <div className="py-4 border-y-2 grid grid-cols mx-2">
        <h4 className="profileSectionTitle">Food</h4>
        {cuisines.length ? (
          <div className="flex flex-col items-center">
            <h5 className="profileOption">Cuisines</h5>
            {current.restaurant_cuisines.length < 3 ? (
              <label className="text-base flex flex-col">
                New Cuisine
                <select
                  onChange={addCuisine}
                  className="text-base w-28"
                  id="selectCuisine"
                >
                  {cuisines.map((cuisine, index) => {
                    return (
                      <li key={index}>
                        {
                          cuisines.filter((entry) => {
                            return (
                              entry.cuisine_id === Number(cuisine.cuisine_id)
                            );
                          })[0].cuisine_name
                        }
                        <button id={cuisine.cuisine_id} onClick={removeCuisine}>
                          X
                        </button>
                      </li>
                    );
                  })}
                </select>
              </label>
            ) : null}
            <ul>
              {current.restaurant_cuisines.map((cuisine, index) => {
                return (
                  <li className="cuisine" key={index}>
                    {
                      cuisines.filter((entry) => {
                        return entry.cuisine_id === Number(cuisine.cuisine_id);
                      })[0].cuisine_name
                    }
                    <button id={cuisine.cuisine_id} onClick={removeCuisine}>
                      <IoMdCloseCircle id={cuisine.cuisine_id} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
        <div>
          <h4 className="profileOption">Menu</h4>
          <label>
            Menu Link
            <input
              className="inputBox"
              id="menu_link"
              type="text"
              placeholder={current.menu_link}
              onChange={changeCurr}
            />
          </label>
          <br></br>
          {current.is_menu_img ? (
            <img
              className="size-64 object-contain my-2"
              src={current.menu_link}
            />
          ) : null}
          <label>
            Is the menu an image?
            <input
              className="mx-2"
              id="is_menu_img"
              type="checkbox"
              onChange={changeCheckbox}
              checked={current.is_menu_img}
            />
          </label>
        </div>
      </div>
      <div className="flex py-4 border-y-2 flex-col mx-2">
        <h4 className="profileSectionTitle">Contact Details</h4>
        <label className="profileOption">
          Phone Number
          <input
            className="inputBox"
            id="restaurant_phone_number"
            type="text"
            onChange={changeCurr}
          />
        </label>
        <label className="profileOption">
          Email
          <input
            className="inputBox"
            id="restaurant_email"
            type="text"
            onChange={changeCurr}
            placeholder={current.restaurant_email}
          />
        </label>
      </div>
      <button className="custButton" onClick={sendProfile}>
        Update Restaurant
      </button>
    </main>
  );
}

export default ProfileEdit;
