# 自動化發佈 JavaScript 專案到 npm 與 CDN

以下是自動化將 JavaScript 專案發佈到 npm 並提供 CDN 的完整步驟，並結合 GitHub Actions 實現自動化。

---

## **步驟 1: 建立專案環境**

1. **建立專案資料夾**：
   ```bash
   mkdir my-js-project
   cd my-js-project
   ```

2. **初始化專案**：
   ```bash
   npm init -y
   ```

3. **初始化 Git 並新增 `.gitignore`**：
   ```bash
   git init
   echo "node_modules/" > .gitignore
   ```

---

## **步驟 2: 開發專案**

1. **新增主程式文件**：
   ```bash
   mkdir src
   touch src/index.js
   ```

2. **撰寫 JavaScript 代碼**：
   ```javascript
   export function sayHello(name) {
       return `Hello, ${name}!`;
   }
   ```

3. **設定打包工具 (可選)**：
   安裝 Rollup 並配置打包：
   ```bash
   npm install rollup --save-dev
   ```

   建立 `rollup.config.js`：
   ```javascript
   export default {
       input: 'src/index.js',
       output: {
           file: 'dist/bundle.js',
           format: 'umd',
           name: 'MyJsProject'
       }
   };
   ```

   更新 `package.json` 的 scripts：
   ```json
   "scripts": {
       "build": "rollup -c"
   }
   ```

---

## **步驟 3: 發佈到 GitHub**

1. **建立 GitHub Repository**：
   - 登入 GitHub，創建新的 Repository（例如 `my-js-project`）。

2. **將專案推送到 GitHub**：
   ```bash
   git remote add origin https://github.com/<username>/my-js-project.git
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git push -u origin main
   ```

---

## **步驟 4: 發佈到 npm**

1. **登入 npm**：
   ```bash
   npm login
   ```

2. **更新 `package.json` 配置**：
   ```json
   {
       "name": "my-js-project",
       "version": "1.0.0",
       "main": "dist/bundle.js",
       "files": ["dist"],
       "keywords": ["js", "example"],
       "author": "Your Name",
       "license": "MIT"
   }
   ```

3. **打包並發佈**：
   ```bash
   npm run build
   npm publish
   ```

---

## **步驟 5: 使用 CDN 提供檔案**

### **unpkg**
1. `unpkg` 會自動提供 npm 包的文件。
2. 使用範例：
   ```html
   <script src="https://unpkg.com/my-js-project/dist/bundle.js"></script>
   ```

### **jsDelivr**
1. `jsDelivr` 同樣基於 npm，無需額外操作。
2. 使用範例：
   ```html
   <script src="https://cdn.jsdelivr.net/npm/my-js-project/dist/bundle.js"></script>
   ```

---

## **步驟 6: 設定 GitHub Actions 自動化發佈**

1. **建立 npm 發佈 Token**：
   - 登入 npm，前往 [Access Tokens](https://www.npmjs.com/settings/your-username/tokens)。
   - 創建 **Automation** 類型的 Token，並記下。

2. **新增 GitHub Secrets**：
   - 前往 `Settings > Secrets and variables > Actions`。
   - 新增一個 Secret：
     - 名稱：`NPM_TOKEN`
     - 內容：貼上剛才的 Token。

3. **建立 GitHub Actions Workflow**：
   建立 `.github/workflows/publish.yml` 文件：
   ```yaml
   name: Publish to npm

   on:
     push:
       branches:
         - release

   jobs:
     publish:
       runs-on: ubuntu-latest

       steps:
       - name: Checkout code
         uses: actions/checkout@v3

       - name: Setup Node.js
         uses: actions/setup-node@v3
         with:
           node-version: 16
           cache: 'npm'

       - name: Install dependencies
         run: npm install

       - name: Build the project
         run: npm run build

       - name: Publish to npm
         env:
           NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
         run: npm publish
   ```

4. **測試流程**：
   - 推送或合併程式到 `release` 分支。
   - 確認 Actions 是否成功執行。

---

## **可選優化**

1. **自動版本更新**：
   使用 [standard-version](https://github.com/conventional-changelog/standard-version) 自動管理版本：
   ```bash
   npm install standard-version --save-dev
   ```

   在 Workflow 中新增：
   ```yaml
   - name: Bump version
     run: npx standard-version --release-as patch

   - name: Push updated version
     run: |
       git push --follow-tags origin release
   ```

2. **加入測試步驟**：
   在發佈前執行測試：
   ```yaml
   - name: Run tests
     run: npm test
   ```

3. **測試覆蓋率檢查**：
   在發佈前檢查測試覆蓋率：
   ```yaml
   - name: Check test coverage
     run: |
       npm run test:coverage
       codecov
   ```

---

透過以上設定，當你將程式推送到 `release` 分支後，GitHub Actions 會自動打包、測試並發佈到 npm，並通過 CDN 提供服務！
