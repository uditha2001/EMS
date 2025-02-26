import { useLocation } from "react-router-dom";

const ResultGrading = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const examinationId = queryParams.get("examinationId");
  const courseCode = queryParams.get("courseCode");

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto">
      ResultGrading
    </div>
  )
}

export default ResultGrading