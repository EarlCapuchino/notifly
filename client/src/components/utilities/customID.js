const customId = id => {
  const customId = Date.parse(id);
  if (isNaN(customId)) {
    return id;
  } else {
    return "";
  }
};

export default customId;
