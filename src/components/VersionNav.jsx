import { useLocation, Link } from 'react-router-dom';

const VERSIONS = [
  { path: '/1', label: 'Brutalist' },
  { path: '/2', label: 'Luxury' },
  { path: '/3', label: 'Terminal' },
  { path: '/4', label: 'Organic' },
  { path: '/5', label: 'Memphis' },
];

export default function VersionNav({ style = {} }) {
  const { pathname } = useLocation();

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      gap: 0,
      padding: '0 16px',
      ...style,
    }}>
      <Link
        to="/"
        style={{
          textDecoration: 'none',
          marginRight: 16,
          fontSize: 13,
          opacity: 0.7,
          color: 'inherit',
        }}
      >
        ← Home
      </Link>
      {VERSIONS.map(({ path, label }, i) => (
        <Link
          key={path}
          to={path}
          style={{
            textDecoration: 'none',
            color: 'inherit',
            padding: '6px 14px',
            fontSize: 12,
            fontWeight: pathname === path ? 700 : 400,
            opacity: pathname === path ? 1 : 0.6,
          }}
        >
          {`0${i + 1} · ${label}`}
        </Link>
      ))}
    </nav>
  );
}
