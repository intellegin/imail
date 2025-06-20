import { Link } from 'react-router-dom'

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4">
    <div className="text-center max-w-md">
      <div className="mb-8">
        <div className="text-8xl font-black text-slate-300 dark:text-slate-600 mb-4">
          404
        </div>
        <div className="text-4xl mb-4">🤔</div>
      </div>

      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">
        Page Not Found
      </h1>

      <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <Link
        to="/"
        className="inline-flex items-center px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
      >
        ← Back to Home
      </Link>
    </div>
  </div>
)

export default NotFoundPage
