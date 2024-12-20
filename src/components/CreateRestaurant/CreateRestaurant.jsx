import { useEffect, useState } from "react";
import supabase from "../../../supabaseClient";
import { useAuth } from "../../hooks/Auth";
import BeatLoader from "react-spinners/BeatLoader";
import { useNavigate } from "react-router-dom";

function CreateRestaurant() {
  const { session, updateRestaurant } = useAuth();
  // const RestaurantID = session.restaurant_id;

  const [current, setCurrent] = useState({ restaurant_cuisines: [] });

  const [cuisines, setCuisines] = useState([]);

  const [typedLocation, setTypedLocation] = useState("");

  const [locationsResult, setLocationsResult] = useState({});

  const [selectedLocation, setSelectedLocation] = useState(null);

  const [old, setOld] = useState({ restaurant_cuisines: [] });

  const navigate = useNavigate();

  const sendProfile = () => {
    const sendData = { ...current };
    const newCuisines = [...current.restaurant_cuisines];
    if (sendData.restaurant_cuisines.length) {
      delete sendData.restaurant_cuisines;
    }
    const latitude = selectedLocation.latitude;
    const longitude = selectedLocation.longitude;
    sendData.location = `point(${longitude} ${latitude})`;
    supabase
      .from("restaurants")
      .insert(sendData)
      .select()
      .then(({ data }) => {
        supabase
          .from("staff_restaurant")
          .insert({
            user_id: session.user.id,
            restaurant_id: data[0].restaurant_id,
          })
          .select()
          .then(({ data }) => {
            updateRestaurant(data[0].restaurant_id);
            navigate("/settings");
          });
        newCuisines.forEach((cuisine) => {
          cuisine.restaurant_id = data[0].restaurant_id;
        });
        supabase
          .from("restaurant_cuisines")
          .insert(newCuisines)
          .select()
          .then(({ data, error }) => {
            error ? console.log(error) : console.log(data);
          });
      });
  };

  const removeCuisine = (e) => {
    const newCurrent = { ...current };
    newCurrent.restaurant_cuisines = newCurrent.restaurant_cuisines.filter(
      (cuisine) => {
        return cuisine.cuisine_id != e.target.id;
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

  const setCurrentLocation = (e) => {
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

  useEffect(() => {}, [locationsResult]);

  return (
    <main>
      <h3 className="pageTitle">New Restaurant</h3>
      <div className="py-4 border-y-2 grid grid-cols-2 mx-2 gap-4">
        <h4 className="profileSectionTitle">Profile</h4>
        <label className="profileOption col-span-2">
          Restaurant Name *
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
          <div>
            <h5>Cuisines</h5>
            {current.restaurant_cuisines.length < 3 ? (
              <label className="profileOption">
                New Cuisine
                <select className="text-base w-28" onChange={addCuisine}>
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
                  <li
                    className="cuisine"
                    key={current.restaurant_cuisines.indexOf(cuisine)}
                  >
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
        ) : (
          <div className="flex flex-col items-center mt-10 w-full">
            <BeatLoader />
          </div>
        )}
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
        <div>
          <label className="profileOption">
            Location *
            <input
              className="inputBox"
              id="location"
              placeholder={current.location}
              onChange={setCurrentLocation}
            ></input>
            <button className="custButton" onClick={fetchLocation}>
              Search
            </button>
            {selectedLocation && (
              <div className="text">
                <h5>Selected Location:</h5>
                <p className="text-base">{selectedLocation.address}</p>
                <p className="text-base">
                  Coordinates: {selectedLocation.coordinates}
                </p>
              </div>
            )}
          </label>

          <div className="flex flex-col">
            {locationsResult.features && locationsResult.features.length > 0 ? (
              <div>
                {locationsResult.features.length === 1 ? (
                  <p>We found {locationsResult.features.length} location!</p>
                ) : (
                  <p>We found {locationsResult.features.length} locations!</p>
                )}
                <ul className="grid grid-cols-3 grid-flow-row gap-8">
                  {locationsResult.features.map((location, index) => (
                    <li
                      className="border-2 w-40 rounded-lg flex flex-col place-content-between bg-quinary my-2 p-0.5 flex-wrap m-2"
                      key={index}
                    >
                      <p>{location.properties.formatted}</p>
                      <p>Latitude: {location.properties.lat}</p>
                      <p>Longitude: {location.properties.lon}</p>
                      <button
                        className="custButton"
                        data-address={location.properties.formatted}
                        data-latitude={location.properties.lat}
                        data-longitude={location.properties.lon}
                        value={`${location.properties.lat}, ${location.properties.lon}`}
                        onClick={chooseLocation}
                      >
                        Select
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
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
          Email *
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
        Create Restaurant
      </button>
    </main>
  );
}

{
  /* <main>
  <h3 className="font-bold text-2xl border-y-4 px-4">
  {current.restaurant_name}
  </h3>
  <div className="py-4 border-y-2 grid grid-cols-2 mx-2 gap-4">
  <h4 className="profileSectionTitle">Profile</h4>
  <label className="profileOption col-span-2">
  Restaurant Name
  <input
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
  Image URL
  <input
  className="inputBox size-full"
  id="restaurant_img"
  type="text"
  placeholder={current.restaurant_img}
  onChange={changeCurr}
  />
  </label>
  <label className="profileOption">
  Description
  <textarea
  id="description"
  placeholder={current.description}
  value={current.description}
  onChange={changeCurr}
  />
  </label >
  <label className="profileOption">
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
            <div className="py-4 border-y-2 grid grid-cols mx-2">
            <h4 className="profileSectionTitle">Food</h4>
            {cuisines.length ? (
              <div>
              <h5 >Cuisines</h5>
              {current.restaurant_cuisines.length < 3 ? (
                <label className="profileOption">
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
                                <h4 className="profileSectionTitle">Menu</h4>
                                <label className="profileOption">
                                Menu Link
                                <input
                                id="menu_link"
                                type="text"
                                placeholder={current.menu_link}
        onChange={changeCurr}
      />
      </label>
      <label className="profileOption">
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
        <div className="flex py-4 border-y-2 flex-col mx-2">
        <h4>Contact Details</h4>
        <label className="profileOption">
        Address
        <input />
        </label>
        <label className="profileOption">
        Phone Number
        <input
        id="restaurant_phone_number"
        type="text"
        onChange={changeCurr}
        />
        </label>
        <label className="profileOption">
        Email
        <input
        id="restaurant_email"
        type="text"
        onChange={changeCurr}
        placeholder={current.restaurant_email}
        />
        </label>
        </div>
        <button className="custButton" onClick={sendProfile}>Create Restaurant</button>
        </main>
        );
        } */
}

export default CreateRestaurant;
