"use client";

import { useState, useMemo } from "react";

// ─── C Code Syntax Highlighting (regex-based) ────────────────────────────────

function highlightC(code: string): string {
  const escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Order matters: comments first, then strings, then keywords/types/numbers
  return escaped
    // Single-line comments
    .replace(/(\/\/.*)/g, '<span class="text-emerald-600 dark:text-emerald-400 italic">$1</span>')
    // Multi-line comments (simple)
    .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-emerald-600 dark:text-emerald-400 italic">$1</span>')
    // Strings
    .replace(/("(?:[^"\\]|\\.)*")/g, '<span class="text-amber-600 dark:text-amber-400">$1</span>')
    // Preprocessor directives
    .replace(/^(\s*#\w+[^\n]*)/gm, '<span class="text-purple-600 dark:text-purple-400">$1</span>')
    // Keywords
    .replace(/\b(void|int|char|float|double|long|short|unsigned|signed|const|volatile|static|extern|struct|union|enum|typedef|if|else|for|while|do|switch|case|default|break|continue|return|sizeof|goto|uint8_t|uint16_t|uint32_t|int8_t|int16_t|int32_t|HAL_StatusTypeDef|GPIO_PinState)\b/g,
      '<span class="text-blue-600 dark:text-blue-400 font-medium">$1</span>')
    // Numbers (hex and decimal)
    .replace(/\b(0x[0-9a-fA-F]+|[0-9]+\.?[0-9]*[uUlLfF]?)\b/g,
      '<span class="text-orange-600 dark:text-orange-400">$1</span>')
    // Function calls
    .replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, '<span class="text-cyan-600 dark:text-cyan-400">$1</span>');
}

// ─── Pre-loaded Examples ─────────────────────────────────────────────────────

const examples: Record<string, { label: string; code: string; output: string }> = {
  led: {
    label: "LED Blink",
    code: `#include "stm32f1xx_hal.h"

// LED blink on PC13 using HAL
int main(void) {
    HAL_Init();
    SystemClock_Config();

    // Enable GPIOC clock
    __HAL_RCC_GPIOC_CLK_ENABLE();

    // Configure PC13 as output
    GPIO_InitTypeDef GPIO_InitStruct = {0};
    GPIO_InitStruct.Pin = GPIO_PIN_13;
    GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
    GPIO_InitStruct.Pull = GPIO_NOPULL;
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
    HAL_GPIO_Init(GPIOC, &GPIO_InitStruct);

    while (1) {
        HAL_GPIO_TogglePin(GPIOC, GPIO_PIN_13);
        HAL_Delay(500);  // 500ms toggle
    }
}`,
    output: `[BUILD] Compiling main.c...
[BUILD] arm-none-eabi-gcc -mcpu=cortex-m3 -mthumb -c main.c -o main.o
[BUILD] arm-none-eabi-gcc -mcpu=cortex-m3 -mthumb main.o -o firmware.elf -T STM32F103C8Tx_FLASH.ld
[BUILD] arm-none-eabi-objcopy -O binary firmware.elf firmware.bin
[BUILD] Build successful! (0 warnings, 0 errors)

[SIM] Initializing STM32F103C8T6 simulation...
[SIM] GPIOC clock enabled (RCC->APB2ENR bit 4)
[SIM] PC13 configured: Output Push-Pull, Speed=Low
[SIM] ---
[SIM] t=0ms    PC13=HIGH (LED OFF)
[SIM] t=500ms  PC13=LOW  (LED ON)
[SIM] t=1000ms PC13=HIGH (LED OFF)
[SIM] t=1500ms PC13=LOW  (LED ON)
[SIM] ... (blinking continues every 500ms)`,
  },
  uart: {
    label: "UART printf",
    code: `#include "stm32f1xx_hal.h"
#include <stdio.h>
#include <string.h>

UART_HandleTypeDef huart1;

// Redirect printf to USART1
int fputc(int ch, FILE *f) {
    HAL_UART_Transmit(&huart1, (uint8_t *)&ch, 1, HAL_MAX_DELAY);
    return ch;
}

static void USART1_Init(void) {
    __HAL_RCC_USART1_CLK_ENABLE();
    huart1.Instance = USART1;
    huart1.Init.BaudRate = 115200;
    huart1.Init.WordLength = UART_WORDLENGTH_8B;
    huart1.Init.StopBits = UART_STOPBITS_1;
    huart1.Init.Parity = UART_PARITY_NONE;
    huart1.Init.Mode = UART_MODE_TX_RX;
    HAL_UART_Init(&huart1);
}

int main(void) {
    HAL_Init();
    SystemClock_Config();
    USART1_Init();

    uint32_t count = 0;
    while (1) {
        printf("Hello UART! count=%lu\\r\\n", count++);
        HAL_Delay(1000);
    }
}`,
    output: `[BUILD] Compiling main.c...
[BUILD] arm-none-eabi-gcc -mcpu=cortex-m3 -mthumb -c main.c -o main.o
[BUILD] Linking firmware.elf...
[BUILD] Build successful! (0 warnings, 0 errors)

[SIM] Initializing USART1 simulation...
[SIM] USART1: BaudRate=115200, 8N1, TX+RX
[SIM] ---
[SIM] > Hello UART! count=0
[SIM] > Hello UART! count=1
[SIM] > Hello UART! count=2
[SIM] > Hello UART! count=3
[SIM] ... (output every 1000ms)`,
  },
  i2c: {
    label: "I2C Sensor Read",
    code: `#include "stm32f1xx_hal.h"
#include <stdio.h>

I2C_HandleTypeDef hi2c1;

#define SHT30_ADDR  (0x44 << 1)  // 7-bit shifted
#define CMD_MEASURE 0x2400       // High repeatability

static void I2C1_Init(void) {
    __HAL_RCC_I2C1_CLK_ENABLE();
    hi2c1.Instance = I2C1;
    hi2c1.Init.ClockSpeed = 100000;  // 100kHz
    hi2c1.Init.DutyCycle = I2C_DUTYCYCLE_2;
    hi2c1.Init.OwnAddress1 = 0;
    hi2c1.Init.AddressingMode = I2C_ADDRESSINGMODE_7BIT;
    HAL_I2C_Init(&hi2c1);
}

float SHT30_ReadTemperature(void) {
    uint8_t cmd[2] = { CMD_MEASURE >> 8, CMD_MEASURE & 0xFF };
    uint8_t data[6];

    HAL_I2C_Master_Transmit(&hi2c1, SHT30_ADDR, cmd, 2, HAL_MAX_DELAY);
    HAL_Delay(20);  // Measurement time
    HAL_I2C_Master_Receive(&hi2c1, SHT30_ADDR, data, 6, HAL_MAX_DELAY);

    uint16_t raw = (data[0] << 8) | data[1];
    return -45.0f + 175.0f * (float)raw / 65535.0f;
}

int main(void) {
    HAL_Init();
    SystemClock_Config();
    I2C1_Init();

    while (1) {
        float temp = SHT30_ReadTemperature();
        printf("Temperature: %.2f C\\r\\n", temp);
        HAL_Delay(2000);
    }
}`,
    output: `[BUILD] Compiling main.c...
[BUILD] arm-none-eabi-gcc -mcpu=cortex-m3 -mthumb -c main.c -o main.o
[BUILD] Linking firmware.elf...
[BUILD] Build successful! (0 warnings, 0 errors)

[SIM] Initializing I2C1 simulation...
[SIM] I2C1: Speed=100kHz, 7-bit addressing
[SIM] SHT30 sensor simulated at address 0x44
[SIM] ---
[SIM] I2C TX: [24 00] to 0x44 (measure cmd)
[SIM] I2C RX: [6A 3F xx xx xx xx] from 0x44
[SIM] > Temperature: 25.37 C
[SIM] I2C TX: [24 00] to 0x44 (measure cmd)
[SIM] I2C RX: [6A 52 xx xx xx xx] from 0x44
[SIM] > Temperature: 25.45 C
[SIM] ... (reading every 2000ms)`,
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function CodePlayground() {
  const [code, setCode] = useState(examples.led.code);
  const [output, setOutput] = useState("");
  const [activeExample, setActiveExample] = useState("led");
  const [copied, setCopied] = useState(false);

  const lines = useMemo(() => code.split("\n"), [code]);

  const run = () => {
    setOutput("[BUILD] Compiling...\n");
    // Simulate build delay
    setTimeout(() => {
      const ex = examples[activeExample];
      if (ex) {
        setOutput(ex.output);
      } else {
        setOutput(
          `[BUILD] Compiling main.c...\n[BUILD] arm-none-eabi-gcc -mcpu=cortex-m3 -mthumb -c main.c -o main.o\n[BUILD] Build successful! (0 warnings, 0 errors)\n\n[SIM] Simulation started...\n[SIM] No hardware-specific output detected.\n[SIM] Tip: select a pre-loaded example for simulated output.`
        );
      }
    }, 600);
  };

  const reset = () => {
    const ex = examples[activeExample];
    if (ex) setCode(ex.code);
    setOutput("");
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const loadExample = (key: string) => {
    setActiveExample(key);
    setCode(examples[key].code);
    setOutput("");
  };

  const highlighted = useMemo(() => highlightC(code), [code]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-text-primary mb-4">C Code Playground</h2>
      <p className="text-sm text-text-secondary mb-4">
        Embedded C code editor with simulated compilation and output. Select an example or write your own code.
      </p>

      {/* Example selector */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(examples).map(([key, ex]) => (
          <button
            key={key}
            onClick={() => loadExample(key)}
            className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
              activeExample === key
                ? "bg-accent text-white"
                : "border border-border text-text-secondary hover:border-accent/30"
            }`}
          >
            {ex.label}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex gap-2 items-center">
        <button
          onClick={run}
          className="px-4 py-1.5 text-sm bg-accent text-white rounded-md hover:bg-accent-hover transition-colors font-medium"
        >
          Run
        </button>
        <button
          onClick={reset}
          className="px-3 py-1.5 text-sm border border-border rounded-md text-text-secondary hover:border-accent/30 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={copyCode}
          className="px-3 py-1.5 text-sm border border-border rounded-md text-text-secondary hover:border-accent/30 transition-colors"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Editor and Output panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Code editor with line numbers */}
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="px-3 py-1.5 bg-muted text-xs text-text-tertiary border-b border-border">
            main.c
          </div>
          <div className="relative flex bg-[#1e1e2e] dark:bg-[#1e1e2e]">
            {/* Line numbers */}
            <div className="flex-shrink-0 select-none py-3 pl-2 pr-1 text-right border-r border-gray-700/50">
              {lines.map((_, i) => (
                <div key={i} className="text-xs leading-5 text-gray-500 font-mono">
                  {i + 1}
                </div>
              ))}
            </div>
            {/* Textarea overlay */}
            <div className="relative flex-1 min-w-0">
              <pre
                className="py-3 px-3 text-xs leading-5 font-mono whitespace-pre overflow-x-auto pointer-events-none"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: highlighted + "\n" }}
              />
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="absolute inset-0 w-full h-full py-3 px-3 text-xs leading-5 font-mono bg-transparent text-transparent caret-white resize-none focus:outline-none whitespace-pre overflow-x-auto"
                spellCheck={false}
              />
            </div>
          </div>
        </div>

        {/* Output panel */}
        <div className="border border-border rounded-lg overflow-hidden flex flex-col">
          <div className="px-3 py-1.5 bg-muted text-xs text-text-tertiary border-b border-border">
            Output
          </div>
          <div className="flex-1 min-h-[300px] bg-[#1e1e2e] dark:bg-[#1e1e2e] p-3 overflow-auto">
            {output ? (
              <pre className="text-xs font-mono leading-5 text-green-400 whitespace-pre-wrap">
                {output}
              </pre>
            ) : (
              <pre className="text-xs font-mono leading-5 text-gray-500 italic">
                {"// Click 'Run' to see simulated output"}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
