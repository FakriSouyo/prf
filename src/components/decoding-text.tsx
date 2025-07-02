"use client"
import { useState, useEffect } from "react"

interface DecodingTextProps {
  text: string
  className?: string
}

export function DecodingText({ text, className = "" }: DecodingTextProps) {
  const [displayText, setDisplayText] = useState("")
  const [isDecoding, setIsDecoding] = useState(false)

  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"

  const startDecoding = () => {
    if (isDecoding) return

    setIsDecoding(true)
    let iteration = 0

    const interval = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index]
            }
            return characters[Math.floor(Math.random() * characters.length)]
          })
          .join(""),
      )

      if (iteration >= text.length) {
        clearInterval(interval)
        setIsDecoding(false)
      }

      iteration += 1 / 3
    }, 30)
  }

  useEffect(() => {
    setDisplayText(text)
  }, [text])

  return (
    <span className={className} onMouseEnter={startDecoding} style={{ fontFamily: "monospace" }}>
      {displayText}
    </span>
  )
}
