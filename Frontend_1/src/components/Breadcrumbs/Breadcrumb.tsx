import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  pageName?: string;
  items?: BreadcrumbItem[];
}

const Breadcrumb = ({ pageName, items }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="font-semibold text-black dark:text-white">
        {pageName || (items ? items[items.length - 1].label : 'Dashboard')}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" to="/dashboard">
              Dashboard /
            </Link>
          </li>
          {items && items.length > 0 ? (
            items.map((item, index) => (
              <li key={index} className="flex items-center">
                {item.path ? (
                  <Link className="font-medium" to={item.path}>
                    {item.label} /
                  </Link>
                ) : (
                  <span className="font-medium text-primary">{item.label}</span>
                )}
              </li>
            ))
          ) : (
            pageName && <li className="font-medium text-primary">{pageName}</li>
          )}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
