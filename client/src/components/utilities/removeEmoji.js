const removeEmoji = text => {
  const emojiPattern =
    /[\uD800-\uDBFF][\uDC00-\uDFFF]|\u2700-\u27BF|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F\uDE80-\uDEFF]|\uD83E[\uDD00-\uDDFF]/g;
  return text.replace(emojiPattern, "");
};

export default removeEmoji;
