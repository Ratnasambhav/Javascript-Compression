exports.compress = string => {
  let input = string;
  const start = process.hrtime()
  let compressed = "";
  let encoding = [];
  let prev, count, i;
  for (count = 1, prev = input[0], i = 1; i < input.length; i++) {
    if (input[i] != prev) {
      encoding.push([count, prev]);
      compressed += prev + count;
      count = 1;
      prev = input[i];
    }
    else
      count++;
  }
  encoding.push([count, prev]);
  compressed += prev + count;
  const compressionTime = process.hrtime(start)
  const ratio = input.length / compressed.length;
  return { compressed, ratio, compressionTime }
}

exports.decompress = string => {
  let decompressed = "";
  const start = process.hrtime()
  for (let i = 0; i < string.length - 1; i += 2) {
    decompressed += string[i].repeat(string[i + 1]);
  }
  const decompressionTime = process.hrtime(start)
  return { decompressed, decompressionTime };
}
