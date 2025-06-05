import { resultAtom } from "@/store/result";
import { useAtom } from "jotai";
import React from "react";

function Results({
  setLoading,
  loading,
}: {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}) {
  const [results, setResults] = useAtom(resultAtom);
  return (
    <div className="w-full rounded-md bg-white drop-shadow-xl p-8 flex flex-col items-center gap-6">
      {loading ? (
        <div className="flex items-center justify-center w-20 h-20 animate-spin border-t-2 border-blue-500 rounded-full"></div>
      ) : !results ? (
        <div className="text-center">
          <h2 className="text-xl font-semibold">Results</h2>
          <p className="text-gray-500 mt-2">
            No results available yet. Please upload an image and analyze it.
          </p>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-xl font-semibold">Results</h2>

          <p className="text-xl mt-2 font-bold">
            Predicted Diabetic retinopathy stage :{" "}
            <span
              className={`text-xl mt-2 font-bold ${
                results.prediction in [0, 1]
                  ? "text-blue-600"
                  : results.prediction in [0, 1]
                  ? "text-orange-500"
                  : "text-red-600"
              }`}
            >
              {results.prediction}
            </span>
          </p>

          {/* <p className="text-gray-500 mt-2">
            Confidence: {results.confidence.join(", ")}
          </p> */}
        </div>
      )}
    </div>
  );
}

export default Results;
