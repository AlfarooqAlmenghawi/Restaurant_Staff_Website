import { useEffect, useState } from "react";
import supabase from "../../../supabaseClient";

function ProfileEdit() {
  const HCRest = 3;

  const [current, setCurrent] = useState({ restaurant_cuisines: [] });

  const [cuisines, setCuisines] = useState([]);

  const [old, setOld] = useState({ restaurant_cuisines: [] });

  const sendProfile = () => {
    const sendData = { ...current };
    const newCuisines = [...current.restaurant_cuisines];
    if (sendData.restaurant_cuisines.length) {
      delete sendData.restaurant_cuisines;
    }
    supabase
      .from("restaurants")
      .update([sendData])
      .eq("restaurant_id", HCRest)
      .select()
      .then((data) => {});
    supabase
      .from("restaurant_cuisines")
      .delete()
      .eq("restaurant_id", HCRest)
      .select()
      .then(({ data, error }) => {})
      .then(() => {
        supabase
          .from("restaurant_cuisines")
          .insert(newCuisines)
          .select()
          .then(({ data, error }) => {});
      });
  };

  const removeCuisine = (e) => {
    const newCurrent = { ...current };
    newCurrent.restaurant_cuisines = newCurrent.restaurant_cuisines.filter(
      (cuisine) => {
        return cuisine.cuisine_id !== Number(e.target.id);
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
        restaunt_id: HCRest,
        cuisine_id: e.target.value,
      });
      setCurrent(newCurrent);
    }
  };

  useEffect(() => {
    supabase
      .from("restaurants")
      .select("*, restaurant_cuisines(*)")
      .eq("restaurant_id", HCRest)
      .then(({ data, error }) => {
        setCurrent(data[0]);
        setOld(data[0]);
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
      <h3>{current.restaurant_name}</h3>
      <div>
        <label>
          Restaurant Name
          <input
            id="restaurant_name"
            type="text"
            placeholder={current.restaurant_name}
            onChange={changeCurr}
          />
        </label>
        <h4>Profile</h4>
        <img src={current.restaurant_img}></img>
        <label>
          Image URL
          <input
            id="restaurant_img"
            type="text"
            placeholder={current.restaurant_img}
            onChange={changeCurr}
          />
        </label>
        <br></br>
        <label>
          Description
          <textarea
            id="description"
            placeholder={current.description}
            value={current.description}
            onChange={changeCurr}
          ></textarea>
        </label>
      </div>
      <div>
        <h4>Food</h4>
        {cuisines.length ? (
          <div>
            <h5>Cuisines</h5>
            {current.restaurant_cuisines.length < 3 ? (
              <label>
                New Cuisine
                <select onChange={addCuisine}>
                  {cuisines.map((cuisine) => {
                    return (
                      <option value={cuisine.cuisine_id}>
                        {
                          cuisines.filter((entry) => {
                            return entry.cuisine_id === cuisine.cuisine_id;
                          })[0].cuisine_name
                        }
                      </option>
                    );
                  })}
                </select>
              </label>
            ) : null}
            <ul>
              {current.restaurant_cuisines.map((cuisine) => {
                return (
                  <li key={current.restaurant_cuisines.indexOf(cuisine)}>
                    {
                      cuisines.filter((entry) => {
                        return entry.cuisine_id === Number(cuisine.cuisine_id);
                      })[0].cuisine_name
                    }
                    <button id={cuisine.cuisine_id} onClick={removeCuisine}>
                      X
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
        <div>
          <h4>Menu</h4>
          <label>
            Menu Link
            <input
              id="menu_link"
              type="text"
              placeholder={current.menu_link}
              onChange={changeCurr}
            />
          </label>
          <label>
            Is the menu an image?
            <input
              id="is_menu_img"
              type="checkbox"
              onChange={changeCheckbox}
              checked={current.is_menu_img}
            />
            {current.is_menu_img ? <img src={current.menu_link} /> : null}
          </label>
        </div>
      </div>
      <div>
        <h4>Contact Details</h4>
        <label>
          Address
          <input />
        </label>
        <label>
          Phone Number
          <input
            id="restaurant_phone_number"
            type="text"
            onChange={changeCurr}
          />
        </label>
        <label>
          Email
          <input
            id="restaurant_email"
            type="text"
            onChange={changeCurr}
            placeholder={current.restaurant_email}
          />
        </label>
      </div>
      <button onClick={sendProfile}>update</button>
    </main>
  );
}

export default ProfileEdit;
