import Navbar from "~/components/Navbar";
import { type FormEvent, useState } from "react";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/libs/puter";
import { useNavigate } from "react-router";
import { generateUUID } from "~/utils";
import { prepareInstructions } from "~/constants";
import SEO from "~/components/SEO";
const convertPdfToImage = async (file: File) => {
  const { convertPdfToImage: converter } = await import("~/libs/pdfToImage");
  return converter(file);
};
export const meta = () => {
  return [
    {
      title: "ResuAIze | Upload Resume",
    },
    {
      name: "description",
      content:
        "Upload Your Resume for an ATS Score and to get Reviewed by A.I and get Personalized Suggestions",
    },
  ];
};
const Upload = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    companyName: "",
    jobTitle: "",
    jobDescription: ""
  });
  const [files, setFiles] = useState<File | null>(null);

  // Error State
  const [errors, setErrors] = useState({
    companyName: "",
    jobTitle: "",
    jobDescription: "",
    files: ""
  });

  const { fs, auth, isLoading, ai, kv } = usePuterStore();
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      companyName: "",
      jobTitle: "",
      jobDescription: "",
      files: ""
    };

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company Name is required";
      isValid = false;
    } else if (formData.companyName.length > 50) {
      newErrors.companyName = "Company Name cannot exceed 50 characters";
      isValid = false;
    }

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "Job Title is required";
      isValid = false;
    } else if (formData.jobTitle.length > 50) {
      newErrors.jobTitle = "Job Title cannot exceed 50 characters";
      isValid = false;
    }

    if (!formData.jobDescription.trim()) {
      newErrors.jobDescription = "Job Description is required";
      isValid = false;
    } else if (formData.jobDescription.length > 2000) {
      newErrors.jobDescription = "Job Description cannot exceed 2000 characters";
      isValid = false;
    }

    if (!files) {
      newErrors.files = "Please upload a resume (PDF)";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };


  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!files) return;

    handleAnalyze({
      companyName: formData.companyName,
      jobTitle: formData.jobTitle,
      jobDescription: formData.jobDescription,
      file: files
    });
  };

  const handleFileSelect = (file: File | null) => {
    setFiles(file);
    if (file) {
      setErrors(prev => ({ ...prev, files: "" }));
    }
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    setIsProcessing(true);
    setStatusText("Uploading the file....");
    const uploadFile = await fs.upload([file]);
    if (!uploadFile) return setStatusText("Error failed to upload file");
    setStatusText("Coverting to image");
    const imageFile = await convertPdfToImage(file);
    if (!imageFile)
      return setStatusText("Error failed to convert PDF to Image");
    if (!imageFile.file) return setStatusText("Error failed to convert PDF to Image");
    const uploadImage = await fs.upload([imageFile.file]);
    if (!uploadImage) return setStatusText("Error failed to upload image");
    setStatusText("Preparing data....");
    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadFile.path,
      imagePath: uploadImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedBack: "",
    };
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText("Analyzing");
    const feedBack = await ai.feedback(
      uploadFile.path,
      prepareInstructions({ jobTitle, jobDescription }),
    );
    if (!feedBack) return setStatusText("Error failed to analyze resume");
    const feedBackText =
      typeof feedBack.message.content === "string"
        ? feedBack.message.content
        : feedBack.message.content[0].text;
    data.feedBack = JSON.parse(feedBackText);
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText("Analysis complete, redirecting...");
    navigate(`/resume/${uuid}`);
    console.log(data);
  };
  return (
    <main className={"bg-[url('/images/bg-main.svg')] bg-cover"}>
      <SEO
        title="Upload Resume |  ResuAIze"
        description="Upload your resume and get instant ATS score, keyword suggestions, and improvements using AI."
        keywords="ResuAIze, Upload Resume, ATS Resume Score, Resume AI Review"
        url="https://resuaize.vercel.app/upload"
      />

      <Navbar />
      <section className={"main-section"}>
        <div className="page-heading py-5">
          <h1>Smart Feedback for Your Dream Job</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img
                src={"/images/resume-scan.gif"}
                alt={"Resume Scan"}
                className={"w-full"}
              />
            </>
          ) : (
            <h2>Drop your resume for an ATS score and improvement tips</h2>
          )}
          {!isProcessing ? (
            <form
              id={"upload-form"}
              onSubmit={handleSubmit}
              className={"flex flex-col gap-4 mt-8"}
            >
              <div className={"form-div"}>
                <label htmlFor={"company-name"}>Company Name</label>
                <input
                  name={"companyName"}
                  placeholder={"Company Name"}
                  type="text"
                  id="company-name"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className={errors.companyName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                />
                {errors.companyName && <span className="text-red-500 text-sm mt-1">{errors.companyName}</span>}
              </div>
              <div className={"form-div"}>
                <label htmlFor={"job-title"}>Job Title</label>
                <input
                  name={"jobTitle"}
                  placeholder={"Job Title"}
                  type="text"
                  id="job-title"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  className={errors.jobTitle ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                />
                {errors.jobTitle && <span className="text-red-500 text-sm mt-1">{errors.jobTitle}</span>}
              </div>
              <div className={"form-div"}>
                <label htmlFor={"job-description"}>Job Description</label>
                <textarea
                  name={"jobDescription"}
                  placeholder={"Job Description"}
                  className={`resize-none ${errors.jobDescription ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                  rows={5}
                  id="job-description"
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                />
                {errors.jobDescription && <span className="text-red-500 text-sm mt-1">{errors.jobDescription}</span>}
              </div>
              <div className={"form-div"}>
                <label htmlFor={"uploader"}>Upload Resume</label>
                {/*<input name={"uploader"} placeholder={"Upload Resume"}   type="file" id="uploader"/>*/}
                <FileUploader onUploadProgress={handleFileSelect} />
                {errors.files && <span className="text-red-500 text-sm mt-1">{errors.files}</span>}
                <button className={"primary-button"} type={"submit"}>
                  Analyze Resume
                </button>
              </div>
            </form>
          ) : (
            <></>
          )}
        </div>
      </section>
    </main>
  );
};
export default Upload;
