import { Suspense, use } from 'react';
import GalleryClientContent from '@/components/GalleryClientContent';

interface GalleryPageProps {
  params: Promise<{ code: string }>;
}

function GalleryWrapper({ params }: { params: Promise<{ code: string }> }) {
  const resolved = use(params);
  return <GalleryClientContent code={resolved.code || ''} />;
}

export default function GalleryPage({ params }: GalleryPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-amber-400">
          Loading gallery...
        </div>
      }
    >
      <GalleryWrapper params={params} />
    </Suspense>
  );
}
