const { spawn } = require("child_process");
const path = require("path");

const PREDICT_SCRIPT = path.join(__dirname, "../../ml-model/predict.py");

function runPrediction(inputData) {
     return new Promise((resolve, reject) => {
          const python = spawn("python3", [PREDICT_SCRIPT]);
          let stdout = "";
          let stderr = "";

          python.stdout.on("data", (data) => {
               stdout += data.toString();
          });

          python.stderr.on("data", (data) => {
               stderr += data.toString();
          });

          python.on("close", (code) => {
               if (code !== 0) {
                    reject(new Error(`Python process exited with code ${code}: ${stderr}`));
                    return;
               }
               try {
                    const result = JSON.parse(stdout.trim());
                    resolve(result);
               } catch (e) {
                    reject(new Error(`Failed to parse prediction output: ${stdout}`));
               }
          });

          python.stdin.write(JSON.stringify(inputData));
          python.stdin.end();
     });
}

module.exports = { runPrediction };
