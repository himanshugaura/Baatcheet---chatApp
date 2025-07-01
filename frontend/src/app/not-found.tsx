// app/not-found.tsx
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-800 text-center" >
      <div className="max-w-md w-full">
        
        {/* SVG from public folder */}
        <div className="flex justify-center">
          <Image 
            src="/images/404-computer.svg"
            alt="404 Illustration"
            width={500}
            height={500}
            className="w-fit h-fit"
          />
        </div>

          {/* 404 Heading */}
          <h1 className="text-3xl font-bold text-blue-600">404 Not Found</h1>
        
        {/* Error Message */}
        <p className="text-xl font-bold text-white">Whoops! That page doesn&apos;t exist.</p>

      </div>
    </div>
  )
}