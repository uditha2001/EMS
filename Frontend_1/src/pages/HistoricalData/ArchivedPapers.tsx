import { useEffect, useState } from "react";
import useApi from "../../api/api";
import Loader from "../../common/Loader";


const ArchivedPapers = () => {
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const{getArchivedPapers,
    getArchivedPaperById,
    archivePapersManually,
    deleteArchivedPaper,
    downloadArchivedPaper,
    uploadArchivedPaper,} = useApi();

  useEffect(() => {
    fetchArchivedPapers();
  }, []);

  const fetchArchivedPapers = async () => {
    setLoading(true);
    try {
      const response = await getArchivedPapers();
      setPapers(response.data);
    } catch (error) {
      console.error("Error fetching papers", error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteArchivedPaper(id);
      fetchArchivedPapers();
    } catch (error) {
      console.error("Error deleting paper", error);
    }
  };

  const handleDownload = async (id: number) => {
    try {
      const response = await downloadArchivedPaper(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `paper_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading paper", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Archived Papers</h1>
      {loading ? (
        <p><Loader/></p>
      ) : (
        <ul>
          {papers.map((paper) => (
            <li key={paper.id} className="flex justify-between items-center p-2 border-b">
              <span>{paper.title}</span>
              <div>
                <button onClick={() => handleDownload(paper.id)} className="mr-2 bg-blue-500 text-white p-1 rounded">Download</button>
                <button onClick={() => handleDelete(paper.id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ArchivedPapers;
