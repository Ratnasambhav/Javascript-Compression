exports.compress = data => {
  var input = data;
  var start = process.hrtime();
  var encoded = "";
  codes = {}
  var freqs = {};
  function frequency(str) {
    for (var i in str) {
      if (freqs[str[i]] == undefined) {
        freqs[str[i]] = 1;
      }
      else {
        freqs[str[i]] = freqs[str[i]] + 1;
      }
    }
    return freqs;
  }

  function sortfreq(freqs) {
    var tuples = [];
    for (var let in freqs) {
      tuples.push([freqs[let], let]);
    }
    return tuples.sort();
  }
  function buildTree(tuples) {
    while (tuples.length > 1) {
      leastTwo = [tuples[0][1], tuples[1][1]]
      theRest = tuples.slice(2, tuples.length);
      combFreq = tuples[0][0] + tuples[1][0];
      tuples = theRest;
      end = [combFreq, leastTwo];
      tuples.push(end);
      tuples.sort();
    }
    return tuples[0][1];
  }

  w = frequency(input);
  tuples = sortfreq(w);
  tree = buildTree(tuples);
  code = {};
  pat = '';
  function assignCode(node, pat) {
    if (typeof (node) == typeof (""))
      code[node] = pat;
    else {
      assignCode(node[0], pat + '0');
      assignCode(node[1], pat + '1');
    }
    if (typeof (node)) {
      return;
    }
  }
  assignCode(tree, pat);
  function encode(string) {
    output = '';
    for (s in string)
      output += code[string[s]];
    return output;
  }
  encoded = encode(input);
  var compressionTime = process.hrtime(start);
  var ratio = (input.length / encoded.length) * 8;
  return {
    compressed: encoded,
    compressionTime,
    ratio,
    code
  }
}

exports.decompress = (code, encoded) => {
  var str = "";
  var decompressed = "";
  var flag = 0;
  const start = process.hrtime()
  for (ch in encoded) {
    ch = encoded[ch];
    str += ch;
    for (k in code) {
      if (code[k] == str) {
        decompressed += k; str = "";
        break;
      }
    }
  }
  const decompressionTime = process.hrtime(start)
  return { decompressed, decompressionTime };
}