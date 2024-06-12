const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');
 
async function predictClassification(model, image) {
    try{
        const tensor = tf.node
        .decodeJpeg(image, 3)
        .resizeNearestNeighbor([224, 224])
        .expandDims()
        .toFloat()
    
        const prediction = model.predict(tensor);
        const predictionData = prediction.dataSync();
        // show prediction data(to see the model/prediction accuracy)
        // console.log('Prediction data:', predictionData);

        const classes = Array.from({ length: 26 }, (_, i) => `${String.fromCharCode(97 + i)}`);

        const predictedClassIndex = predictionData.indexOf(Math.max(...predictionData));
        const predictedClass = classes[predictedClassIndex];

        return predictedClass;
    } catch (error){
        throw new InputError(`Terjadi kesalahan input: ${error.message}`);
    }
}

module.exports = predictClassification;