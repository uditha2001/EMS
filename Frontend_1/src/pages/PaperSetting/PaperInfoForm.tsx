import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface PaperInfoProps {
  paperInfo: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
  setPaperInfo: React.Dispatch<React.SetStateAction<any>>;
}

const PaperInfoForm: React.FC<PaperInfoProps> = ({ paperInfo, handleInputChange, setPaperInfo }) => {
  const quillModules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ align: [] }],
      ['link'],
      ['blockquote', 'code-block'],
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
      {['university', 'degree', 'courseCode', 'examYear', 'semester', 'duration'].map((field) => (
        <div key={field}>
          <label className="mb-2.5 block text-black dark:text-white">{field.replace(/([A-Z])/g, ' $1')}</label>
          <input
            className="input-field w-full"
            type="text"
            value={paperInfo[field]}
            onChange={(e) => handleInputChange(e, field)}
          />
        </div>
      ))}
      <div className="col-span-full">
        <label className="mb-2.5 block text-black dark:text-white">Instructions</label>
        <ReactQuill
          value={paperInfo.instructions}
          onChange={(value) => setPaperInfo({ ...paperInfo, instructions: value })}
          modules={quillModules}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default PaperInfoForm;
