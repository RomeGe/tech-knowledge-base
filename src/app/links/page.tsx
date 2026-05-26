import { Metadata } from "next";

export const metadata: Metadata = {
  title: "资源链接 - 技术知识库",
  description: "收藏的技术资源、工具和参考链接。",
};

interface LinkCategory {
  name: string;
  links: { title: string; url: string; desc: string }[];
}

const linkCategories: LinkCategory[] = [
  {
    name: "嵌入式开发",
    links: [
      { title: "STM32 参考手册", url: "https://www.st.com/resource/en/reference_manual/rm0433-stm32f405415-stm32f407417-stm32f427437-and-stm32f429439-advanced-armbased-32bit-mcus-stmicroelectronics.pdf", desc: "STM32F4 系列官方参考手册" },
      { title: "ESP-IDF 编程指南", url: "https://docs.espressif.com/projects/esp-idf/zh_CN/latest/esp32/", desc: "ESP32 官方开发框架文档" },
      { title: "FreeRTOS 参考", url: "https://www.freertos.org/Documentation/RTOS_book.html", desc: "FreeRTOS 实时操作系统文档" },
      { title: "ARM Cortex-M 编程手册", url: "https://developer.arm.com/documentation/ddi0439/latest", desc: "ARM Cortex-M4 技术参考手册" },
    ],
  },
  {
    name: "硬件设计",
    links: [
      { title: "KiCad", url: "https://www.kicad.org/", desc: "开源 EDA 工具，PCB 设计" },
      { title: "立创 EDA", url: "https://lceda.cn/", desc: "国产在线 PCB 设计工具" },
      { title: "LCSC", url: "https://www.lcsc.com/", desc: "电子元器件采购平台" },
      { title: "PCBWay", url: "https://www.pcbway.com/", desc: "PCB 打样和小批量生产" },
    ],
  },
  {
    name: "编程语言",
    links: [
      { title: "Rust Book", url: "https://doc.rust-lang.org/book/", desc: "Rust 官方教程" },
      { title: "Python 文档", url: "https://docs.python.org/zh-cn/3/", desc: "Python 官方中文文档" },
      { title: "C++ Reference", url: "https://en.cppreference.com/", desc: "C++ 标准库参考" },
      { title: "Go 之旅", url: "https://go.dev/tour/", desc: "Go 语言交互式教程" },
    ],
  },
  {
    name: "开发工具",
    links: [
      { title: "Git 文档", url: "https://git-scm.com/doc", desc: "Git 版本控制官方文档" },
      { title: "Docker Hub", url: "https://hub.docker.com/", desc: "容器镜像仓库" },
      { title: "CMake 文档", url: "https://cmake.org/cmake/help/latest/", desc: "CMake 构建系统文档" },
      { title: "PlatformIO", url: "https://platformio.org/", desc: "嵌入式开发生态系统" },
    ],
  },
  {
    name: "学习资源",
    links: [
      { title: "MIT OpenCourseWare", url: "https://ocw.mit.edu/", desc: "MIT 开放课程" },
      { title: "arXiv", url: "https://arxiv.org/", desc: "学术论文预印本" },
      { title: "Hacker News", url: "https://news.ycombinator.com/", desc: "技术新闻社区" },
      { title: "Stack Overflow", url: "https://stackoverflow.com/", desc: "编程问答社区" },
    ],
  },
];

export default function LinksPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
          资源链接
        </h1>
        <p className="mt-3 text-text-secondary">
          收藏的技术资源、工具和参考链接
        </p>
      </header>

      <div className="space-y-12">
        {linkCategories.map((category) => (
          <section key={category.name}>
            <h2 className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-4">
              {category.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {category.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 border border-border rounded-lg hover:border-accent/30 hover:bg-surface-hover transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">
                        {link.title}
                      </h3>
                      <p className="mt-1 text-xs text-text-tertiary">
                        {link.desc}
                      </p>
                    </div>
                    <svg
                      className="w-3.5 h-3.5 text-text-tertiary shrink-0 mt-0.5 group-hover:text-accent transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                      />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
