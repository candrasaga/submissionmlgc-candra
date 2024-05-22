const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');
 
async function predictClassification(model, image) {
    try{
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat()

        
        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = Math.max(...score) * 100;

        const classes = ['Cancer', 'Non-cancer'];

        const classResult = confidenceScore > 50 ? 0 : 1;
        const label = classes[classResult];

        let suggestion;
        
        if (label === 'Cancer') {
            suggestion = "Segera periksa ke dokter!"
        }
        
        if (label === 'Non-cancer') {
            suggestion = "Anda sehat, tetap jaga kesehatan!"
        }

        return { confidenceScore, label, suggestion };

    } catch (error) {
        throw new InputError()
    }

}

module.exports = predictClassification;