import Sidebar from './Sidebar';

export default function Layout({ children, className = 'page-layout' }) {
  return (
    <div className={className}>
      <Sidebar />
      {children}
    </div>
  );
}
