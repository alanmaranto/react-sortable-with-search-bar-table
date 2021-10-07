import { useState, useEffect } from "react";
import { fetchData } from "./api/api";
import { extractObjectKeys } from "./helpers/helpers";

const App = () => {
  const [people, setPeople] = useState([]);
  const [flattenedLocations, setFlattenedLocations] = useState({
    headers: [],
    data: [],
  });

  const flattenLocations = (people) => {
    const locations = people.map(({ location }) => location);

    const data = [];
    for (const { street, coordinates, timezone, ...rest } of locations) {
      data.push({
        ...rest,
        number: street.number,
        name: street.name,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });
    }
    const flattenedLocationsHeaders = extractObjectKeys(data[0]);
    return { headers: flattenedLocationsHeaders, data };
  };

  const getData = async () => {
    const result = await fetchData();
    setPeople(result);
    setFlattenedLocations(flattenLocations(result));
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <h1>People</h1>
      <table>
        <thead>
          <tr>
            {flattenedLocations.headers.map((location, idx) => (
              <th key={`${location}-${idx}`}>{location}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {flattenedLocations.data.map((location, idx) => (
            <tr key={`${location}-${idx}`}>
              {Object.values(location).map((locationValue, valueIdx) => (
                <td key={`${locationValue}-${valueIdx}`}>{locationValue}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {people.map((person, idx) => (
        <div key={`${person.name.first}-${idx}`}>{person.name.first}</div>
      ))}
    </div>
  );
};

export default App;
