import { useState, useEffect } from "react";
import { fetchData } from "./api/api";
import { extractObjectKeys, sortingDirectionsTypes } from "./helpers/helpers";

const App = () => {
  const [people, setPeople] = useState([]);
  const [flattenedLocations, setFlattenedLocations] = useState({
    headers: [],
    data: [],
  });
  const [sortingDirections, setSortingDirections] = useState({});

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

  const sortData = (data, key, direction) => {
    data.sort((a, b) => {
      const relevantValueA = a[key];
      const relevantValueB = b[key];
      if (
        direction === sortingDirectionsTypes.UNSORTED ||
        direction === sortingDirectionsTypes.ASCENDING
      ) {
        if (relevantValueA < relevantValueB) return -1;
        if (relevantValueA > relevantValueB) return 1;
        return 0;
      } else {
        if (relevantValueA > relevantValueB) return -1;
        if (relevantValueA < relevantValueB) return 1;
        return 0;
      }
    });
  };

  const getNextSortingDirection = (direction) => {
    if (
      direction === sortingDirectionsTypes.UNSORTED ||
      direction === sortingDirectionsTypes.ASCENDING
    ) {
      return sortingDirectionsTypes.DESCENDING;
    }
    return sortingDirectionsTypes.ASCENDING;
  };

  const sortColumn = (locationKey) => {
    const newFlattenedLocations = {
      ...flattenedLocations,
      data: [...flattenedLocations.data],
    };

    const currentSortingDirection = sortingDirections[locationKey];
    sortData(newFlattenedLocations.data, locationKey, currentSortingDirection);
    const nextSortingDirection = getNextSortingDirection(
      currentSortingDirection
    );
    const newSortingDirection = { ...sortingDirections };
    newSortingDirection[locationKey] = nextSortingDirection;
    setFlattenedLocations(newFlattenedLocations);
    setSortingDirections(newSortingDirection);
  };

  const sortDirection = (headers) => {
    const newSortingDirections = {};
    for (const header of headers) {
      newSortingDirections[header] = sortingDirectionsTypes.ASCENDING;
    }
    return newSortingDirections;
  };

  const getData = async () => {
    const result = await fetchData();
    setPeople(result);
    setFlattenedLocations(flattenLocations(result));
    setSortingDirections(sortDirection(flattenedLocations.headers));
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
            {flattenedLocations.headers.map((locationString, idx) => (
              <th
                key={`${locationString}-${idx}`}
                onClick={() => sortColumn(locationString)}
              >
                {locationString}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {flattenedLocations.data.map((location, idx) => (
            <tr key={`${location}-${idx}`}>
              {flattenedLocations.headers.map((header, headerIdx) => (
                <td key={`${header}-${headerIdx}`}>{location[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
