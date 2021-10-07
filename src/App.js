import { useState, useEffect } from "react";
import { fetchData } from "./api/api";
import { extractObjectKeys } from "./helpers/helpers";

const App = () => {
  const [people, setPeople] = useState([]);
  const [flattenedLocations, setFlattenedLocations] = useState([]);

  const flattenLocations = (data) => {
    const locations = data.map(({ location }) => location);
    const location = locations[0];
    const flattenedLocationsHeaders = extractObjectKeys(location);
    return flattenedLocationsHeaders;
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
            {flattenedLocations.map((location, idx) => (
              <th key={`${location}-${idx}`}>{location}</th>
            ))}
          </tr>
        </thead>
      </table>
      {people.map((person, idx) => (
        <div key={`${person.name.first}-${idx}`}>{person.name.first}</div>
      ))}
    </div>
  );
};

export default App;
