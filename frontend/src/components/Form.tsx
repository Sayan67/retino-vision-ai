import React from "react";
import { Button } from "./ui/button";
import { analyseImage } from "@/services/analyse";
import { useAtom } from "jotai";
import { resultAtom } from "@/store/result";

function Form({
  setLoading,
  loading,
}: {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [formData, setFormData] = React.useState<FormData | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [results, setResults] = useAtom(resultAtom);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    if (!formData?.get("file")) {
      alert("Please upload a file first.");
      setLoading(false);
      return;
    }
    try {
      const res = await analyseImage(formData.get("file") as File);
      setLoading(false);
      if (res) {
        setResults({
          prediction: res.prediction,
          confidence: res.confidence,
        });
        console.log("Analysis results:", res);
      }
    } catch (error) {
      setLoading(false);
      console.log("Error submitting form data:", error);
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      console.log("File selected:", formData.get("file"));
      setFormData(formData);
      setPreviewUrl(URL.createObjectURL(file));
      setResults(undefined);
    }
  }
  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="sm:min-w-[500px] rounded-md bg-white drop-shadow-xl p-8 flex flex-col items-center gap-6"
    >
      <h1 className="text-2xl font-bold">Retino Vision AI</h1>
      {/* <label
        htmlFor="uploadFile1"
        className="bg-white text-slate-500 font-semibold text-base rounded max-w-md h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed w-full px-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-11 mb-3 fill-gray-500"
          viewBox="0 0 32 32"
        >
          <path
            d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
            data-original="#000000"
          />
          <path
            d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
            data-original="#000000"
          />
        </svg>
        Upload file
        <input
          type="file"
          onChange={handleChange}
          id="uploadFile1"
          className="hidden"
          accept=".png, .jpg, .jpeg, .svg, .webp"
          disabled={loading}
        />
        <p className="text-xs font-medium text-slate-400 mt-2">
          PNG, JPG SVG, WEBP are Allowed.
        </p>
      </label> */}

      <div className="flex items-center justify-center w-full flex-col">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
          <input
            onChange={handleChange}
            id="dropzone-file"
            type="file"
            className="hidden"
            accept=".png, .jpg, .jpeg, .svg, .webp"
          />
        </label>
        {formData ? (
          <div>
            <span className=" bg-green-50 px-1 border border-green-300 rounded text-green-500 mt-2 flex items-center gap-1">
              File ready for analysis: {(formData.get("file") as File).name}
            </span>
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-4 max-w-xs max-h-60 rounded border"
              />
            )}
          </div>
        ) : (
          <span className="text-xs text-red-500 mt-2">No file selected.</span>
        )}
      </div>

      <Button
        type="submit"
        className="w-full cursor-pointer disabled:cursor-not-allowed"
        disabled={loading || !formData?.get("file")}
      >
        Analyze
      </Button>
    </form>
  );
}

export default Form;
