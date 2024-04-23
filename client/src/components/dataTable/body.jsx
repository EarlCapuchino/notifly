import React from "react";
import { MDBTableBody, MDBIcon, MDBTooltip, MDBBtn } from "mdb-react-ui-kit";
import { useSelector } from "react-redux";
import UserCircle from "../../assets/images/default.png";

export default function TableBody({
  datas,
  page,
  name,
  contents,
  actions,
  handlers,
  width,
}) {
  const { maxPage } = useSelector(({ auth }) => auth);

  const handlePagination = (array, page) =>
    array.slice((page - 1) * maxPage, maxPage + (page - 1) * maxPage);

  return (
    <MDBTableBody>
      {datas.length > 0 &&
        handlePagination(datas, page).map((data, index) => (
          <tr key={`${name}-${index}`}>
            {contents.map((content, cIndex) => {
              if (typeof content === "object") {
                const { _keys, _format, _styles, _image } = content;
                return (
                  <td key={`${_keys}-${cIndex}`} className={`${_styles}`}>
                    {typeof _keys === "string" ? (
                      <p className="mb-0">
                        {_format ? _format(data[_keys]) : data[_keys]}
                      </p>
                    ) : _image ? (
                      <div className="d-flex align-items-center">
                        <img
                          src={_image(data)}
                          alt={_image(data)}
                          style={{ width: "45px", height: "45px" }}
                          onError={e => (e.target.src = UserCircle)}
                          className="rounded-circle"
                        />
                        <div className="ms-2">
                          <p className="fw-bold mb-1">
                            {_format[0]
                              ? _format[0](data[_keys[0]])
                              : data[_keys[0]]}
                          </p>
                          <p className="text-muted mb-0">
                            {_format[1]
                              ? _format[1](data[_keys[1]])
                              : data[_keys[1]]}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="fw-bold mb-1">
                          {_format[0]
                            ? _format[0](data[_keys[0]])
                            : data[_keys[0]]}
                        </p>
                        <p className="text-muted mb-0">
                          {_format[1]
                            ? _format[1](data[_keys[1]])
                            : data[_keys[1]]}
                        </p>
                      </>
                    )}
                  </td>
                );
              } else {
                return (
                  <td key={`${content}-${cIndex}`}>
                    <p className="mb-0">{data[content]}</p>
                  </td>
                );
              }
            })}
            {actions.length > 0 && (
              <td className="text-center">
                {actions?.map((action, index) => {
                  const {
                    _title,
                    _placement,
                    _color,
                    _function,
                    _style,
                    _iconType,
                    _iconSize,
                    _icon,
                    _outline = true,
                    _condition,
                  } = action;

                  var icon;

                  switch (_iconType) {
                    case "far":
                      icon = <MDBIcon size={_iconSize} far icon={_icon} />;
                      break;

                    case "fab":
                      icon = <MDBIcon size={_iconSize} fab icon={_icon} />;
                      break;

                    default:
                      icon = <MDBIcon size={_iconSize} icon={_icon} />;
                      break;
                  }

                  if (_condition) {
                    if (_condition(data)) {
                      return (
                        <MDBTooltip
                          key={`${name}-tooltip-${index}`}
                          tag="span"
                          wrapperClass="d-inline-block"
                          title={_title}
                          placement={_placement}
                        >
                          <MDBBtn
                            onClick={() => handlers[_function](data)}
                            outline={_outline}
                            className={`${_style}`}
                            floating
                            color={_color}
                            size={width < 768 && "sm"}
                            key={`${name}-btn-${index}`}
                          >
                            {icon}
                          </MDBBtn>
                        </MDBTooltip>
                      );
                    }
                  } else {
                    return (
                      <MDBTooltip
                        key={`${name}-toolttip-${index}`}
                        tag="span"
                        wrapperClass="d-inline-block"
                        title={_title}
                        placement={_placement}
                      >
                        <MDBBtn
                          onClick={() => handlers[_function](data)}
                          outline={_outline}
                          floating
                          className={`${_style}`}
                          color={_color}
                          size={width < 768 && "sm"}
                          key={`${name}-btn-${index}`}
                        >
                          {icon}
                        </MDBBtn>
                      </MDBTooltip>
                    );
                  }
                })}
              </td>
            )}
          </tr>
        ))}
    </MDBTableBody>
  );
}
