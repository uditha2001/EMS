import FileUpload from './FileUpload';
import FileList from './FileList';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

export default function TransferPaper() {
  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Transfer Paper" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Paper Transactions
          </h3>
        </div>

        <div className="p-6.5">
         
          {/* File Upload Section */}
          <div className="mb-6">
            <FileUpload />
          </div>

          {/* Divider between File Upload and File List */}
          <div className="my-6 border-t border-gray-300"></div>

          {/* File List Section */}
          <div className="mb-6">
            <FileList />
          </div>
        </div>
      </div>
    </div>
  );
}
