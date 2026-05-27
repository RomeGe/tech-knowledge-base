"use client";

import { useState, useMemo } from "react";

// ─── Pin Function Types ──────────────────────────────────────────────────────

type PinFunction =
  | "GPIO_IN"
  | "GPIO_OUT"
  | "UART_TX"
  | "UART_RX"
  | "SPI_MOSI"
  | "SPI_MISO"
  | "SPI_SCK"
  | "SPI_CS"
  | "I2C_SDA"
  | "I2C_SCL"
  | "ADC"
  | "TIM"
  | "PWM"
  | "GND"
  | "VCC"
  | "NRST"
  | "BOOT"
  | "NC";

interface PinConfig {
  name: string;
  number: number;
  altFunctions: PinFunction[];
  configured?: PinFunction;
}

interface ChipProfile {
  name: string;
  package: string;
  pins: PinConfig[];
  rows: number;
  cols: number;
}

// ─── Chip Definitions ────────────────────────────────────────────────────────

const functionColors: Record<PinFunction, string> = {
  GPIO_IN: "bg-blue-500 text-white",
  GPIO_OUT: "bg-sky-500 text-white",
  UART_TX: "bg-emerald-500 text-white",
  UART_RX: "bg-teal-500 text-white",
  SPI_MOSI: "bg-violet-500 text-white",
  SPI_MISO: "bg-purple-500 text-white",
  SPI_SCK: "bg-fuchsia-500 text-white",
  SPI_CS: "bg-pink-500 text-white",
  I2C_SDA: "bg-amber-500 text-white",
  I2C_SCL: "bg-orange-500 text-white",
  ADC: "bg-red-400 text-white",
  TIM: "bg-lime-500 text-white",
  PWM: "bg-green-600 text-white",
  GND: "bg-gray-700 text-white",
  VCC: "bg-red-600 text-white",
  NRST: "bg-gray-500 text-white",
  BOOT: "bg-yellow-600 text-white",
  NC: "bg-gray-300 text-gray-600",
};

const functionLabels: Record<PinFunction, string> = {
  GPIO_IN: "GPIO In",
  GPIO_OUT: "GPIO Out",
  UART_TX: "UART TX",
  UART_RX: "UART RX",
  SPI_MOSI: "SPI MOSI",
  SPI_MISO: "SPI MISO",
  SPI_SCK: "SPI SCK",
  SPI_CS: "SPI CS",
  I2C_SDA: "I2C SDA",
  I2C_SCL: "I2C SCL",
  ADC: "ADC",
  TIM: "Timer",
  PWM: "PWM",
  GND: "GND",
  VCC: "VCC",
  NRST: "NRST",
  BOOT: "BOOT",
  NC: "N/C",
};

const chips: Record<string, ChipProfile> = {
  "STM32F103C8T6": {
    name: "STM32F103C8T6",
    package: "LQFP-48",
    rows: 12,
    cols: 4,
    pins: [
      { name: "VBAT", number: 1, altFunctions: ["VCC"] },
      { name: "PC13", number: 2, altFunctions: ["GPIO_IN", "GPIO_OUT"] },
      { name: "PC14", number: 3, altFunctions: ["GPIO_IN", "GPIO_OUT"] },
      { name: "PC15", number: 4, altFunctions: ["GPIO_IN", "GPIO_OUT"] },
      { name: "PD0", number: 5, altFunctions: ["GPIO_IN", "GPIO_OUT"] },
      { name: "PD1", number: 6, altFunctions: ["GPIO_IN", "GPIO_OUT"] },
      { name: "NRST", number: 7, altFunctions: ["NRST"] },
      { name: "VSSA", number: 8, altFunctions: ["GND"] },
      { name: "VDDA", number: 9, altFunctions: ["VCC"] },
      { name: "PA0", number: 10, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC", "UART_TX", "TIM", "PWM"] },
      { name: "PA1", number: 11, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC", "UART_RX", "TIM", "PWM"] },
      { name: "PA2", number: 12, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC", "UART_TX", "TIM", "PWM"] },
      { name: "PA3", number: 13, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC", "UART_RX", "TIM", "PWM"] },
      { name: "PA4", number: 14, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC", "SPI_CS"] },
      { name: "PA5", number: 15, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC", "SPI_SCK"] },
      { name: "PA6", number: 16, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC", "SPI_MISO", "TIM", "PWM"] },
      { name: "PA7", number: 17, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC", "SPI_MOSI", "TIM", "PWM"] },
      { name: "PB0", number: 18, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC", "TIM", "PWM"] },
      { name: "PB1", number: 19, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC", "TIM", "PWM"] },
      { name: "PB2", number: 20, altFunctions: ["GPIO_IN", "GPIO_OUT", "BOOT"] },
      { name: "PB10", number: 21, altFunctions: ["GPIO_IN", "GPIO_OUT", "I2C_SCL", "UART_TX", "TIM"] },
      { name: "PB11", number: 22, altFunctions: ["GPIO_IN", "GPIO_OUT", "I2C_SDA", "UART_RX", "TIM"] },
      { name: "VSS", number: 23, altFunctions: ["GND"] },
      { name: "VDD", number: 24, altFunctions: ["VCC"] },
      { name: "PB12", number: 25, altFunctions: ["GPIO_IN", "GPIO_OUT", "SPI_CS", "UART_TX"] },
      { name: "PB13", number: 26, altFunctions: ["GPIO_IN", "GPIO_OUT", "SPI_SCK", "UART_RX"] },
      { name: "PB14", number: 27, altFunctions: ["GPIO_IN", "GPIO_OUT", "SPI_MISO"] },
      { name: "PB15", number: 28, altFunctions: ["GPIO_IN", "GPIO_OUT", "SPI_MOSI"] },
      { name: "PA8", number: 29, altFunctions: ["GPIO_IN", "GPIO_OUT", "TIM", "PWM"] },
      { name: "PA9", number: 30, altFunctions: ["GPIO_IN", "GPIO_OUT", "UART_TX", "TIM"] },
      { name: "PA10", number: 31, altFunctions: ["GPIO_IN", "GPIO_OUT", "UART_RX", "TIM"] },
      { name: "PA11", number: 32, altFunctions: ["GPIO_IN", "GPIO_OUT"] },
      { name: "PA12", number: 33, altFunctions: ["GPIO_IN", "GPIO_OUT"] },
      { name: "PA13", number: 34, altFunctions: ["GPIO_IN", "GPIO_OUT"] },
      { name: "VSS", number: 35, altFunctions: ["GND"] },
      { name: "VDD", number: 36, altFunctions: ["VCC"] },
      { name: "PA14", number: 37, altFunctions: ["GPIO_IN", "GPIO_OUT"] },
      { name: "PA15", number: 38, altFunctions: ["GPIO_IN", "GPIO_OUT", "SPI_CS"] },
      { name: "PB3", number: 39, altFunctions: ["GPIO_IN", "GPIO_OUT", "SPI_SCK"] },
      { name: "PB4", number: 40, altFunctions: ["GPIO_IN", "GPIO_OUT", "SPI_MISO"] },
      { name: "PB5", number: 41, altFunctions: ["GPIO_IN", "GPIO_OUT", "SPI_MOSI", "I2C_SDA"] },
      { name: "PB6", number: 42, altFunctions: ["GPIO_IN", "GPIO_OUT", "I2C_SCL", "UART_TX"] },
      { name: "PB7", number: 43, altFunctions: ["GPIO_IN", "GPIO_OUT", "I2C_SDA", "UART_RX"] },
      { name: "BOOT0", number: 44, altFunctions: ["BOOT"] },
      { name: "PB8", number: 45, altFunctions: ["GPIO_IN", "GPIO_OUT", "I2C_SCL", "TIM", "PWM"] },
      { name: "PB9", number: 46, altFunctions: ["GPIO_IN", "GPIO_OUT", "I2C_SDA", "TIM", "PWM"] },
      { name: "VSS", number: 47, altFunctions: ["GND"] },
      { name: "VDD", number: 48, altFunctions: ["VCC"] },
    ],
  },
  "STM32F407VET6": {
    name: "STM32F407VET6",
    package: "LQFP-100",
    rows: 25,
    cols: 4,
    pins: [
      { name: "VBAT", number: 1, altFunctions: ["VCC"] },
      { name: "PC13", number: 2, altFunctions: ["GPIO_IN", "GPIO_OUT"] },
      { name: "PC14", number: 3, altFunctions: ["GPIO_IN", "GPIO_OUT"] },
      { name: "PC15", number: 4, altFunctions: ["GPIO_IN", "GPIO_OUT"] },
      { name: "PH0", number: 5, altFunctions: ["GPIO_IN", "GPIO_OUT"] },
      { name: "PH1", number: 6, altFunctions: ["GPIO_IN", "GPIO_OUT"] },
      { name: "NRST", number: 7, altFunctions: ["NRST"] },
      { name: "PC0", number: 8, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC"] },
      { name: "PC1", number: 9, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC"] },
      { name: "PC2", number: 10, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC", "SPI_MISO"] },
      { name: "PC3", number: 11, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC", "SPI_MOSI"] },
      { name: "VSSA", number: 12, altFunctions: ["GND"] },
      { name: "VDDA", number: 13, altFunctions: ["VCC"] },
      { name: "PA0", number: 14, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC", "UART_TX", "TIM", "PWM"] },
      { name: "PA1", number: 15, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC", "UART_RX", "TIM", "PWM"] },
      { name: "PA2", number: 16, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC", "UART_TX", "TIM", "PWM"] },
      { name: "PA3", number: 17, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC", "UART_RX", "TIM", "PWM"] },
      { name: "VSS", number: 18, altFunctions: ["GND"] },
      { name: "VDD", number: 19, altFunctions: ["VCC"] },
      { name: "PA4", number: 20, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC", "SPI_CS"] },
      { name: "PA5", number: 21, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC", "SPI_SCK"] },
      { name: "PA6", number: 22, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC", "SPI_MISO", "TIM", "PWM"] },
      { name: "PA7", number: 23, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC", "SPI_MOSI", "TIM", "PWM"] },
      { name: "PC4", number: 24, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC"] },
      { name: "PC5", number: 25, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC"] },
      { name: "PB0", number: 26, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC", "TIM", "PWM"] },
      { name: "PB1", number: 27, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC", "TIM", "PWM"] },
      { name: "PB2", number: 28, altFunctions: ["GPIO_IN", "GPIO_OUT", "BOOT"] },
      { name: "PB10", number: 29, altFunctions: ["GPIO_IN", "GPIO_OUT", "I2C_SCL", "UART_TX", "SPI_SCK"] },
      { name: "PB11", number: 30, altFunctions: ["GPIO_IN", "GPIO_OUT", "I2C_SDA", "UART_RX"] },
      { name: "VSS", number: 31, altFunctions: ["GND"] },
      { name: "VDD", number: 32, altFunctions: ["VCC"] },
      { name: "PB12", number: 33, altFunctions: ["GPIO_IN", "GPIO_OUT", "SPI_CS", "UART_TX"] },
      { name: "PB13", number: 34, altFunctions: ["GPIO_IN", "GPIO_OUT", "SPI_SCK", "UART_RX", "TIM", "PWM"] },
      { name: "PB14", number: 35, altFunctions: ["GPIO_IN", "GPIO_OUT", "SPI_MISO", "TIM", "PWM"] },
      { name: "PB15", number: 36, altFunctions: ["GPIO_IN", "GPIO_OUT", "SPI_MOSI", "TIM", "PWM"] },
      { name: "PC6", number: 37, altFunctions: ["GPIO_IN", "GPIO_OUT", "TIM", "PWM", "UART_TX"] },
      { name: "PC7", number: 38, altFunctions: ["GPIO_IN", "GPIO_OUT", "TIM", "PWM", "UART_RX"] },
      { name: "PC8", number: 39, altFunctions: ["GPIO_IN", "GPIO_OUT", "TIM", "PWM"] },
      { name: "PC9", number: 40, altFunctions: ["GPIO_IN", "GPIO_OUT", "TIM", "PWM"] },
      { name: "PA8", number: 41, altFunctions: ["GPIO_IN", "GPIO_OUT", "TIM", "PWM"] },
      { name: "PA9", number: 42, altFunctions: ["GPIO_IN", "GPIO_OUT", "UART_TX", "TIM", "SPI_SCK"] },
      { name: "PA10", number: 43, altFunctions: ["GPIO_IN", "GPIO_OUT", "UART_RX", "TIM", "SPI_MISO"] },
      { name: "PA11", number: 44, altFunctions: ["GPIO_IN", "GPIO_OUT", "SPI_MISO"] },
      { name: "PA12", number: 45, altFunctions: ["GPIO_IN", "GPIO_OUT", "SPI_MOSI"] },
      { name: "PA13", number: 46, altFunctions: ["GPIO_IN", "GPIO_OUT"] },
      { name: "VSS", number: 47, altFunctions: ["GND"] },
      { name: "VDD", number: 48, altFunctions: ["VCC"] },
      { name: "PA14", number: 49, altFunctions: ["GPIO_IN", "GPIO_OUT"] },
      { name: "PA15", number: 50, altFunctions: ["GPIO_IN", "GPIO_OUT", "SPI_CS", "TIM"] },
      { name: "PC10", number: 51, altFunctions: ["GPIO_IN", "GPIO_OUT", "UART_TX", "SPI_SCK"] },
      { name: "PC11", number: 52, altFunctions: ["GPIO_IN", "GPIO_OUT", "UART_RX", "SPI_MISO"] },
      { name: "PC12", number: 53, altFunctions: ["GPIO_IN", "GPIO_OUT", "SPI_MOSI"] },
      { name: "PD2", number: 54, altFunctions: ["GPIO_IN", "GPIO_OUT", "TIM"] },
      { name: "PB3", number: 55, altFunctions: ["GPIO_IN", "GPIO_OUT", "SPI_SCK", "TIM"] },
      { name: "PB4", number: 56, altFunctions: ["GPIO_IN", "GPIO_OUT", "SPI_MISO"] },
      { name: "PB5", number: 57, altFunctions: ["GPIO_IN", "GPIO_OUT", "SPI_MOSI", "I2C_SDA"] },
      { name: "PB6", number: 58, altFunctions: ["GPIO_IN", "GPIO_OUT", "I2C_SCL", "UART_TX"] },
      { name: "PB7", number: 59, altFunctions: ["GPIO_IN", "GPIO_OUT", "I2C_SDA", "UART_RX"] },
      { name: "BOOT0", number: 60, altFunctions: ["BOOT"] },
      { name: "PB8", number: 61, altFunctions: ["GPIO_IN", "GPIO_OUT", "I2C_SCL", "TIM", "PWM"] },
      { name: "PB9", number: 62, altFunctions: ["GPIO_IN", "GPIO_OUT", "I2C_SDA", "TIM", "PWM"] },
      { name: "VSS", number: 63, altFunctions: ["GND"] },
      { name: "VDD", number: 64, altFunctions: ["VCC"] },
      { name: "PE0", number: 65, altFunctions: ["GPIO_IN", "GPIO_OUT"] },
      { name: "PE1", number: 66, altFunctions: ["GPIO_IN", "GPIO_OUT"] },
      { name: "PE2", number: 67, altFunctions: ["GPIO_IN", "GPIO_OUT", "SPI_SCK"] },
      { name: "PE3", number: 68, altFunctions: ["GPIO_IN", "GPIO_OUT"] },
      { name: "PE4", number: 69, altFunctions: ["GPIO_IN", "GPIO_OUT", "SPI_MISO"] },
      { name: "PE5", number: 70, altFunctions: ["GPIO_IN", "GPIO_OUT", "SPI_MOSI"] },
      { name: "PE6", number: 71, altFunctions: ["GPIO_IN", "GPIO_OUT"] },
      { name: "PE7", number: 72, altFunctions: ["GPIO_IN", "GPIO_OUT", "TIM"] },
      { name: "PE8", number: 73, altFunctions: ["GPIO_IN", "GPIO_OUT", "TIM", "PWM"] },
      { name: "PE9", number: 74, altFunctions: ["GPIO_IN", "GPIO_OUT", "TIM", "PWM"] },
      { name: "PE10", number: 75, altFunctions: ["GPIO_IN", "GPIO_OUT", "TIM"] },
      { name: "PE11", number: 76, altFunctions: ["GPIO_IN", "GPIO_OUT", "TIM", "PWM"] },
      { name: "PE12", number: 77, altFunctions: ["GPIO_IN", "GPIO_OUT", "SPI_CS"] },
      { name: "PE13", number: 78, altFunctions: ["GPIO_IN", "GPIO_OUT", "TIM", "PWM"] },
      { name: "PE14", number: 79, altFunctions: ["GPIO_IN", "GPIO_OUT", "TIM", "PWM"] },
      { name: "PE15", number: 80, altFunctions: ["GPIO_IN", "GPIO_OUT"] },
      { name: "PD8", number: 81, altFunctions: ["GPIO_IN", "GPIO_OUT", "UART_TX"] },
      { name: "PD9", number: 82, altFunctions: ["GPIO_IN", "GPIO_OUT", "UART_RX"] },
      { name: "PD10", number: 83, altFunctions: ["GPIO_IN", "GPIO_OUT"] },
      { name: "PD11", number: 84, altFunctions: ["GPIO_IN", "GPIO_OUT", "I2C_SDA"] },
      { name: "PD12", number: 85, altFunctions: ["GPIO_IN", "GPIO_OUT", "I2C_SCL", "TIM", "PWM"] },
      { name: "PD13", number: 86, altFunctions: ["GPIO_IN", "GPIO_OUT", "TIM", "PWM"] },
      { name: "PD14", number: 87, altFunctions: ["GPIO_IN", "GPIO_OUT", "TIM"] },
      { name: "PD15", number: 88, altFunctions: ["GPIO_IN", "GPIO_OUT", "TIM"] },
      { name: "VSS", number: 89, altFunctions: ["GND"] },
      { name: "VDD", number: 90, altFunctions: ["VCC"] },
      { name: "PD0", number: 91, altFunctions: ["GPIO_IN", "GPIO_OUT"] },
      { name: "PD1", number: 92, altFunctions: ["GPIO_IN", "GPIO_OUT"] },
      { name: "PD3", number: 93, altFunctions: ["GPIO_IN", "GPIO_OUT", "UART_TX"] },
      { name: "PD4", number: 94, altFunctions: ["GPIO_IN", "GPIO_OUT", "UART_RX"] },
      { name: "PD5", number: 95, altFunctions: ["GPIO_IN", "GPIO_OUT", "UART_TX"] },
      { name: "PD6", number: 96, altFunctions: ["GPIO_IN", "GPIO_OUT", "UART_RX"] },
      { name: "PD7", number: 97, altFunctions: ["GPIO_IN", "GPIO_OUT"] },
      { name: "PB3", number: 98, altFunctions: ["GPIO_IN", "GPIO_OUT", "SPI_SCK"] },
      { name: "PB4", number: 99, altFunctions: ["GPIO_IN", "GPIO_OUT", "SPI_MISO"] },
      { name: "VDD", number: 100, altFunctions: ["VCC"] },
    ],
  },
  "ESP32-WROOM-32": {
    name: "ESP32-WROOM-32",
    package: "Module (38-pin)",
    rows: 19,
    cols: 2,
    pins: [
      { name: "GND", number: 1, altFunctions: ["GND"] },
      { name: "3V3", number: 2, altFunctions: ["VCC"] },
      { name: "EN", number: 3, altFunctions: ["NRST"] },
      { name: "VP/IO36", number: 4, altFunctions: ["GPIO_IN", "ADC"] },
      { name: "VN/IO39", number: 5, altFunctions: ["GPIO_IN", "ADC"] },
      { name: "IO34", number: 6, altFunctions: ["GPIO_IN", "ADC"] },
      { name: "IO35", number: 7, altFunctions: ["GPIO_IN", "ADC"] },
      { name: "IO32", number: 8, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC", "I2C_SDA"] },
      { name: "IO33", number: 9, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC", "I2C_SCL"] },
      { name: "IO25", number: 10, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC", "SPI_MOSI", "PWM"] },
      { name: "IO26", number: 11, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC", "SPI_SCK", "PWM"] },
      { name: "IO27", number: 12, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC", "SPI_CS", "PWM"] },
      { name: "IO14", number: 13, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC", "SPI_SCK", "PWM"] },
      { name: "IO12", number: 14, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC", "SPI_MISO", "PWM"] },
      { name: "GND", number: 15, altFunctions: ["GND"] },
      { name: "IO13", number: 16, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC", "SPI_MOSI", "PWM"] },
      { name: "D2/IO9", number: 17, altFunctions: ["GPIO_IN", "GPIO_OUT"] },
      { name: "D3/IO10", number: 18, altFunctions: ["GPIO_IN", "GPIO_OUT", "SPI_MISO"] },
      { name: "CMD/IO11", number: 19, altFunctions: ["GPIO_IN", "GPIO_OUT", "SPI_CS"] },
      { name: "CLK/IO6", number: 20, altFunctions: ["GPIO_IN", "GPIO_OUT"] },
      { name: "D0/IO7", number: 21, altFunctions: ["GPIO_IN", "GPIO_OUT"] },
      { name: "D1/IO8", number: 22, altFunctions: ["GPIO_IN", "GPIO_OUT"] },
      { name: "IO15", number: 23, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC", "SPI_CS", "PWM"] },
      { name: "IO2", number: 24, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC"] },
      { name: "IO0", number: 25, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC", "BOOT"] },
      { name: "IO4", number: 26, altFunctions: ["GPIO_IN", "GPIO_OUT", "ADC", "PWM"] },
      { name: "IO16", number: 27, altFunctions: ["GPIO_IN", "GPIO_OUT", "UART_RX"] },
      { name: "IO17", number: 28, altFunctions: ["GPIO_IN", "GPIO_OUT", "UART_TX"] },
      { name: "IO5", number: 29, altFunctions: ["GPIO_IN", "GPIO_OUT", "SPI_CS"] },
      { name: "IO18", number: 30, altFunctions: ["GPIO_IN", "GPIO_OUT", "SPI_SCK", "PWM"] },
      { name: "IO19", number: 31, altFunctions: ["GPIO_IN", "GPIO_OUT", "SPI_MISO", "PWM"] },
      { name: "GND", number: 32, altFunctions: ["GND"] },
      { name: "IO21", number: 33, altFunctions: ["GPIO_IN", "GPIO_OUT", "I2C_SDA"] },
      { name: "RXD0/IO3", number: 34, altFunctions: ["GPIO_IN", "GPIO_OUT", "UART_RX", "ADC"] },
      { name: "TXD0/IO1", number: 35, altFunctions: ["GPIO_IN", "GPIO_OUT", "UART_TX", "ADC"] },
      { name: "IO22", number: 36, altFunctions: ["GPIO_IN", "GPIO_OUT", "I2C_SCL"] },
      { name: "IO23", number: 37, altFunctions: ["GPIO_IN", "GPIO_OUT", "SPI_MOSI"] },
      { name: "GND", number: 38, altFunctions: ["GND"] },
    ],
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function PinConfigurator() {
  const [selectedChip, setSelectedChip] = useState("STM32F103C8T6");
  const [pinConfigs, setPinConfigs] = useState<Record<number, PinFunction | undefined>>({});
  const [selectedPin, setSelectedPin] = useState<number | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [copied, setCopied] = useState(false);

  const chip = chips[selectedChip];

  const handleChipChange = (name: string) => {
    setSelectedChip(name);
    setPinConfigs({});
    setSelectedPin(null);
  };

  const configurePin = (pinNumber: number, func: PinFunction) => {
    setPinConfigs((prev) => ({ ...prev, [pinNumber]: func }));
  };

  const clearPin = (pinNumber: number) => {
    setPinConfigs((prev) => {
      const next = { ...prev };
      delete next[pinNumber];
      return next;
    });
  };

  // Conflict detection: check if any pin function is assigned to multiple pins
  const conflicts = useMemo(() => {
    const funcToPins: Record<string, number[]> = {};
    Object.entries(pinConfigs).forEach(([pinNum, func]) => {
      if (func && !["GPIO_IN", "GPIO_OUT", "ADC", "GND", "VCC", "NRST", "BOOT", "NC"].includes(func)) {
        if (!funcToPins[func]) funcToPins[func] = [];
        funcToPins[func].push(Number(pinNum));
      }
    });
    const result: Record<number, string> = {};
    Object.entries(funcToPins).forEach(([func, pins]) => {
      if (pins.length > 1) {
        pins.forEach((p) => {
          result[p] = `${func} conflict with pin ${pins.filter((x) => x !== p).join(", ")}`;
        });
      }
    });
    return result;
  }, [pinConfigs]);

  const exportJson = useMemo(() => {
    const config: Record<string, unknown> = {
      chip: chip.name,
      package: chip.package,
      pins: {},
    };
    const pinEntries: Record<string, { pin: number; function: string }> = {};
    Object.entries(pinConfigs).forEach(([pinNum, func]) => {
      if (func) {
        const pin = chip.pins.find((p) => p.number === Number(pinNum));
        if (pin) {
          pinEntries[pin.name] = { pin: Number(pinNum), function: func };
        }
      }
    });
    config.pins = pinEntries;
    return JSON.stringify(config, null, 2);
  }, [chip, pinConfigs]);

  const handleCopyExport = () => {
    navigator.clipboard.writeText(exportJson).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const configuredCount = Object.keys(pinConfigs).filter((k) => pinConfigs[Number(k)]).length;

  // Get the pin being configured
  const activePin = selectedPin ? chip.pins.find((p) => p.number === selectedPin) : null;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-text-primary mb-4">MCU Pin Configurator</h2>
      <p className="text-sm text-text-secondary mb-4">
        Configure MCU pins by clicking on them. Supports GPIO, UART, SPI, I2C, ADC, Timer, and PWM functions with conflict detection.
      </p>

      {/* Chip selector */}
      <div className="flex gap-3 items-center flex-wrap">
        <label className="text-xs text-text-tertiary">Chip:</label>
        <select
          value={selectedChip}
          onChange={(e) => handleChipChange(e.target.value)}
          className="p-2 text-sm font-mono border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:border-accent/50"
        >
          {Object.keys(chips).map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        <span className="text-xs text-text-tertiary">{chip.package}</span>
        <span className="text-xs text-text-secondary ml-auto">
          {configuredCount} / {chip.pins.length} pins configured
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        {/* Pin grid (chip package visualization) */}
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="px-3 py-1.5 bg-muted text-xs text-text-tertiary border-b border-border">
            {chip.name} - {chip.package} Pinout
          </div>
          <div className="p-4 overflow-auto">
            <div
              className="grid gap-1 mx-auto"
              style={{
                gridTemplateColumns: `repeat(${chip.cols}, minmax(70px, 1fr))`,
                maxWidth: `${chip.cols * 90}px`,
              }}
            >
              {/* Column headers */}
              {Array.from({ length: chip.cols }).map((_, ci) => (
                <div key={`hdr-${ci}`} className="text-center text-[10px] text-text-tertiary font-mono pb-1">
                  {ci < chip.cols / 2 ? `L${ci + 1}` : `R${ci - chip.cols / 2 + 1}`}
                </div>
              ))}

              {/* Pin cells */}
              {chip.pins.map((pin) => {
                const configured = pinConfigs[pin.number];
                const isConflict = conflicts[pin.number];
                const isSelected = selectedPin === pin.number;

                let cellColor = "border-border bg-surface hover:border-accent/40";
                if (configured) {
                  cellColor = functionColors[configured] || "border-border bg-surface";
                  // Make it a lighter background while keeping text readable
                  cellColor = cellColor.replace("text-white", "text-white");
                }
                if (isConflict) {
                  cellColor = "border-red-500 bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400";
                }

                return (
                  <button
                    key={pin.number}
                    onClick={() => setSelectedPin(isSelected ? null : pin.number)}
                    className={`relative p-1.5 border rounded text-center transition-colors cursor-pointer ${cellColor} ${
                      isSelected ? "ring-2 ring-accent" : ""
                    }`}
                    title={`${pin.name} (Pin ${pin.number})${configured ? ` - ${configured}` : ""}${
                      isConflict ? ` - CONFLICT: ${isConflict}` : ""
                    }`}
                  >
                    <div className="text-[10px] font-mono font-bold leading-tight truncate">
                      {pin.name}
                    </div>
                    <div className="text-[9px] opacity-70 leading-tight">{pin.number}</div>
                    {configured && (
                      <div className="text-[8px] mt-0.5 truncate font-medium">
                        {functionLabels[configured]}
                      </div>
                    )}
                    {isConflict && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white text-[7px] rounded-full flex items-center justify-center font-bold">
                        !
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pin configuration panel */}
        <div className="border border-border rounded-lg overflow-hidden h-fit">
          <div className="px-3 py-1.5 bg-muted text-xs text-text-tertiary border-b border-border">
            Pin Configuration
          </div>
          <div className="p-3 space-y-3">
            {activePin ? (
              <>
                <div className="text-sm">
                  <span className="font-mono font-medium text-text-primary">{activePin.name}</span>
                  <span className="text-text-tertiary ml-2">Pin {activePin.number}</span>
                </div>

                {conflicts[activePin.number] && (
                  <div className="p-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded text-xs text-red-600 dark:text-red-400">
                    Conflict: {conflicts[activePin.number]}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs text-text-tertiary">Available Functions:</label>
                  <div className="grid grid-cols-2 gap-1">
                    {activePin.altFunctions.map((func) => (
                      <button
                        key={func}
                        onClick={() =>
                          pinConfigs[activePin.number] === func
                            ? clearPin(activePin.number)
                            : configurePin(activePin.number, func)
                        }
                        className={`px-2 py-1.5 text-[11px] rounded transition-colors ${
                          pinConfigs[activePin.number] === func
                            ? functionColors[func]
                            : "border border-border text-text-secondary hover:border-accent/30"
                        }`}
                      >
                        {functionLabels[func]}
                      </button>
                    ))}
                  </div>
                </div>

                {pinConfigs[activePin.number] && (
                  <button
                    onClick={() => clearPin(activePin.number)}
                    className="w-full px-3 py-1.5 text-xs border border-red-300 text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    Clear Configuration
                  </button>
                )}
              </>
            ) : (
              <div className="text-sm text-text-tertiary text-center py-8">
                Click a pin on the chip diagram to configure it
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="px-3 py-2 border-t border-border">
            <div className="text-[10px] text-text-tertiary mb-1.5">Legend:</div>
            <div className="flex flex-wrap gap-1">
              {(["GPIO_IN", "GPIO_OUT", "UART_TX", "UART_RX", "SPI_MOSI", "SPI_SCK", "I2C_SDA", "I2C_SCL", "ADC", "PWM", "TIM", "GND", "VCC"] as PinFunction[]).map((f) => (
                <span key={f} className={`px-1.5 py-0.5 rounded text-[9px] ${functionColors[f]}`}>
                  {functionLabels[f]}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Export */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowExport(!showExport)}
          className="px-3 py-1.5 text-sm border border-border rounded-md text-text-secondary hover:border-accent/30 transition-colors"
        >
          {showExport ? "Hide" : "Export"} JSON
        </button>
        <button
          onClick={() => {
            setPinConfigs({});
            setSelectedPin(null);
          }}
          className="px-3 py-1.5 text-sm border border-border rounded-md text-text-secondary hover:border-accent/30 transition-colors"
        >
          Reset All
        </button>
      </div>

      {showExport && (
        <div className="relative">
          <pre className="p-3 font-mono text-xs border border-border rounded-lg bg-muted overflow-auto max-h-60">
            {exportJson}
          </pre>
          <button
            onClick={handleCopyExport}
            className="absolute top-2 right-2 px-2.5 py-1 text-xs border border-border rounded-md bg-surface hover:border-accent/30 text-text-secondary transition-colors"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}
