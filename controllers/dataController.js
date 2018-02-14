const mongoose = require('mongoose')
const Data = mongoose.model('Data')
const rice = require('../algorithms/rice')
const rle = require('../algorithms/rle')
const huffman = require('../algorithms/huffman')
const hybrid = require('../algorithms/hybrid')

exports.getStats = async (req, res) => {
  const text = req.body.text

  // compression and decompression
  const riceC = await rice.compress(text)
  const riceD = await rice.decompress(riceC.compressed)
  const rleC = await rle.compress(text)
  const rleD = await rle.decompress(rleC.compressed)
  const huffmanC = await huffman.compress(text)
  const huffmanD = await huffman.decompress(huffmanC.code, huffmanC.compressed)

  // hybrid algorithms
  const huffman_rleC = await hybrid.huffman_rle_compression(text)
  const huffman_rleD = await hybrid.huffman_rle_decompression(huffman_rleC.code, huffman_rleC.compressed)
  const rice_rleC = await hybrid.rice_rle_compression(text)
  const rice_rleD = await hybrid.rice_rle_decompression(rice_rleC.compressed)

  const riceData = ['Rice Encoding', riceC, riceD]
  const rleData = ['Run Length Encoding', rleC, rleD]
  const huffmanData = ['Huffman Encoding', huffmanC, huffmanD]
  const huffman_rleData = ['Huffman-RLE Hybrid Encoding', huffman_rleC, huffman_rleD]
  const rice_rleData = ['Rice-RLE Hybrid Encoding', rice_rleC, rice_rleD]
  const data = { text, riceData, rleData, huffmanData, rice_rleData, huffman_rleData }

  const ratios = [riceC.ratio, rleC.ratio, huffmanC.ratio, huffman_rleC.ratio, rice_rleC.ratio]
  const bestRatio = Math.max.apply(null, ratios)
  let best, bestAlgo, saveThis
  ratios.map((ratio, i) => {
    if (ratio === bestRatio)
      best = i
  })
  switch (best) {
    case 0:
      bestAlgo = 'Rice Compression'
      saveThis = { algoName: 'rice', compressed: riceC.compressed }
      break
    case 1:
      bestAlgo = 'RLE Compression'
      saveThis = { algoName: 'rle', compressed: rleC.compressed }
      break
    case 2:
      bestAlgo = 'Huffman Compression'
      saveThis = { algoName: 'huffman', compressed: huffmanC.compressed, code: huffmanC.code }
      break
    case 3:
      bestAlgo = 'Huffman-RLE Hybrid Compression'
      saveThis = { algoName: 'huffman_rle', compressed: huffman_rleC.compressed, code: huffman_rleC.code }
      break
    case 4:
      bestAlgo = 'Rice-RLE Hybrid Compression'
      saveThis = { algoName: 'rice_rle', compressed: rice_rleC.compressed }
      break
  }
  saveThis.name = text.length >= 10 ? (text.split(' ').slice(0, 10).join(' ') + '...') : text
  res.render('results', { data, bestAlgo, saveThis })
}

exports.save = async (req, res) => {
  const data = await (new Data(req.body)).save()
  req.flash('success', `Successfully Added ${data.name}`)
  res.redirect('/saved')
}

exports.getSaved = async (req, res) => {
  const saves = await Data.find()
  res.render('saved', { saves })
}

exports.retrive = async (req, res) => {
  const data = await Data.findById(req.params.id)
  let decompressed = ''
  switch (data.algoName) {
    case 'rice':
      decompressed = await rice.decompress(data.compressed)
      break
    case 'rle':
      decompressed = await rle.decompress(data.compressed)
      break
    case 'huffman':
      decompressed = await huffman.decompress(JSON.parse(data.code), data.compressed)
      break
    case 'rice_rle':
      decompressed = await hybrid.rice_rle_decompression(data.compressed)
      break
    case 'huffman_rle':
      decompressed = await hybrid.huffman_rle_decompression(JSON.parse(data.code), data.compressed)
      break
  }

  // res.send(decompressed.decompressed)
  // res.render('decomp', { data: decompressed })
  // TODO: CSS is not loading in decomp.pug. Fix that!
  res.json(decompressed.decompressed)
}
