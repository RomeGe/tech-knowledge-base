"use client";

import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface BitField {
  name: string;
  bits: string;
  rw: string;
  desc: string;
}

interface Register {
  name: string;
  offset: string;
  reset: string;
  desc: string;
  fields: BitField[];
}

interface PeripheralDef {
  name: string;
  base: string;
  desc: string;
  registers: Register[];
}

// ─── Peripheral Definitions ──────────────────────────────────────────────────

const PERIPHERALS: Record<string, PeripheralDef> = {
  GPIOA: {
    name: "GPIOA",
    base: "0x40010800",
    desc: "General Purpose I/O Port A",
    registers: [
      { name: "CRL", offset: "0x00", reset: "0x44444444", desc: "Port configuration register low",
        fields: [
          { name: "MODE0", bits: "1:0", rw: "rw", desc: "Port 0 mode bits" },
          { name: "CNF0", bits: "3:2", rw: "rw", desc: "Port 0 configuration bits" },
          { name: "MODE1", bits: "5:4", rw: "rw", desc: "Port 1 mode bits" },
          { name: "CNF1", bits: "7:6", rw: "rw", desc: "Port 1 configuration bits" },
          { name: "MODE2", bits: "9:8", rw: "rw", desc: "Port 2 mode bits" },
          { name: "CNF2", bits: "11:10", rw: "rw", desc: "Port 2 configuration bits" },
          { name: "MODE3", bits: "13:12", rw: "rw", desc: "Port 3 mode bits" },
          { name: "CNF3", bits: "15:14", rw: "rw", desc: "Port 3 configuration bits" },
          { name: "MODE4", bits: "17:16", rw: "rw", desc: "Port 4 mode bits" },
          { name: "CNF4", bits: "19:18", rw: "rw", desc: "Port 4 configuration bits" },
          { name: "MODE5", bits: "21:20", rw: "rw", desc: "Port 5 mode bits" },
          { name: "CNF5", bits: "23:22", rw: "rw", desc: "Port 5 configuration bits" },
          { name: "MODE6", bits: "25:24", rw: "rw", desc: "Port 6 mode bits" },
          { name: "CNF6", bits: "27:26", rw: "rw", desc: "Port 6 configuration bits" },
          { name: "MODE7", bits: "29:28", rw: "rw", desc: "Port 7 mode bits" },
          { name: "CNF7", bits: "31:30", rw: "rw", desc: "Port 7 configuration bits" },
        ],
      },
      { name: "CRH", offset: "0x04", reset: "0x44444444", desc: "Port configuration register high",
        fields: [
          { name: "MODE8", bits: "1:0", rw: "rw", desc: "Port 8 mode bits" },
          { name: "CNF8", bits: "3:2", rw: "rw", desc: "Port 8 configuration bits" },
          { name: "MODE9", bits: "5:4", rw: "rw", desc: "Port 9 mode bits" },
          { name: "CNF9", bits: "7:6", rw: "rw", desc: "Port 9 configuration bits" },
          { name: "MODE10", bits: "9:8", rw: "rw", desc: "Port 10 mode bits" },
          { name: "CNF10", bits: "11:10", rw: "rw", desc: "Port 10 configuration bits" },
          { name: "MODE11", bits: "13:12", rw: "rw", desc: "Port 11 mode bits" },
          { name: "CNF11", bits: "15:14", rw: "rw", desc: "Port 11 configuration bits" },
          { name: "MODE12", bits: "17:16", rw: "rw", desc: "Port 12 mode bits" },
          { name: "CNF12", bits: "19:18", rw: "rw", desc: "Port 12 configuration bits" },
          { name: "MODE13", bits: "21:20", rw: "rw", desc: "Port 13 mode bits" },
          { name: "CNF13", bits: "23:22", rw: "rw", desc: "Port 13 configuration bits" },
          { name: "MODE14", bits: "25:24", rw: "rw", desc: "Port 14 mode bits" },
          { name: "CNF14", bits: "27:26", rw: "rw", desc: "Port 14 configuration bits" },
          { name: "MODE15", bits: "29:28", rw: "rw", desc: "Port 15 mode bits" },
          { name: "CNF15", bits: "31:30", rw: "rw", desc: "Port 15 configuration bits" },
        ],
      },
      { name: "IDR", offset: "0x08", reset: "0x00000000", desc: "Port input data register",
        fields: [
          { name: "IDR0", bits: "0", rw: "r", desc: "Input data bit 0" },
          { name: "IDR1", bits: "1", rw: "r", desc: "Input data bit 1" },
          { name: "IDR2", bits: "2", rw: "r", desc: "Input data bit 2" },
          { name: "IDR3", bits: "3", rw: "r", desc: "Input data bit 3" },
          { name: "IDR4", bits: "4", rw: "r", desc: "Input data bit 4" },
          { name: "IDR5", bits: "5", rw: "r", desc: "Input data bit 5" },
          { name: "IDR6", bits: "6", rw: "r", desc: "Input data bit 6" },
          { name: "IDR7", bits: "7", rw: "r", desc: "Input data bit 7" },
          { name: "IDR8", bits: "8", rw: "r", desc: "Input data bit 8" },
          { name: "IDR9", bits: "9", rw: "r", desc: "Input data bit 9" },
          { name: "IDR10", bits: "10", rw: "r", desc: "Input data bit 10" },
          { name: "IDR11", bits: "11", rw: "r", desc: "Input data bit 11" },
          { name: "IDR12", bits: "12", rw: "r", desc: "Input data bit 12" },
          { name: "IDR13", bits: "13", rw: "r", desc: "Input data bit 13" },
          { name: "IDR14", bits: "14", rw: "r", desc: "Input data bit 14" },
          { name: "IDR15", bits: "15", rw: "r", desc: "Input data bit 15" },
        ],
      },
      { name: "ODR", offset: "0x0C", reset: "0x00000000", desc: "Port output data register",
        fields: [
          { name: "ODR0", bits: "0", rw: "rw", desc: "Output data bit 0" },
          { name: "ODR1", bits: "1", rw: "rw", desc: "Output data bit 1" },
          { name: "ODR2", bits: "2", rw: "rw", desc: "Output data bit 2" },
          { name: "ODR3", bits: "3", rw: "rw", desc: "Output data bit 3" },
          { name: "ODR4", bits: "4", rw: "rw", desc: "Output data bit 4" },
          { name: "ODR5", bits: "5", rw: "rw", desc: "Output data bit 5" },
          { name: "ODR6", bits: "6", rw: "rw", desc: "Output data bit 6" },
          { name: "ODR7", bits: "7", rw: "rw", desc: "Output data bit 7" },
          { name: "ODR8", bits: "8", rw: "rw", desc: "Output data bit 8" },
          { name: "ODR9", bits: "9", rw: "rw", desc: "Output data bit 9" },
          { name: "ODR10", bits: "10", rw: "rw", desc: "Output data bit 10" },
          { name: "ODR11", bits: "11", rw: "rw", desc: "Output data bit 11" },
          { name: "ODR12", bits: "12", rw: "rw", desc: "Output data bit 12" },
          { name: "ODR13", bits: "13", rw: "rw", desc: "Output data bit 13" },
          { name: "ODR14", bits: "14", rw: "rw", desc: "Output data bit 14" },
          { name: "ODR15", bits: "15", rw: "rw", desc: "Output data bit 15" },
        ],
      },
      { name: "BSRR", offset: "0x10", reset: "0x00000000", desc: "Port bit set/reset register",
        fields: [
          { name: "BS0", bits: "0", rw: "w", desc: "Set bit 0" },
          { name: "BS1", bits: "1", rw: "w", desc: "Set bit 1" },
          { name: "BS2", bits: "2", rw: "w", desc: "Set bit 2" },
          { name: "BS3", bits: "3", rw: "w", desc: "Set bit 3" },
          { name: "BS4", bits: "4", rw: "w", desc: "Set bit 4" },
          { name: "BS5", bits: "5", rw: "w", desc: "Set bit 5" },
          { name: "BS6", bits: "6", rw: "w", desc: "Set bit 6" },
          { name: "BS7", bits: "7", rw: "w", desc: "Set bit 7" },
          { name: "BS8", bits: "8", rw: "w", desc: "Set bit 8" },
          { name: "BS9", bits: "9", rw: "w", desc: "Set bit 9" },
          { name: "BS10", bits: "10", rw: "w", desc: "Set bit 10" },
          { name: "BS11", bits: "11", rw: "w", desc: "Set bit 11" },
          { name: "BS12", bits: "12", rw: "w", desc: "Set bit 12" },
          { name: "BS13", bits: "13", rw: "w", desc: "Set bit 13" },
          { name: "BS14", bits: "14", rw: "w", desc: "Set bit 14" },
          { name: "BS15", bits: "15", rw: "w", desc: "Set bit 15" },
          { name: "BR0", bits: "16", rw: "w", desc: "Reset bit 0" },
          { name: "BR1", bits: "17", rw: "w", desc: "Reset bit 1" },
          { name: "BR2", bits: "18", rw: "w", desc: "Reset bit 2" },
          { name: "BR3", bits: "19", rw: "w", desc: "Reset bit 3" },
          { name: "BR4", bits: "20", rw: "w", desc: "Reset bit 4" },
          { name: "BR5", bits: "21", rw: "w", desc: "Reset bit 5" },
          { name: "BR6", bits: "22", rw: "w", desc: "Reset bit 6" },
          { name: "BR7", bits: "23", rw: "w", desc: "Reset bit 7" },
          { name: "BR8", bits: "24", rw: "w", desc: "Reset bit 8" },
          { name: "BR9", bits: "25", rw: "w", desc: "Reset bit 9" },
          { name: "BR10", bits: "26", rw: "w", desc: "Reset bit 10" },
          { name: "BR11", bits: "27", rw: "w", desc: "Reset bit 11" },
          { name: "BR12", bits: "28", rw: "w", desc: "Reset bit 12" },
          { name: "BR13", bits: "29", rw: "w", desc: "Reset bit 13" },
          { name: "BR14", bits: "30", rw: "w", desc: "Reset bit 14" },
          { name: "BR15", bits: "31", rw: "w", desc: "Reset bit 15" },
        ],
      },
    ],
  },
  USART1: {
    name: "USART1",
    base: "0x40013800",
    desc: "Universal synchronous asynchronous receiver transmitter 1",
    registers: [
      { name: "SR", offset: "0x00", reset: "0x000000C0", desc: "Status register",
        fields: [
          { name: "PE", bits: "0", rw: "r", desc: "Parity error" },
          { name: "FE", bits: "1", rw: "r", desc: "Framing error" },
          { name: "NE", bits: "2", rw: "r", desc: "Noise error flag" },
          { name: "ORE", bits: "3", rw: "r", desc: "Overrun error" },
          { name: "IDLE", bits: "4", rw: "r", desc: "IDLE line detected" },
          { name: "RXNE", bits: "5", rw: "rc_w0", desc: "Read data register not empty" },
          { name: "TC", bits: "6", rw: "rc_w0", desc: "Transmission complete" },
          { name: "TXE", bits: "7", rw: "r", desc: "Transmit data register empty" },
          { name: "LBD", bits: "8", rw: "rc_w0", desc: "LIN break detection flag" },
          { name: "CTS", bits: "9", rw: "rc_w0", desc: "CTS flag" },
        ],
      },
      { name: "DR", offset: "0x04", reset: "0x00000000", desc: "Data register",
        fields: [
          { name: "DR", bits: "8:0", rw: "rw", desc: "Data value (transmit/receive)" },
        ],
      },
      { name: "BRR", offset: "0x08", reset: "0x00000000", desc: "Baud rate register",
        fields: [
          { name: "DIV_Fraction", bits: "3:0", rw: "rw", desc: "Fraction of USARTDIV" },
          { name: "DIV_Mantissa", bits: "15:4", rw: "rw", desc: "Mantissa of USARTDIV" },
        ],
      },
      { name: "CR1", offset: "0x0C", reset: "0x00000000", desc: "Control register 1",
        fields: [
          { name: "SBK", bits: "0", rw: "rw", desc: "Send break" },
          { name: "RWU", bits: "1", rw: "rw", desc: "Receiver wakeup" },
          { name: "RE", bits: "2", rw: "rw", desc: "Receiver enable" },
          { name: "TE", bits: "3", rw: "rw", desc: "Transmitter enable" },
          { name: "IDLEIE", bits: "4", rw: "rw", desc: "IDLE interrupt enable" },
          { name: "RXNEIE", bits: "5", rw: "rw", desc: "RXNE interrupt enable" },
          { name: "TCIE", bits: "6", rw: "rw", desc: "Transmission complete interrupt enable" },
          { name: "TXEIE", bits: "7", rw: "rw", desc: "TXE interrupt enable" },
          { name: "PEIE", bits: "8", rw: "rw", desc: "PE interrupt enable" },
          { name: "PS", bits: "9", rw: "rw", desc: "Parity selection (0=even, 1=odd)" },
          { name: "PCE", bits: "10", rw: "rw", desc: "Parity control enable" },
          { name: "WAKE", bits: "11", rw: "rw", desc: "Wakeup method" },
          { name: "M", bits: "12", rw: "rw", desc: "Word length (0=8bit, 1=9bit)" },
          { name: "UE", bits: "13", rw: "rw", desc: "USART enable" },
        ],
      },
      { name: "CR2", offset: "0x10", reset: "0x00000000", desc: "Control register 2",
        fields: [
          { name: "ADD", bits: "3:0", rw: "rw", desc: "Address of USART node" },
          { name: "LBDL", bits: "5", rw: "rw", desc: "LIN break detection length" },
          { name: "LBDIE", bits: "6", rw: "rw", desc: "LIN break detection interrupt enable" },
          { name: "LBCL", bits: "8", rw: "rw", desc: "Last bit clock pulse" },
          { name: "CPHA", bits: "9", rw: "rw", desc: "Clock phase" },
          { name: "CPOL", bits: "10", rw: "rw", desc: "Clock polarity" },
          { name: "CLKEN", bits: "11", rw: "rw", desc: "Clock enable" },
          { name: "STOP", bits: "13:12", rw: "rw", desc: "STOP bits (00=1, 10=2, 11=1.5)" },
          { name: "LINEN", bits: "14", rw: "rw", desc: "LIN mode enable" },
        ],
      },
    ],
  },
  SPI1: {
    name: "SPI1",
    base: "0x40013000",
    desc: "Serial peripheral interface 1",
    registers: [
      { name: "CR1", offset: "0x00", reset: "0x00000000", desc: "Control register 1",
        fields: [
          { name: "CPHA", bits: "0", rw: "rw", desc: "Clock phase (0=1st edge, 1=2nd edge)" },
          { name: "CPOL", bits: "1", rw: "rw", desc: "Clock polarity (0=idle low, 1=idle high)" },
          { name: "MSTR", bits: "2", rw: "rw", desc: "Master selection (0=slave, 1=master)" },
          { name: "BR", bits: "5:3", rw: "rw", desc: "Baud rate control (fPCLK/2^(BR+1))" },
          { name: "SPE", bits: "6", rw: "rw", desc: "SPI enable" },
          { name: "LSBFIRST", bits: "7", rw: "rw", desc: "Frame format (0=MSB first, 1=LSB first)" },
          { name: "SSI", bits: "8", rw: "rw", desc: "Internal slave select" },
          { name: "SSM", bits: "9", rw: "rw", desc: "Software slave management" },
          { name: "RXONLY", bits: "10", rw: "rw", desc: "Receive only mode" },
          { name: "DFF", bits: "11", rw: "rw", desc: "Data frame format (0=8bit, 1=16bit)" },
          { name: "CRCNEXT", bits: "12", rw: "rw", desc: "CRC transfer next" },
          { name: "CRCEN", bits: "13", rw: "rw", desc: "Hardware CRC calculation enable" },
          { name: "BIDIOE", bits: "14", rw: "rw", desc: "Output enable in bidirectional mode" },
          { name: "BIDIMODE", bits: "15", rw: "rw", desc: "Bidirectional data mode enable" },
        ],
      },
      { name: "CR2", offset: "0x04", reset: "0x00000000", desc: "Control register 2",
        fields: [
          { name: "RXDMAEN", bits: "0", rw: "rw", desc: "RX buffer DMA enable" },
          { name: "TXDMAEN", bits: "1", rw: "rw", desc: "TX buffer DMA enable" },
          { name: "SSOE", bits: "2", rw: "rw", desc: "SS output enable" },
          { name: "ERRIE", bits: "5", rw: "rw", desc: "Error interrupt enable" },
          { name: "RXNEIE", bits: "6", rw: "rw", desc: "RX buffer not empty interrupt enable" },
          { name: "TXEIE", bits: "7", rw: "rw", desc: "TX buffer empty interrupt enable" },
        ],
      },
      { name: "SR", offset: "0x08", reset: "0x00000002", desc: "Status register",
        fields: [
          { name: "RXNE", bits: "0", rw: "r", desc: "Receive buffer not empty" },
          { name: "TXE", bits: "1", rw: "r", desc: "Transmit buffer empty" },
          { name: "CHSIDE", bits: "2", rw: "r", desc: "Channel side" },
          { name: "UDR", bits: "3", rw: "r", desc: "Underrun flag" },
          { name: "CRCERR", bits: "4", rw: "rc_w0", desc: "CRC error flag" },
          { name: "MODF", bits: "5", rw: "r", desc: "Mode fault" },
          { name: "OVR", bits: "6", rw: "r", desc: "Overrun flag" },
          { name: "BSY", bits: "7", rw: "r", desc: "Busy flag" },
        ],
      },
      { name: "DR", offset: "0x0C", reset: "0x00000000", desc: "Data register",
        fields: [
          { name: "DR", bits: "15:0", rw: "rw", desc: "Data register" },
        ],
      },
      { name: "CRCPR", offset: "0x10", reset: "0x00000007", desc: "CRC polynomial register",
        fields: [
          { name: "CRCPOLY", bits: "15:0", rw: "rw", desc: "CRC polynomial register" },
        ],
      },
    ],
  },
  I2C1: {
    name: "I2C1",
    base: "0x40005400",
    desc: "Inter-integrated circuit interface 1",
    registers: [
      { name: "CR1", offset: "0x00", reset: "0x00000000", desc: "Control register 1",
        fields: [
          { name: "PE", bits: "0", rw: "rw", desc: "Peripheral enable" },
          { name: "SMBUS", bits: "1", rw: "rw", desc: "SMBus mode" },
          { name: "SMBTYPE", bits: "3", rw: "rw", desc: "SMBus type" },
          { name: "ENARP", bits: "4", rw: "rw", desc: "ARP enable" },
          { name: "ENPEC", bits: "5", rw: "rw", desc: "PEC enable" },
          { name: "ENGC", bits: "6", rw: "rw", desc: "General call enable" },
          { name: "NOSTRETCH", bits: "7", rw: "rw", desc: "Clock stretching disable" },
          { name: "START", bits: "8", rw: "rw", desc: "Start generation" },
          { name: "STOP", bits: "9", rw: "rw", desc: "Stop generation" },
          { name: "ACK", bits: "10", rw: "rw", desc: "Acknowledge enable" },
          { name: "POS", bits: "11", rw: "rw", desc: "Acknowledge/PEC position" },
          { name: "PEC", bits: "12", rw: "rw", desc: "Packet error checking" },
          { name: "ALERT", bits: "13", rw: "rw", desc: "SMBus alert" },
          { name: "SWRST", bits: "15", rw: "rw", desc: "Software reset" },
        ],
      },
      { name: "CR2", offset: "0x04", reset: "0x00000000", desc: "Control register 2",
        fields: [
          { name: "FREQ", bits: "5:0", rw: "rw", desc: "Peripheral clock frequency (MHz)" },
          { name: "ITERREN", bits: "8", rw: "rw", desc: "Error interrupt enable" },
          { name: "ITEVTEN", bits: "9", rw: "rw", desc: "Event interrupt enable" },
          { name: "ITBUFEN", bits: "10", rw: "rw", desc: "Buffer interrupt enable" },
          { name: "DMAEN", bits: "11", rw: "rw", desc: "DMA requests enable" },
          { name: "LAST", bits: "12", rw: "rw", desc: "DMA last transfer" },
        ],
      },
      { name: "OAR1", offset: "0x08", reset: "0x00000000", desc: "Own address register 1",
        fields: [
          { name: "ADD", bits: "9:0", rw: "rw", desc: "Interface address" },
          { name: "ADDMODE", bits: "15", rw: "rw", desc: "Addressing mode (0=7bit, 1=10bit)" },
        ],
      },
      { name: "DR", offset: "0x10", reset: "0x00000000", desc: "Data register",
        fields: [
          { name: "DR", bits: "7:0", rw: "rw", desc: "8-bit data register" },
        ],
      },
      { name: "SR1", offset: "0x14", reset: "0x00000000", desc: "Status register 1",
        fields: [
          { name: "SB", bits: "0", rw: "r", desc: "Start bit (master mode)" },
          { name: "ADDR", bits: "1", rw: "r", desc: "Address sent/matched" },
          { name: "BTF", bits: "2", rw: "r", desc: "Byte transfer finished" },
          { name: "ADD10", bits: "3", rw: "r", desc: "10-bit header sent" },
          { name: "STOPF", bits: "4", rw: "r", desc: "Stop detection (slave)" },
          { name: "RXNE", bits: "6", rw: "r", desc: "Data register not empty" },
          { name: "TXE", bits: "7", rw: "r", desc: "Data register empty" },
          { name: "BERR", bits: "8", rw: "rc_w0", desc: "Bus error" },
          { name: "ARLO", bits: "9", rw: "rc_w0", desc: "Arbitration lost" },
          { name: "AF", bits: "10", rw: "rc_w0", desc: "Acknowledge failure" },
          { name: "OVR", bits: "11", rw: "rc_w0", desc: "Overrun/Underrun" },
          { name: "PECERR", bits: "12", rw: "rc_w0", desc: "PEC error in reception" },
          { name: "TIMEOUT", bits: "14", rw: "rc_w0", desc: "Timeout or Tlow error" },
          { name: "SMBALERT", bits: "15", rw: "rc_w0", desc: "SMBus alert" },
        ],
      },
      { name: "SR2", offset: "0x18", reset: "0x00000000", desc: "Status register 2",
        fields: [
          { name: "MSL", bits: "0", rw: "r", desc: "Master/slave" },
          { name: "BUSY", bits: "1", rw: "r", desc: "Bus busy" },
          { name: "TRA", bits: "2", rw: "r", desc: "Transmitter/receiver" },
          { name: "GENCALL", bits: "4", rw: "r", desc: "General call address" },
          { name: "SMBDEFAULT", bits: "5", rw: "r", desc: "SMBus device default address" },
          { name: "SMBHOST", bits: "6", rw: "r", desc: "SMBus host header" },
          { name: "DUALF", bits: "7", rw: "r", desc: "Dual flag" },
          { name: "PEC", bits: "15:8", rw: "r", desc: "Packet error checking register" },
        ],
      },
    ],
  },
  TIM2: {
    name: "TIM2",
    base: "0x40000000",
    desc: "General purpose timer 2",
    registers: [
      { name: "CR1", offset: "0x00", reset: "0x00000000", desc: "Control register 1",
        fields: [
          { name: "CEN", bits: "0", rw: "rw", desc: "Counter enable" },
          { name: "UDIS", bits: "1", rw: "rw", desc: "Update disable" },
          { name: "URS", bits: "2", rw: "rw", desc: "Update request source" },
          { name: "OPM", bits: "3", rw: "rw", desc: "One pulse mode" },
          { name: "DIR", bits: "4", rw: "rw", desc: "Direction (0=up, 1=down)" },
          { name: "CMS", bits: "6:5", rw: "rw", desc: "Center-aligned mode selection" },
          { name: "ARPE", bits: "7", rw: "rw", desc: "Auto-reload preload enable" },
          { name: "CKD", bits: "9:8", rw: "rw", desc: "Clock division" },
        ],
      },
      { name: "DIER", offset: "0x0C", reset: "0x00000000", desc: "DMA/Interrupt enable register",
        fields: [
          { name: "UIE", bits: "0", rw: "rw", desc: "Update interrupt enable" },
          { name: "CC1IE", bits: "1", rw: "rw", desc: "Capture/Compare 1 interrupt enable" },
          { name: "CC2IE", bits: "2", rw: "rw", desc: "Capture/Compare 2 interrupt enable" },
          { name: "CC3IE", bits: "3", rw: "rw", desc: "Capture/Compare 3 interrupt enable" },
          { name: "CC4IE", bits: "4", rw: "rw", desc: "Capture/Compare 4 interrupt enable" },
          { name: "TIE", bits: "6", rw: "rw", desc: "Trigger interrupt enable" },
          { name: "UDE", bits: "8", rw: "rw", desc: "Update DMA request enable" },
        ],
      },
      { name: "SR", offset: "0x10", reset: "0x00000000", desc: "Status register",
        fields: [
          { name: "UIF", bits: "0", rw: "rc_w0", desc: "Update interrupt flag" },
          { name: "CC1IF", bits: "1", rw: "rc_w0", desc: "Capture/Compare 1 interrupt flag" },
          { name: "CC2IF", bits: "2", rw: "rc_w0", desc: "Capture/Compare 2 interrupt flag" },
          { name: "CC3IF", bits: "3", rw: "rc_w0", desc: "Capture/Compare 3 interrupt flag" },
          { name: "CC4IF", bits: "4", rw: "rc_w0", desc: "Capture/Compare 4 interrupt flag" },
          { name: "TIF", bits: "6", rw: "rc_w0", desc: "Trigger interrupt flag" },
          { name: "CC1OF", bits: "9", rw: "rc_w0", desc: "Capture/Compare 1 overcapture flag" },
        ],
      },
      { name: "CNT", offset: "0x24", reset: "0x00000000", desc: "Counter",
        fields: [
          { name: "CNT", bits: "15:0", rw: "rw", desc: "Counter value" },
        ],
      },
      { name: "PSC", offset: "0x28", reset: "0x00000000", desc: "Prescaler",
        fields: [
          { name: "PSC", bits: "15:0", rw: "rw", desc: "Prescaler value (CK_CNT = CK_PSC/(PSC+1))" },
        ],
      },
      { name: "ARR", offset: "0x2C", reset: "0x00000000", desc: "Auto-reload register",
        fields: [
          { name: "ARR", bits: "15:0", rw: "rw", desc: "Auto-reload value" },
        ],
      },
      { name: "CCR1", offset: "0x34", reset: "0x00000000", desc: "Capture/compare register 1",
        fields: [
          { name: "CCR1", bits: "15:0", rw: "rw", desc: "Capture/Compare 1 value" },
        ],
      },
      { name: "CCR2", offset: "0x38", reset: "0x00000000", desc: "Capture/compare register 2",
        fields: [
          { name: "CCR2", bits: "15:0", rw: "rw", desc: "Capture/Compare 2 value" },
        ],
      },
    ],
  },
  ADC1: {
    name: "ADC1",
    base: "0x40012400",
    desc: "Analog-to-digital converter 1",
    registers: [
      { name: "SR", offset: "0x00", reset: "0x00000000", desc: "Status register",
        fields: [
          { name: "AWD", bits: "0", rw: "rc_w0", desc: "Analog watchdog flag" },
          { name: "EOC", bits: "1", rw: "rc_w0", desc: "Regular channel end of conversion" },
          { name: "JEOC", bits: "2", rw: "rc_w0", desc: "Injected channel end of conversion" },
          { name: "JSTRT", bits: "3", rw: "rc_w0", desc: "Injected channel start flag" },
          { name: "STRT", bits: "4", rw: "rc_w0", desc: "Regular channel start flag" },
        ],
      },
      { name: "CR1", offset: "0x04", reset: "0x00000000", desc: "Control register 1",
        fields: [
          { name: "AWDCH", bits: "4:0", rw: "rw", desc: "Analog watchdog channel select" },
          { name: "EOCIE", bits: "5", rw: "rw", desc: "Interrupt enable for EOC" },
          { name: "AWDIE", bits: "6", rw: "rw", desc: "Analog watchdog interrupt enable" },
          { name: "JEOCIE", bits: "7", rw: "rw", desc: "Interrupt enable for injected channels" },
          { name: "SCAN", bits: "8", rw: "rw", desc: "Scan mode" },
          { name: "AWDSGL", bits: "9", rw: "rw", desc: "Enable watchdog on single channel" },
          { name: "JAUTO", bits: "10", rw: "rw", desc: "Automatic injected group conversion" },
          { name: "DISCEN", bits: "11", rw: "rw", desc: "Discontinuous mode on regular channels" },
          { name: "JDISCEN", bits: "12", rw: "rw", desc: "Discontinuous mode on injected channels" },
          { name: "DISCNUM", bits: "15:13", rw: "rw", desc: "Discontinuous mode channel count" },
          { name: "DUALMOD", bits: "19:16", rw: "rw", desc: "Dual mode selection" },
          { name: "AWDEN", bits: "23", rw: "rw", desc: "Analog watchdog enable on regular channels" },
          { name: "JAWDEN", bits: "24", rw: "rw", desc: "Analog watchdog enable on injected channels" },
        ],
      },
      { name: "CR2", offset: "0x08", reset: "0x00000000", desc: "Control register 2",
        fields: [
          { name: "ADON", bits: "0", rw: "rw", desc: "A/D converter ON/OFF" },
          { name: "CONT", bits: "1", rw: "rw", desc: "Continuous conversion" },
          { name: "CAL", bits: "2", rw: "rw", desc: "A/D calibration" },
          { name: "RSTCAL", bits: "3", rw: "rw", desc: "Reset calibration" },
          { name: "DMA", bits: "8", rw: "rw", desc: "Direct memory access mode" },
          { name: "ALIGN", bits: "11", rw: "rw", desc: "Data alignment (0=right, 1=left)" },
          { name: "JEXTSEL", bits: "14:12", rw: "rw", desc: "External event select for injected group" },
          { name: "JEXTTRIG", bits: "15", rw: "rw", desc: "External trigger conversion mode for injected channels" },
          { name: "EXTSEL", bits: "19:17", rw: "rw", desc: "External event select for regular group" },
          { name: "EXTTRIG", bits: "20", rw: "rw", desc: "External trigger conversion mode for regular channels" },
          { name: "JSWSTART", bits: "21", rw: "rw", desc: "Start conversion of injected channels" },
          { name: "SWSTART", bits: "22", rw: "rw", desc: "Start conversion of regular channels" },
          { name: "TSVREFE", bits: "23", rw: "rw", desc: "Temperature sensor and VREFINT enable" },
        ],
      },
      { name: "SMPR1", offset: "0x0C", reset: "0x00000000", desc: "Sample time register 1",
        fields: [
          { name: "SMP10", bits: "2:0", rw: "rw", desc: "Channel 10 sample time" },
          { name: "SMP11", bits: "5:3", rw: "rw", desc: "Channel 11 sample time" },
          { name: "SMP12", bits: "8:6", rw: "rw", desc: "Channel 12 sample time" },
          { name: "SMP13", bits: "11:9", rw: "rw", desc: "Channel 13 sample time" },
          { name: "SMP14", bits: "14:12", rw: "rw", desc: "Channel 14 sample time" },
          { name: "SMP15", bits: "17:15", rw: "rw", desc: "Channel 15 sample time" },
          { name: "SMP16", bits: "20:18", rw: "rw", desc: "Channel 16 sample time" },
          { name: "SMP17", bits: "23:21", rw: "rw", desc: "Channel 17 sample time" },
        ],
      },
      { name: "DR", offset: "0x4C", reset: "0x00000000", desc: "Regular data register",
        fields: [
          { name: "DATA", bits: "15:0", rw: "r", desc: "Regular data (12-bit result)" },
        ],
      },
    ],
  },
  RCC: {
    name: "RCC",
    base: "0x40021000",
    desc: "Reset and clock control",
    registers: [
      { name: "CR", offset: "0x00", reset: "0x00000083", desc: "Clock control register",
        fields: [
          { name: "HSION", bits: "0", rw: "rw", desc: "Internal high-speed clock enable" },
          { name: "HSIRDY", bits: "1", rw: "r", desc: "Internal high-speed clock ready" },
          { name: "HSITRIM", bits: "7:3", rw: "rw", desc: "Internal oscillator trimming" },
          { name: "HSICAL", bits: "15:8", rw: "r", desc: "Internal oscillator calibration" },
          { name: "HSEON", bits: "16", rw: "rw", desc: "HSE oscillator enable" },
          { name: "HSERDY", bits: "17", rw: "r", desc: "HSE oscillator ready" },
          { name: "HSEBYP", bits: "18", rw: "rw", desc: "HSE crystal oscillator bypass" },
          { name: "CSSON", bits: "19", rw: "rw", desc: "Clock security system enable" },
          { name: "PLLON", bits: "24", rw: "rw", desc: "PLL enable" },
          { name: "PLLRDY", bits: "25", rw: "r", desc: "PLL clock ready flag" },
        ],
      },
      { name: "CFGR", offset: "0x04", reset: "0x00000000", desc: "Clock configuration register",
        fields: [
          { name: "SW", bits: "1:0", rw: "rw", desc: "System clock switch (00=HSI, 01=HSE, 10=PLL)" },
          { name: "SWS", bits: "3:2", rw: "r", desc: "System clock switch status" },
          { name: "HPRE", bits: "7:4", rw: "rw", desc: "AHB prescaler" },
          { name: "PPRE1", bits: "10:8", rw: "rw", desc: "APB1 prescaler (low-speed)" },
          { name: "PPRE2", bits: "13:11", rw: "rw", desc: "APB2 prescaler (high-speed)" },
          { name: "ADCPRE", bits: "15:14", rw: "rw", desc: "ADC prescaler" },
          { name: "PLLSRC", bits: "16", rw: "rw", desc: "PLL entry clock source" },
          { name: "PLLXTPRE", bits: "17", rw: "rw", desc: "HSE divider for PLL entry" },
          { name: "PLLMUL", bits: "21:18", rw: "rw", desc: "PLL multiplication factor" },
          { name: "USBPRE", bits: "22", rw: "rw", desc: "USB prescaler" },
          { name: "MCO", bits: "26:24", rw: "rw", desc: "Microcontroller clock output" },
        ],
      },
      { name: "APB2ENR", offset: "0x18", reset: "0x00000000", desc: "APB2 peripheral clock enable register",
        fields: [
          { name: "AFIOEN", bits: "0", rw: "rw", desc: "Alternate function I/O clock enable" },
          { name: "IOPAEN", bits: "2", rw: "rw", desc: "I/O port A clock enable" },
          { name: "IOPBEN", bits: "3", rw: "rw", desc: "I/O port B clock enable" },
          { name: "IOPCEN", bits: "4", rw: "rw", desc: "I/O port C clock enable" },
          { name: "IOPDEN", bits: "5", rw: "rw", desc: "I/O port D clock enable" },
          { name: "IOPEEN", bits: "6", rw: "rw", desc: "I/O port E clock enable" },
          { name: "ADC1EN", bits: "9", rw: "rw", desc: "ADC 1 clock enable" },
          { name: "ADC2EN", bits: "10", rw: "rw", desc: "ADC 2 clock enable" },
          { name: "TIM1EN", bits: "11", rw: "rw", desc: "TIM1 clock enable" },
          { name: "SPI1EN", bits: "12", rw: "rw", desc: "SPI1 clock enable" },
          { name: "USART1EN", bits: "14", rw: "rw", desc: "USART1 clock enable" },
        ],
      },
      { name: "APB1ENR", offset: "0x1C", reset: "0x00000000", desc: "APB1 peripheral clock enable register",
        fields: [
          { name: "TIM2EN", bits: "0", rw: "rw", desc: "TIM 2 clock enable" },
          { name: "TIM3EN", bits: "1", rw: "rw", desc: "TIM 3 clock enable" },
          { name: "TIM4EN", bits: "2", rw: "rw", desc: "TIM 4 clock enable" },
          { name: "SPI2EN", bits: "14", rw: "rw", desc: "SPI 2 clock enable" },
          { name: "USART2EN", bits: "17", rw: "rw", desc: "USART 2 clock enable" },
          { name: "USART3EN", bits: "18", rw: "rw", desc: "USART 3 clock enable" },
          { name: "I2C1EN", bits: "21", rw: "rw", desc: "I2C 1 clock enable" },
          { name: "I2C2EN", bits: "22", rw: "rw", desc: "I2C 2 clock enable" },
          { name: "USBEN", bits: "23", rw: "rw", desc: "USB clock enable" },
          { name: "CANEN", bits: "25", rw: "rw", desc: "CAN clock enable" },
          { name: "BKPEN", bits: "27", rw: "rw", desc: "Backup interface clock enable" },
          { name: "PWREN", bits: "28", rw: "rw", desc: "Power interface clock enable" },
        ],
      },
    ],
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatValue(value: number, format: "hex" | "bin" | "dec", bits: number): string {
  const mask = bits >= 32 ? 0xffffffff : (1 << bits) - 1;
  const v = value & mask;
  switch (format) {
    case "hex":
      return "0x" + v.toString(16).toUpperCase().padStart(Math.ceil(bits / 4), "0");
    case "bin":
      return "0b" + v.toString(2).padStart(bits, "0");
    case "dec":
      return v.toString();
  }
}

function rwBadge(rw: string): { label: string; color: string } {
  switch (rw) {
    case "rw":
      return { label: "RW", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" };
    case "r":
      return { label: "R", color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" };
    case "w":
      return { label: "W", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" };
    case "rc_w0":
      return { label: "RC_W0", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" };
    default:
      return { label: rw.toUpperCase(), color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" };
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function RegisterViewer() {
  const [selectedPeripheral, setSelectedPeripheral] = useState("GPIOA");
  const [expandedReg, setExpandedReg] = useState<string | null>(null);
  const [bitValues, setBitValues] = useState<Record<string, number>>({});
  const [valueFormat, setValueFormat] = useState<"hex" | "bin" | "dec">("hex");

  const peripheral = PERIPHERALS[selectedPeripheral];

  const handlePeripheralChange = (name: string) => {
    setSelectedPeripheral(name);
    setExpandedReg(null);
    setBitValues({});
  };

  const toggleBit = (regName: string, bitIndex: number) => {
    const key = `${regName}_${bitIndex}`;
    const current = bitValues[key] ?? 0;
    setBitValues((prev) => ({ ...prev, [key]: current ? 0 : 1 }));
  };

  const getRegValue = (reg: Register): number => {
    let val = parseInt(reg.reset, 16);
    for (let i = 0; i < 32; i++) {
      const key = `${reg.name}_${i}`;
      if (bitValues[key] !== undefined) {
        if (bitValues[key]) val |= 1 << i;
        else val &= ~(1 << i);
      }
    }
    return val;
  };

  const resetRegValue = (regName: string) => {
    setBitValues((prev) => {
      const next = { ...prev };
      for (let i = 0; i < 32; i++) {
        delete next[`${regName}_${i}`];
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-text-primary mb-4">Register Viewer</h2>
      <p className="text-sm text-text-secondary mb-4">
        Explore MCU peripheral registers with bit-level detail. Click a register row to expand, click individual bits to toggle them.
      </p>

      {/* Peripheral selector and format toggle */}
      <div className="flex gap-3 items-center flex-wrap">
        <label className="text-xs text-text-tertiary">Peripheral:</label>
        <select
          value={selectedPeripheral}
          onChange={(e) => handlePeripheralChange(e.target.value)}
          className="p-2 text-sm font-mono border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:border-accent/50"
        >
          {Object.entries(PERIPHERALS).map(([key, p]) => (
            <option key={key} value={key}>{key} - {p.desc}</option>
          ))}
        </select>
        <span className="text-xs text-text-tertiary font-mono ml-2">
          Base: {peripheral.base}
        </span>
        <div className="ml-auto flex gap-1">
          {(["hex", "bin", "dec"] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setValueFormat(fmt)}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                valueFormat === fmt ? "bg-accent text-white" : "border border-border text-text-secondary"
              }`}
            >
              {fmt.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Register list */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-[100px_60px_110px_110px_1fr] bg-muted text-xs text-text-tertiary font-medium">
          <div className="px-3 py-2">Register</div>
          <div className="px-3 py-2">Offset</div>
          <div className="px-3 py-2">Reset Value</div>
          <div className="px-3 py-2">Current Value</div>
          <div className="px-3 py-2">Description</div>
        </div>

        {peripheral.registers.map((reg) => {
          const isExpanded = expandedReg === reg.name;
          const value = getRegValue(reg);
          const resetVal = parseInt(reg.reset, 16);

          return (
            <div key={reg.name}>
              {/* Register row */}
              <button
                onClick={() => setExpandedReg(isExpanded ? null : reg.name)}
                className={`w-full grid grid-cols-[100px_60px_110px_110px_1fr] border-t border-border text-sm text-left transition-colors hover:bg-surface-hover ${
                  isExpanded ? "bg-accent/5" : ""
                }`}
              >
                <div className="px-3 py-2 font-mono font-medium text-accent flex items-center gap-1.5">
                  <svg
                    className={`w-3 h-3 text-text-tertiary transition-transform shrink-0 ${isExpanded ? "rotate-90" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                  {reg.name}
                </div>
                <div className="px-3 py-2 font-mono text-xs text-text-secondary">{reg.offset}</div>
                <div className="px-3 py-2 font-mono text-xs text-text-tertiary">{reg.reset}</div>
                <div className="px-3 py-2 font-mono text-xs text-accent">
                  {formatValue(value, valueFormat, 32)}
                </div>
                <div className="px-3 py-2 text-text-secondary text-xs truncate">{reg.desc}</div>
              </button>

              {/* Expanded bit fields */}
              {isExpanded && (
                <div className="border-t border-border bg-muted/50">
                  {/* 32-bit visual grid */}
                  <div className="px-4 pt-3 pb-2">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-text-tertiary">Current:</span>
                      <code className="font-mono text-sm text-accent bg-surface px-3 py-1 rounded border border-border">
                        {formatValue(value, valueFormat, 32)}
                      </code>
                      <button
                        onClick={() => resetRegValue(reg.name)}
                        className="px-2 py-0.5 text-xs border border-border rounded text-text-tertiary hover:text-text-secondary transition-colors"
                      >
                        Reset
                      </button>
                    </div>

                    {/* Bit number labels */}
                    <div className="flex gap-0.5 justify-end mb-0.5">
                      {Array.from({ length: 32 }).map((_, i) => {
                        const bitIdx = 31 - i;
                        return (
                          <div key={bitIdx} className="w-6 text-center text-[8px] text-text-tertiary font-mono select-none">
                            {bitIdx}
                          </div>
                        );
                      })}
                    </div>

                    {/* Bit buttons */}
                    <div className="flex gap-0.5 justify-end">
                      {Array.from({ length: 32 }).map((_, i) => {
                        const bitIdx = 31 - i;
                        const key = `${reg.name}_${bitIdx}`;
                        const bit = bitValues[key] ?? ((resetVal >> bitIdx) & 1);
                        const field = reg.fields.find((f) => {
                          if (f.bits.includes(":")) {
                            const [hi, lo] = f.bits.split(":").map(Number);
                            return bitIdx >= lo && bitIdx <= hi;
                          }
                          return parseInt(f.bits) === bitIdx;
                        });
                        const isWritable = field && (field.rw === "rw" || field.rw === "w");

                        return (
                          <button
                            key={bitIdx}
                            onClick={() => isWritable && toggleBit(reg.name, bitIdx)}
                            className={`w-6 h-7 text-[10px] font-mono font-medium rounded-sm transition-colors border ${
                              bit
                                ? "bg-accent text-white border-accent"
                                : "bg-surface text-text-tertiary border-border"
                            } ${isWritable ? "cursor-pointer hover:ring-1 hover:ring-accent/50" : "cursor-default opacity-80"}`}
                            title={field ? `${field.name} [${field.bits}] ${field.desc}` : `Bit ${bitIdx}`}
                          >
                            {bit}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bit field details */}
                  <div className="px-4 pb-3">
                    <div className="space-y-0.5">
                      {reg.fields.map((field) => {
                        const badge = rwBadge(field.rw);
                        const fieldBits = field.bits.includes(":")
                          ? field.bits.split(":").map(Number)
                          : [parseInt(field.bits), parseInt(field.bits)];
                        const fieldWidth = fieldBits[0] - fieldBits[1] + 1;
                        const fieldMask = fieldWidth >= 32 ? 0xffffffff : (1 << fieldWidth) - 1;
                        const fieldVal = (value >> fieldBits[1]) & fieldMask;

                        return (
                          <div
                            key={field.name}
                            className="flex items-center gap-3 py-1 px-2 rounded hover:bg-surface/50 transition-colors"
                          >
                            <code className="font-mono text-xs text-accent font-medium w-24 shrink-0 truncate">
                              {field.name}
                            </code>
                            <span className="text-[10px] text-text-tertiary font-mono w-14 shrink-0">
                              [{field.bits}]
                            </span>
                            <span
                              className={`px-1.5 py-0.5 text-[9px] font-mono font-medium rounded shrink-0 ${badge.color}`}
                            >
                              {badge.label}
                            </span>
                            <code className="font-mono text-xs text-text-primary shrink-0 w-20">
                              {formatValue(fieldVal, valueFormat, fieldWidth)}
                            </code>
                            <span className="text-xs text-text-secondary">{field.desc}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
