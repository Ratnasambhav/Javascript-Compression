exports.compress = string => {
  const input = stringToASCII(string)
  const k = 4
  const M = 2 ** 4
  let output = []
  const start = process.hrtime()
  const array = input.split(' ').slice(0, -1)
  array.forEach(x => {
    let code = (x & (M - 1)).toString(2)
    code = '0'.repeat(k - code.length) + code
    code = unary(x >> k) + code
    output.push(code)
  })
  const compressionTime = process.hrtime(start)
  const compressed = output.join(' ')
  const ratio = (input.length / compressed.length) * 8;
  return { compressed, ratio, compressionTime }
}

exports.decompress = string => {
  const k = 4
  const M = 2 ** 4
  let decompressed = ''
  compressed = string.split(' ')
  const start = process.hrtime()
  compressed.forEach(x => {
    var Q = x.indexOf('0') + 1;
    var R = parseInt(x.slice(Q, Q + k), 2);
    var S = (Q * M) + R;
    decompressed += String.fromCharCode(S);
  })
  const decompressionTime = process.hrtime(start)
  return { decompressed, decompressionTime }
}

// Helper function for Rice encoding and Arithmatic encoding
function stringToASCII(str) {
  let output = ''
  for (var i = 0; i < str.length; i++) {
    output += str[i].charCodeAt(0) + ' '
  }
  return output
}

// Helper function for Rice encoding
function unary(n) {
  if (n == 0) {
    return '0'
  }
  return ('1').repeat(n - 1) + '0'
}
