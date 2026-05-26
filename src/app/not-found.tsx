import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24 text-center">
      <p className="text-6xl font-semibold text-text-primary mb-4">404</p>
      <h1 className="text-xl font-medium text-text-primary mb-2">
        页面未找到
      </h1>
      <p className="text-text-secondary mb-8">
        你访问的页面不存在或已被移除。
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link
          href="/"
          className="px-4 py-2 bg-accent text-white text-sm rounded-lg hover:bg-accent-hover transition-colors"
        >
          返回首页
        </Link>
        <Link
          href="/archive"
          className="px-4 py-2 border border-border text-text-secondary text-sm rounded-lg hover:bg-surface-hover transition-colors"
        >
          浏览归档
        </Link>
      </div>
    </div>
  );
}
