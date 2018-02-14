const huffman = require('./huffman')
const rice = require('./rice')
const rle = require('./rle')

// Huffman-RLE compression
exports.huffman_rle_compression = string => {
  huffmanC = huffman.compress(string)
  rleC = rle.compress(huffmanC.compressed)
  let compressionTime = [0, 0]
  compressionTime[0] = huffmanC.compressionTime[0] + rleC.compressionTime[0]
  compressionTime[1] = huffmanC.compressionTime[1] + rleC.compressionTime[1]
  const ratio = huffmanC.ratio * rleC.ratio
  return { compressed: rleC.compressed, ratio, compressionTime, code: huffmanC.code }
}

// Huffman-RLE decompression
exports.huffman_rle_decompression = (code, string) => {
  rleD = rle.decompress(string)
  huffmanD = huffman.decompress(code, rleD.decompressed)
  let decompressionTime = [0, 0]
  decompressionTime[0] = huffmanD.decompressionTime[0] + rleD.decompressionTime[0]
  decompressionTime[1] = huffmanD.decompressionTime[1] + rleD.decompressionTime[1]
  return { decompressed: huffmanD.decompressed, decompressionTime }
}

// Rice-RLE compression
exports.rice_rle_compression = string => {
  riceC = rice.compress(string)
  rleC = rle.compress(riceC.compressed)
  let compressionTime = [0, 0]
  compressionTime[0] = riceC.compressionTime[0] + rleC.compressionTime[0]
  compressionTime[1] = riceC.compressionTime[1] + rleC.compressionTime[1]
  ratio = riceC.ratio * rleC.ratio
  return { compressed: rleC.compressed, ratio, compressionTime }
}

// Rice-RLE decompression
exports.rice_rle_decompression = string => {
  rleD = rle.decompress(string)
  riceD = rice.decompress(rleD.decompressed)
  let decompressionTime = [0, 0]
  decompressionTime[0] = riceD.decompressionTime[0] + rleD.decompressionTime[0]
  decompressionTime[1] = riceD.decompressionTime[1] + rleD.decompressionTime[1]
  return { decompressed: riceD.decompressed, decompressionTime }
}
