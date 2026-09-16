# 搞怪計算機 🎮

一個有趣的記憶遊戲，外觀像計算機，但按鈕不顯示數字或符號！

## 遊戲玩法

這是一個偽裝成計算機的記憶遊戲：

1. **空白按鈕**：所有數字和符號按鈕都是空白的，你看不到它們代表什麼
2. **兩個區域**：
   - **數字區**：10 個按鈕，分別對應 0-9（但順序是隨機的）
   - **符號區**：6 個按鈕，對應 +、−、×、÷、=、.
3. **揭示機制**：當你按下按鈕時，會顯示並記住它的隱藏值
4. **目標**：靠記憶力記住每個按鈕對應的數字或符號，嘗試組成正確的算式！

## 遊戲規則

- 每次「重新開始」會重新洗牌所有按鈕的對應值
- 在同一局遊戲中，每個按鈕的值是固定的（這讓你可以透過嘗試來記住它們）
- 按下「=」符號會計算目前輸入的算式
- 使用「刪除」移除最後一個輸入
- 使用「清除」清空整個算式

## 設計決策

**按鈕映射策略**：採用「單局固定映射」的設計。在一局遊戲中，每個按鈕的隱藏值保持不變，讓玩家可以通過反覆嘗試來學習和記憶按鈕的位置。這比「每次點擊都隨機」更有遊戲性，讓玩家有機會掌握規律並完成目標。

## 開始遊戲

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build
```

## 技術棧

- [Vite](https://vitejs.dev/) - 快速的前端建置工具
- [React](https://react.dev/) - UI 函式庫
- [TypeScript](https://www.typescriptlang.org/) - 型別安全的 JavaScript

## 功能特色

- 🎯 記憶遊戲機制
- 📱 響應式設計，支援手機和桌面
- ♿ 無障礙支援（鍵盤導航、ARIA 標籤）
- 🎨 現代化 UI 設計
- ⚡ 即時運算反饋

---

# Quirky Calculator Game 🎮

A fun memory game disguised as a calculator — buttons show no digits or symbols!

## How to Play

1. **Blank buttons**: All number and symbol buttons are unlabeled
2. **Two zones**: 
   - Number zone: 10 buttons randomly mapped to 0-9
   - Symbol zone: 6 buttons randomly mapped to +, −, ×, ÷, =, .
3. **Reveal on click**: When you press a button, its hidden value is revealed and remembered
4. **Goal**: Memorize button positions and build correct expressions!

## Quick Start

```bash
npm install && npm run dev
```

## License

MIT
