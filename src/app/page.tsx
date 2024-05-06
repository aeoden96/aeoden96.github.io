import MyCanvas from "@/components/MyCanvas";

export default function Home() {
  return (
    <main className="flex  flex-col items-center justify-center gap-4 p-4 md:p-24 h-screen">
      <MyCanvas />
      {/* <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold">Hello, World!</h1>
        <p className="text-lg">
          This is a simple Next.js app with Tailwind CSS and TypeScript.
        </p>
      </div> */}
    </main>
  );
}
