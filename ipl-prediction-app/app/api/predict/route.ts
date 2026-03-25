import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export async function POST(request: Request) {
     try {
          const body = await request.json();
          const { team1, team2, venue, toss_winner, toss_decision } = body;

          if (!team1 || !team2 || !venue || !toss_winner || !toss_decision) {
               return NextResponse.json({ error: "All fields are required" }, { status: 400 });
          }

          const predictScript = path.join(process.cwd(), "ml-model", "predict.py");

          const result = await new Promise<string>((resolve, reject) => {
               const python = spawn("python3", [predictScript]);
               let stdout = "";
               let stderr = "";

               python.stdout.on("data", (data: Buffer) => { stdout += data.toString(); });
               python.stderr.on("data", (data: Buffer) => { stderr += data.toString(); });
               python.on("close", (code: number) => {
                    if (code !== 0) reject(new Error(stderr));
                    else resolve(stdout.trim());
               });

               python.stdin.write(JSON.stringify({ team1, team2, venue, toss_winner, toss_decision }));
               python.stdin.end();
          });

          const prediction = JSON.parse(result);
          return NextResponse.json(prediction);
     } catch (error) {
          console.error("Prediction error:", error);
          return NextResponse.json({ error: "Prediction failed" }, { status: 500 });
     }
}
