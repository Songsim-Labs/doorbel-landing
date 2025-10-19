export default function TestPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Test Page</h1>
        <p className="text-muted-foreground">This is a test page to verify the layout is working</p>
      </div>
      
      <div className="bg-blue-100 p-4 rounded-lg">
        <p className="text-blue-800">
          If you can see this page with the top navigation, the layout is working correctly.
        </p>
      </div>
    </div>
  );
}
