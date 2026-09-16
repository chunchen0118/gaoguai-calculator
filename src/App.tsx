import { useState, useCallback, useMemo } from 'react'
import './App.css'

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const SYMBOLS = ['+', '−', '×', '÷', '=', '.']

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function generateButtonMapping() {
  const shuffledDigits = shuffleArray(DIGITS)
  const shuffledSymbols = shuffleArray(SYMBOLS)
  
  return {
    numberButtons: Array.from({ length: 10 }, (_, i) => shuffledDigits[i]),
    symbolButtons: Array.from({ length: 6 }, (_, i) => shuffledSymbols[i]),
  }
}

function evaluateExpression(tokens: string[]): string | null {
  if (tokens.length === 0) return null
  
  const expr = tokens
    .join('')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
  
  if (!/^[\d+\-*/.]+$/.test(expr)) return null
  if (/[+\-*/.]{2,}/.test(expr)) return null
  if (/^[+*/.]+|[+\-*/.]+$/.test(expr)) return null
  
  try {
    const result = Function(`"use strict"; return (${expr})`)()
    if (typeof result === 'number' && isFinite(result)) {
      return Number.isInteger(result) ? result.toString() : result.toFixed(6).replace(/\.?0+$/, '')
    }
    return null
  } catch {
    return null
  }
}

function App() {
  const [mapping, setMapping] = useState(generateButtonMapping)
  const [expression, setExpression] = useState<string[]>([])
  const [result, setResult] = useState<string | null>(null)
  const [revealedButtons, setRevealedButtons] = useState<Set<string>>(new Set())

  const handleNewGame = useCallback(() => {
    setMapping(generateButtonMapping())
    setExpression([])
    setResult(null)
    setRevealedButtons(new Set())
  }, [])

  const handleNumberClick = useCallback((buttonIndex: number) => {
    const value = mapping.numberButtons[buttonIndex]
    setExpression(prev => [...prev, value])
    setRevealedButtons(prev => new Set([...prev, `num-${buttonIndex}`]))
    setResult(null)
  }, [mapping.numberButtons])

  const handleSymbolClick = useCallback((buttonIndex: number) => {
    const value = mapping.symbolButtons[buttonIndex]
    
    if (value === '=') {
      const evalResult = evaluateExpression(expression)
      setExpression(prev => [...prev, '='])
      setResult(evalResult)
      setRevealedButtons(prev => new Set([...prev, `sym-${buttonIndex}`]))
    } else {
      setExpression(prev => [...prev, value])
      setRevealedButtons(prev => new Set([...prev, `sym-${buttonIndex}`]))
      setResult(null)
    }
  }, [mapping.symbolButtons, expression])

  const handleDelete = useCallback(() => {
    setExpression(prev => prev.slice(0, -1))
    setResult(null)
  }, [])

  const handleClear = useCallback(() => {
    setExpression([])
    setResult(null)
  }, [])

  const displayText = useMemo(() => {
    if (expression.length === 0) return '0'
    return expression.join('')
  }, [expression])

  return (
    <div className="app">
      <header className="header">
        <h1>搞怪計算機</h1>
        <p className="subtitle">按鈕不顯示數字，靠記憶找出隱藏的值！</p>
      </header>

      <div className="calculator">
        <div className="display">
          <div className="expression">{displayText}</div>
          {result !== null && (
            <div className="result">= {result}</div>
          )}
        </div>

        <div className="keypad">
          <div className="number-zone">
            <div className="zone-label">數字區</div>
            <div className="number-grid">
              {mapping.numberButtons.map((_, index) => (
                <button
                  key={`num-${index}`}
                  className={`key number-key ${revealedButtons.has(`num-${index}`) ? 'revealed' : ''}`}
                  onClick={() => handleNumberClick(index)}
                  aria-label={`數字按鈕 ${index + 1}`}
                >
                  {revealedButtons.has(`num-${index}`) && (
                    <span className="revealed-value">{mapping.numberButtons[index]}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="symbol-zone">
            <div className="zone-label">符號區</div>
            <div className="symbol-grid">
              {mapping.symbolButtons.map((_, index) => (
                <button
                  key={`sym-${index}`}
                  className={`key symbol-key ${revealedButtons.has(`sym-${index}`) ? 'revealed' : ''}`}
                  onClick={() => handleSymbolClick(index)}
                  aria-label={`符號按鈕 ${index + 1}`}
                >
                  {revealedButtons.has(`sym-${index}`) && (
                    <span className="revealed-value">{mapping.symbolButtons[index]}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="controls">
          <button className="control-btn delete-btn" onClick={handleDelete} aria-label="刪除最後一個字符">
            ⌫ 刪除
          </button>
          <button className="control-btn clear-btn" onClick={handleClear} aria-label="清除全部">
            C 清除
          </button>
          <button className="control-btn new-game-btn" onClick={handleNewGame} aria-label="重新開始遊戲">
            🔄 重新開始
          </button>
        </div>
      </div>

      <footer className="footer">
        <p>提示：每次按下按鈕會顯示其隱藏的值，試著記住每個按鈕對應的數字或符號！</p>
        <p className="hint">按「重新開始」會重新洗牌所有按鈕的對應值</p>
      </footer>
    </div>
  )
}

export default App
