import Image from "next/image";

/** 六个作品共用同一套真实运行截图命名，禁止再用虚构 demo 域名或抽象占位图。 */
export default function ProjectScreenshot({
  slug,
  title,
  priority = false,
  className = "",
}: {
  slug: string;
  title: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={`/work/${slug}.png`}
      alt={`${title} · actual interface screenshot`}
      fill
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 640px"
      className={`object-cover object-top ${className}`}
    />
  );
}
