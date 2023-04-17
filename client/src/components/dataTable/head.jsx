import React from "react";
import { MDBTableHead, MDBIcon } from "mdb-react-ui-kit";

export default function TableHead({ isLoading, titles, content, empty }) {
  return (
    <MDBTableHead>
      {isLoading ? (
        <tr className="text-center">
          <td colSpan={titles.length}>
            <MDBIcon far icon="clock" spin />
          </td>
        </tr>
      ) : content > 0 ? (
        <tr>
          {titles.map((title, index) => {
            if (typeof title === "string") {
              return (
                <th key={`${title}-${index}`} scope="col">
                  {title}
                </th>
              );
            } else {
              const { _title, _styles } = title;
              return (
                <th
                  key={`${_title}-${index}`}
                  className={`${_styles}`}
                  scope="col"
                >
                  {_title}
                </th>
              );
            }
          })}
        </tr>
      ) : (
        <tr className="text-center">
          <td colSpan={titles.length}>{empty}</td>
        </tr>
      )}
    </MDBTableHead>
  );
}
