const tf = require('@tensorflow/tfjs-node');
async function loadModel() {
    return tf.loadGraphModel(process.env.MODEL_BISINDO);
}
module.exports = loadModel; 