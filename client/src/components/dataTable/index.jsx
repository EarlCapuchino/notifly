import React, { useState, useEffect } from "react";
import { MDBBtn, MDBCol, MDBRow, MDBTable } from "mdb-react-ui-kit";
import { useSelector } from "react-redux";
import TableHead from "./head";
import TableBody from "./body";

export default function DataTable({
  name,
  datas = [],
  titles = [],
  contents = [],
  handlers = [],
  actions = [],
  isLoading = false,
  page = 1,
  empty = "",
  extraBtn = {},
}) {
  const { theme } = useSelector(({ auth }) => auth),
    [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function debounce(fn, ms) {
      let timer;

      return _ => {
        clearTimeout(timer);

        timer = setTimeout(_ => {
          timer = null;

          fn.apply(this, arguments);
        }, ms);
      };
    }

    const debounceResize = debounce(() => setWidth(window.innerWidth), 500);

    window.addEventListener("resize", debounceResize);

    return () => window.removeEventListener("resize", debounceResize);
  }, []);

  const handleExtraBtn = () => {
    const { _text, _handler, _color, _disabled } = extraBtn;

    if (_text) {
      return (
        <MDBCol onClick={_handler} className="text-end">
          <MDBBtn disabled={_disabled} color={_color} size="sm">
            {_text}
          </MDBBtn>
        </MDBCol>
      );
    }
  };

  return (
    <MDBTable
      borderless
      small={width < 768}
      align="middle"
      color={theme.color}
      hover
      striped
      responsive
      className="my-0"
    >
      <caption className={`${theme.text} caption-top pb-1`}>
        <MDBRow className="p-0 m-0">
          <MDBCol>
            <span>
              Total of <b>{datas.length}</b> item(s)
            </span>
          </MDBCol>
          {handleExtraBtn()}
        </MDBRow>
      </caption>

      <TableHead
        isLoading={isLoading}
        titles={titles}
        content={datas.length}
        empty={empty}
      />
      {!isLoading && (
        <TableBody
          datas={datas}
          page={page}
          name={name}
          contents={contents}
          actions={actions}
          handlers={handlers}
          width={width}
        />
      )}
    </MDBTable>
  );
}
