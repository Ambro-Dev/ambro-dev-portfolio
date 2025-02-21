import Link from "next/link";
import { Home, RefreshCw } from "lucide-react";

export default function NotFound() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex items-center justify-center px-4">
			<div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
				<div className="p-8 text-center">
					<h1 className="text-4xl font-bold text-blue-600 mb-4">404</h1>
					<p className="text-2xl font-semibold text-gray-800 mb-4">
						Oops! Page Not Found
					</p>
					<div className="relative mb-8">
						<div className="absolute inset-0 flex items-center justify-center">
							<RefreshCw className="text-blue-500 animate-spin" size={120} />
						</div>
						<div className="relative z-10 text-9xl font-bold text-blue-100">
							404
						</div>
					</div>
					<p className="text-gray-600 mb-8">
						The page you&apos;re looking for doesn&apos;t exist or has been
						moved.
					</p>
					<Link
						href="/"
						className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
					>
						<Home className="mr-2" size={20} />
						Go Home
					</Link>
				</div>
			</div>
		</div>
	);
}
