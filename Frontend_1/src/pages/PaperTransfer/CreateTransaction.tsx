import FileUpload from './FileUpload';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

export default function CreateTransaction() {
  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="New Transaction" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
           Paper Transfer to Moderation
          </h3>
        </div>

        <div className="p-6.5">
          {/* File Upload Section */}
          <div>
            <FileUpload />
          </div>
        </div>
      </div>
    </div>
  );
}
