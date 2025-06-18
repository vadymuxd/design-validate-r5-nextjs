interface PageLoaderProps {
  isVisible: boolean;
}

export function PageLoader({ isVisible }: PageLoaderProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
      <div className="w-full max-w-[730px] flex flex-col items-center justify-center min-h-[300px]">
        {/* Crop loading GIF to show full width and crop 10% top and bottom */}
        <div style={{ width: 240, height: 192, overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src="/gifs/Pi-Slices Loading.gif"
            alt="Loading..."
            style={{
              width: 240,
              height: 240,
              objectFit: 'cover',
              display: 'block',
              position: 'absolute',
              left: 0,
              top: -24
            }}
          />
        </div>
      </div>
    </div>
  );
} 