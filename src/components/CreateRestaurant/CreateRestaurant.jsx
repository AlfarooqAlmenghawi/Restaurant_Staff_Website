import { useEffect, useState } from "react";
import supabase from "../../../supabaseClient";
import { useAuth } from "../../hooks/Auth";

function CreateRestaurant() {
  const { session } = useAuth();
  // const RestaurantID = session.restaurant_id;

  const [current, setCurrent] = useState({ restaurant_cuisines: [] });

  const [cuisines, setCuisines] = useState([]);

  const [typedLocation, setTypedLocation] = useState("");

  const [locationsResult, setLocationsResult] = useState({});

  const [selectedLocation, setSelectedLocation] = useState(null);

  const [old, setOld] = useState({ restaurant_cuisines: [] });

  const sendProfile = () => {
    const sendData = { ...current };
    const newCuisines = [...current.restaurant_cuisines];
    if (sendData.restaurant_cuisines.length) {
      delete sendData.restaurant_cuisines;
    }
    console.log(sendData);
    const latitude = selectedLocation.latitude;
    const longitude = selectedLocation.longitude;

    sendData.location = `point(${longitude} ${latitude})`;
    supabase
      .from("restaurants")
      .insert(sendData)
      .select()
      .then(({ data }) => {
        console.log(data[0].restaurant_id);
        supabase
          .from("staff_restaurant")
          .insert({
            user_id: session.user.id,
            restaurant_id: data[0].restaurant_id,
          })
          .select()
          .then((data) => {});
      });
    // supabase
    //   .from("restaurant_cuisines")
    //   .select()
    //   .then(({ data, error }) => {
    //     supabase
    //       .from("restaurant_cuisines")
    //       .insert(newCuisines)
    //       .select()
    //       .then(({ data, error }) => {});
    //   });
  };

  const removeCuisine = (e) => {
    const newCurrent = { ...current };
    console.log("Before:", newCurrent);
    console.log(e.target.id);

    newCurrent.restaurant_cuisines = newCurrent.restaurant_cuisines.filter(
      (cuisine) => {
        console.log(typeof cuisine.cuisine_id);
        console.log(typeof e.target.id);
        return cuisine.cuisine_id != e.target.id;
      }
    );
    console.log("After:", newCurrent);
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

  const setCurrentLocation = (e) => {
    console.log(typedLocation);
    console.log(e.target.value);
    setTypedLocation(e.target.value);
  };

  const fetchLocation = () => {
    fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${typedLocation}&apiKey=e9eabc644c4544ce98dfe36c8c70232f`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("API Response:", data); // Check the structure of the response

        // if (data) {
        //   // const place = location.properties.formatted;
        //   // const lat = location.properties.lat;
        //   // const lon = location.properties.lon;
        //   // console.log(`Latitude: ${lat}, Longitude: ${lon}`);

        //
        //   console.log(data);
        // } else {
        //   console.error("Location not found!");
        // }
        if (data && data.features && data.features.length > 0) {
          setLocationsResult(data); // Update state with valid data
        } else {
          console.error("No locations found or invalid response structure");
          setLocationsResult({ features: [] }); // Ensure consistent structure
        }
        return data;
      })
      .then((data) => {
        setLocationsResult(data);
      })
      .then(() => {
        console.log(locationsResult);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const chooseLocation = (e) => {
    console.log(e.target.value);
    setSelectedLocation({
      address: e.target.dataset.address,
      coordinates: e.target.value,
      latitude: e.target.dataset.latitude,
      longitude: e.target.dataset.longitude,
    });
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
        cuisine_id: e.target.value,
      });
      setCurrent(newCurrent);
    }
  };

  useEffect(() => {
    supabase
      .from("cuisines")
      .select()
      .then(({ data, error }) => {
        setCuisines(data);
      });
  }, []);

  useEffect(() => {
    console.log("Updated locationsResult:", locationsResult);
  }, [locationsResult]);

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
          />
        </label>
        <br></br>
        <label>
          Location
          <input
            id="location"
            placeholder={current.location}
            onChange={setCurrentLocation}
          ></input>
          <button className="search-location" onClick={fetchLocation}>
            Search
          </button>
          {selectedLocation && (
            <>
              <h2>Here is the currently selected location:</h2>
              <p>{selectedLocation.address}</p>
              <p>Coordinates: {selectedLocation.coordinates}</p>
            </>
          )}
        </label>
        <br></br>
        <>
          {locationsResult.features && locationsResult.features.length > 0 ? (
            <>
              {locationsResult.features.length === 1 ? (
                <h2>We found {locationsResult.features.length} location!</h2>
              ) : (
                <h2>We found {locationsResult.features.length} locations!</h2>
              )}

              {locationsResult.features.map((location, index) => (
                <div key={index}>
                  <p>{location.properties.formatted}</p>
                  <p>Latitude: {location.properties.lat}</p>
                  <p>Longitude: {location.properties.lon}</p>
                  <button
                    className="location-select"
                    data-address={location.properties.formatted}
                    data-latitude={location.properties.lat}
                    data-longitude={location.properties.lon}
                    value={`${location.properties.lat}, ${location.properties.lon}`}
                    onClick={chooseLocation}
                  >
                    This is my restaurant location!
                  </button>
                </div>
              ))}
            </>
          ) : null}
        </>
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
                      <option
                        key={cuisine.cuisine_id}
                        value={cuisine.cuisine_id}
                      >
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
      <button onClick={sendProfile}>Create Restaurant</button>
    </main>
  );
}

export default CreateRestaurant;
