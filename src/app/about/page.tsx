import { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于 - 技术知识库",
  description: "个人简介、技能和联系方式。",
};

const skills = {
  "嵌入式系统": ["ARM Cortex-M", "STM32", "ESP32", "FreeRTOS", "PCB 设计"],
  "编程语言": ["C", "C++", "Python", "Rust"],
  "硬件工具": ["示波器", "逻辑分析仪", "J-Link", "OpenOCD"],
  "软件框架": ["Git", "CMake", "PlatformIO", "Docker"],
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
          关于
        </h1>
      </header>

      {/* 个人简介 */}
      <section className="mb-16">
        <h2 className="text-xl font-medium text-text-primary mb-4">
          个人简介
        </h2>
        <div className="space-y-4 text-text-secondary leading-relaxed">
          <p>
            一名嵌入式系统工程师，热衷于硬件设计和底层编程。喜欢在硬件与软件的交汇处工作，创建可靠高效的系统。
          </p>
          <p>
            这个网站是我的ls技术知识展示，用于记录技术学习、项目经验和工程思考。
          </p>
        </div>
      </section>

      {/* 技能 */}
      <section className="mb-16">
        <h2 className="text-xl font-medium text-text-primary mb-6">
          技能
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(skills).map(([category, items]) => (
            <div
              key={category}
              className="p-5 border border-border rounded-lg hover:border-accent/20 transition-colors"
            >
              <h3 className="text-sm font-medium text-text-primary mb-3">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 text-xs text-text-secondary bg-muted rounded-md"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 联系方式 */}
      <section>
        <h2 className="text-xl font-medium text-text-primary mb-4">
          联系方式
        </h2>
        <div className="space-y-3">
          <p className="text-sm text-text-secondary">
            <span className="text-text-tertiary inline-block w-16">GitHub</span>
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover transition-colors"
            >
              github.com/yourusername
            </a>
          </p>
          <p className="text-sm text-text-secondary">
            <span className="text-text-tertiary inline-block w-16">邮箱</span>
            <a
              href="mailto:your@email.com"
              className="text-accent hover:text-accent-hover transition-colors"
            >
              your@email.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
