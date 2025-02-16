import FileList from './FileList';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

export default function TransferPaper() {
  return (
    <div className="mx-auto container px-4">
      <Breadcrumb pageName="Transfer Paper" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark  mx-auto ">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Paper Transactions
          </h3>
        </div>

        <div className="p-6.5">
          {/* File List Section */}
          <div>
            <FileList />
          </div>
        </div>
      </div>
    </div>
  );
}
