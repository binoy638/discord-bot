module.exports = async (input) => {
  try {
    // stereo to mono channel
    const data = new Int16Array(input);
    const ndata = new Int16Array(data.length / 2);
    for (let i = 0, j = 0; i < data.length; i += 4) {
      ndata[j++] = data[i];
      ndata[j++] = data[i + 1];
    }

    return Buffer.from(ndata);
  } catch (e) {
    console.log(e);
    console.log("convert_audio: " + e);
    throw e;
  }
};
