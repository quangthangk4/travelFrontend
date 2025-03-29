import axios from "axios";
import React, { useEffect, useState } from "react";

const Test = () => {
  const [coordinates, setCoordinates] = useState({});
  useEffect(() => {
    axios
      .get("http://localhost:8080/airports/vietnam")
      .then((response) => {
        if (response.data.code == "1000" && response.data.result) {
          setCoordinates(
            response.data.result.reduce((acc, airport) => {
              acc[airport.maIATA] = [airport.kinhDo, airport.viDo];
              return acc;
            }, {})
          );
        }
      })
      .catch((error) => console.error("Lỗi khi tải danh sách sân bay:", error));
  }, []);

  console.log(coordinates["SGN"]);
  return <div>test</div>;
};

export default Test;
