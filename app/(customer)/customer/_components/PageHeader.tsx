interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

/** Kepala halaman customer: judul + deskripsi singkat, tanpa label dekoratif. */
export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <section className="pb-6 pt-10 sm:pt-14" style={{ backgroundColor: "#FAF8FF" }}>
      <div className="mx-auto max-w-[1280px] px-5 sm:px-6">
        <div className="c-rise flex max-w-2xl flex-col gap-3">
          <h1
            className="text-[34px] font-bold leading-[1.08] sm:text-[44px]"
            style={{ color: "#00236F", letterSpacing: "-0.03em" }}
          >
            {title}
          </h1>
          {description && (
            <p className="text-[16px] leading-[26px]" style={{ color: "#444651" }}>
              {description}
            </p>
          )}
        </div>
        {children && <div className="c-rise mt-6" style={{ animationDelay: "80ms" }}>{children}</div>}
      </div>
    </section>
  );
}
