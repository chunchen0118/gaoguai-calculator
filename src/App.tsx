import { useState, useCallback, useMemo } from 'react'
import './App.css'

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const SYMBOLS = ['+', '−', '×', '÷']

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
    symbolButtons: Array.from({ length: 4 }, (_, i) => shuffledSymbols[i]),
  }
}

function evaluateExpression(tokens: string[]): string | null {
  if (tokens.length === 0) return null
  
  const expr = tokens
    .join('')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
  
  if (!/^[\d+\-*/]+$/.test(expr)) return null
  if (/[+\-*/]{2,}/.test(expr)) return null
  if (/^[+*/]+|[+\-*/]+$/.test(expr)) return null
  
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

type Token = {
  type: 'number' | 'symbol'
  value: string
}

function App() {
  const [mapping, setMapping] = useState(generateButtonMapping)
  const [tokens, setTokens] = useState<Token[]>([])
  const [isRevealed, setIsRevealed] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleNewGame = useCallback(() => {
    setMapping(generateButtonMapping())
    setTokens([])
    setIsRevealed(false)
    setResult(null)
  }, [])

  const handleNumberClick = useCallback((buttonIndex: number) => {
    if (isRevealed) return
    const value = mapping.numberButtons[buttonIndex]
    setTokens(prev => [...prev, { type: 'number', value }])
  }, [mapping.numberButtons, isRevealed])

  const handleSymbolClick = useCallback((buttonIndex: number) => {
    if (isRevealed) return
    const value = mapping.symbolButtons[buttonIndex]
    setTokens(prev => [...prev, { type: 'symbol', value }])
  }, [mapping.symbolButtons, isRevealed])

  const handleEquals = useCallback(() => {
    if (tokens.length === 0) return
    const tokenValues = tokens.map(t => t.value)
    const evalResult = evaluateExpression(tokenValues)
    setIsRevealed(true)
    setResult(evalResult)
  }, [tokens])

  const handleDelete = useCallback(() => {
    if (isRevealed) return
    setTokens(prev => prev.slice(0, -1))
  }, [isRevealed])

  const handleClear = useCallback(() => {
    setTokens([])
    setIsRevealed(false)
    setResult(null)
  }, [])

  const displayContent = useMemo(() => {
    if (tokens.length === 0) {
      return <span className="placeholder-empty">_</span>
    }
    
    if (isRevealed) {
      return (
        <>
          {tokens.map((token, i) => (
            <span key={i} className={`revealed-token ${token.type}`}>
              {token.value}
            </span>
          ))}
          <span className="equals-sign">=</span>
        </>
      )
    }
    
    return tokens.map((token, i) => (
      <span key={i} className={`placeholder ${token.type}`}>
        ■
      </span>
    ))
  }, [tokens, isRevealed])

  return (
    <div className="app">
      <header className="header">
        <h1>搞怪計算機</h1>
        <p className="subtitle">按下神秘按鈕，按 = 揭曉答案！</p>
      </header>

      <div className="calculator">
        <div className="display">
          <div className="expression">{displayContent}</div>
          {isRevealed && result !== null && (
            <div className="result">{result}</div>
          )}
          {isRevealed && result === null && (
            <div className="result error">無效算式</div>
          )}
        </div>

        <div className="keypad">
          <div className="number-zone">
            <div className="zone-label">數字區</div>
            <div className="number-grid">
              {mapping.numberButtons.map((_, index) => (
                <button
                  key={`num-${index}`}
                  className="key number-key"
                  onClick={() => handleNumberClick(index)}
                  disabled={isRevealed}
                  aria-label={`神秘數字按鈕 ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="symbol-zone">
            <div className="zone-label">符號區</div>
            <div className="symbol-grid">
              {mapping.symbolButtons.map((_, index) => (
                <button
                  key={`sym-${index}`}
                  className="key symbol-key"
                  onClick={() => handleSymbolClick(index)}
                  disabled={isRevealed}
                  aria-label={`神秘符號按鈕 ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="controls">
          <button 
            className="control-btn equals-btn" 
            onClick={handleEquals} 
            disabled={isRevealed || tokens.length === 0}
            aria-label="計算結果"
          >
            = 揭曉
          </button>
          <button 
            className="control-btn delete-btn" 
            onClick={handleDelete} 
            disabled={isRevealed}
            aria-label="刪除最後一個"
          >
            ⌫ 刪除
          </button>
          <button 
            className="control-btn clear-btn" 
            onClick={handleClear}
            aria-label="清除全部"
          >
            C 清除
          </button>
          <button 
            className="control-btn new-game-btn" 
            onClick={handleNewGame} 
            aria-label="重新開始遊戲"
          >
            🔄 新局
          </button>
        </div>
      </div>

      <footer className="footer">
        <p>提示：每個神秘按鈕對應一個固定的數字或符號，但你看不到！</p>
        <p className="hint">組合算式後按「= 揭曉」查看結果，「新局」會重新洗牌</p>
      </footer>
    </div>
  )
}

export default App
