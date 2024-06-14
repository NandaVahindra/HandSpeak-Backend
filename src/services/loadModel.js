const tf = require('@tensorflow/tfjs-node');
async function loadModel(modelPath) {
    return tf.loadGraphModel(modelPath);
}
module.exports = loadModel; 