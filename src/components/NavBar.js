import { useRouter } from 'next/router';

export default function NavBar() {
  const router = useRouter();

  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{ borderBottom: '1px solid black' }}>
      <div className="container">
        <a
          className="navbar-brand"
          href="#"
          style={{ fontWeight: '700', fontSize: '24px' }} 
          onClick={() => router.push('/')}
        >
          [ TOURNEST ]
        </a>
      </div>
    </nav>
  );
}