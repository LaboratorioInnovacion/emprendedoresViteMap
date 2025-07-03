// Página de detalle de negocio
import BusinessDetailPage from '../../../components/pages/BusinessDetailPage';
import { useParams } from 'next/navigation';

export default function BusinessDetail() {
  const params = useParams();
  return <BusinessDetailPage id={params.id} />;
}
