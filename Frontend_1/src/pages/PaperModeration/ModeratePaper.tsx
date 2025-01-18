import { useState, useEffect } from 'react';
import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import Loader from '../../common/Loader';
import { useParams } from 'react-router-dom';

export default function ModeratePaper() {
  const { paperId, moderatorId } = useParams<{
    paperId: string;
    moderatorId: string;
  }>();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await axiosPrivate.get(
          `papers/view/${paperId}?moderatorId=${moderatorId}`,
          { responseType: 'blob' },
        );
        const url = URL.createObjectURL(response.data);
        setPdfUrl(url);
      } catch (error) {
        console.error('Error fetching PDF:', error);
      }
    };

    fetchPdf();

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [axiosPrivate, paperId, moderatorId]);

  return (
    <div className="flex h-screen bg-gray-100 p-6">
      <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
        {pdfUrl ? (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer fileUrl={pdfUrl} plugins={[defaultLayoutPluginInstance]} />
          </Worker>
        ) : (
          <div className="flex justify-center items-center h-full text-xl text-gray-500">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
}
