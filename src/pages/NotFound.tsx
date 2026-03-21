import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Home, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <MainLayout showCartDrawer={false}>
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 px-4">
        <AlertCircle className="mx-auto h-24 w-24 text-muted-foreground" />
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold">{t('errors.pageNotFound')}</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          {t('errors.pageNotFoundDesc')}
        </p>
        <Button size="lg" onClick={() => navigate('/')}>
          <Home className="mr-2 h-5 w-5" />
          {t('common.backToHome')}
        </Button>
      </div>
    </div>
    </MainLayout>
  );
}
