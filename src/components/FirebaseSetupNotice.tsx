export default function FirebaseSetupNotice() {
  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-3">
        <h1 className="text-xl font-semibold">Firebase isn&apos;t configured yet</h1>
        <p className="text-sm text-gray-600">
          Create a Firebase project (Authentication + Firestore), then copy{" "}
          <code className="bg-gray-100 px-1 rounded">.env.local.example</code> to{" "}
          <code className="bg-gray-100 px-1 rounded">.env.local</code> and fill in
          your project&apos;s web app config. Restart the dev server afterwards.
        </p>
        <p className="text-xs text-gray-400">See README.md for the full setup steps.</p>
      </div>
    </div>
  );
}
