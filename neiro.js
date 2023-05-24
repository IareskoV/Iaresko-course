const fs = require("fs");
const csv = require("csv-parser");
const tf = require("@tensorflow/tfjs");

const csvPath = "neiro/your_updated_file.csv";

// Step 1: Preprocess the CSV data
const dataset = [];
fs.createReadStream(csvPath)
  .pipe(csv())
  .on("data", (row) => {
    dataset.push(row);
  })
  .on("end", () => {
    const xs = dataset.map((row) => {
      const inputs = Object.values(row).slice(1).map(Number);
      return inputs;
    });

    const eventTypes = dataset.map((row) => row.EVENT_TYPE);
    const uniqueEventTypes = [...new Set(eventTypes)];
    const labelMap = new Map(
      uniqueEventTypes.map((type, index) => [type, index])
    );

    const ys = eventTypes.map((eventType) => labelMap.get(eventType));

    const xsTensor = tf.tensor2d(xs);
    const ysTensor = tf.tensor1d(ys, "int32");

    const [normalizedXs, normalizedYs, dataMean, dataStd] = normalizeTensor(
      xsTensor,
      ysTensor
    );

    // Step 2: Split the dataset
    const { xsTrain, xsTest, ysTrain, ysTest } = convertToTensor(
      normalizedXs,
      normalizedYs,
      0.8
    );

    // Step 3: Define the model architecture
    const model = tf.sequential();
    model.add(
      tf.layers.dense({ units: 32, activation: "relu", inputShape: [12] })
    );
    model.add(tf.layers.dense({ units: 3, activation: "softmax" }));

    // Step 4: Train the model
    model.compile({
      loss: "categoricalCrossentropy",
      optimizer: "adam",
      metrics: ["accuracy"],
    });
    const epochs = 50;
    const batchSize = 32;
    model
      .fit(xsTrain, ysTrain, {
        epochs,
        batchSize,
        validationData: [xsTest, ysTest],
        callbacks: tf.node.tensorBoard("logs/fit"),
      })
      .then((history) => {
        console.log(history);

        // Step 5: Evaluate the model
        const [loss, accuracy] = model.evaluate(xsTest, ysTest);
        console.log("Test loss:", loss);
        console.log("Test accuracy:", accuracy);

        // Step 6: Save the trained model
        model
          .save("file://path/to/save/model")
          .then(() => {
            console.log("Model saved.");
          })
          .catch((error) => {
            console.error("Error saving model:", error);
          });
      });
  });

function convertToTensor(xs, ys, testSplit) {
  const numExamples = xs.shape[0];
  const numTestExamples = Math.round(numExamples * testSplit);
  const numTrainExamples = numExamples - numTestExamples;

  // Shuffle and split the data
  const indices = tf.util.createShuffledIndices(numExamples);
  const shuffledXs = xs.gather(indices);
  const shuffledYs = ys.gather(indices);

  const xsTrain = shuffledXs.slice([0, 0], [numTrainExamples, -1]);
  const xsTest = shuffledXs.slice([numTrainExamples, 0], [numTestExamples, -1]);
  const ysTrain = shuffledYs.slice([0, 0], [numTrainExamples, -1]);
  const ysTest = shuffledYs.slice([numTrainExamples, 0], [numTestExamples, -1]);

  return { xsTrain, xsTest, ysTrain, ysTest };
}

function normalizeTensor(xs, ys) {
  const { dataMean, dataStd } = tf.moments(xs, 0);
  const normalizedXs = xs.sub(dataMean).div(dataStd);

  return [normalizedXs, ys];
}
