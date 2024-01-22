function pathTraversalAttempt(data) {
  // This will use several methods to check for the possibility of an attempted path traversal attack.

  // The definitions here are based off GoPage checks.
  // https://github.com/confused-Techie/GoPage/blob/main/src/pkg/universalMethods/universalMethods.go
  // But we leave out any focused on defended against URL Encoded values, since this has already been decoded.
  // const checks = [
  //   /\.{2}\//,   //unixBackNav
  //   /\.{2}\\/,   //unixBackNavReverse
  //   /\.{2}/,     //unixParentCatchAll
  // ];

  // Combine the 3 regex into one: https://regex101.com/r/CgcZev/1
  const check = /\.{2}(?:[/\\])?/;
  return data?.match(check) !== null;
}

module.exports = {
  pathTraversalAttempt,
};
